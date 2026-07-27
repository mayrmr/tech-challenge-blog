import React, { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import api, { resolveUploadUrl } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../theme/colors";
import { AppStackParamList } from "../navigation/types";
import { Comment, Post } from "../types";
import Button from "../components/Button";
import TextField from "../components/TextField";

type Nav = NativeStackNavigationProp<AppStackParamList, "PostDetail">;
type Rt = RouteProp<AppStackParamList, "PostDetail">;

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PostDetailScreen() {
  const { postId } = useRoute<Rt>().params;
  const navigation = useNavigation<Nav>();
  const { user, isProfessor } = useAuth();
  const colors = useTheme();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [textoEditando, setTextoEditando] = useState("");

  async function carregarPost() {
    try {
      const response = await api.get<Post>(`/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao carregar post");
    }
  }

  async function carregarComentarios() {
    try {
      const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao carregar comentários");
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarPost();
      carregarComentarios();
    }, [postId])
  );

  function excluirPost() {
    Alert.alert("Excluir post", "Deseja realmente excluir este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/posts/${postId}`);
            navigation.navigate("Home");
          } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Erro ao excluir post");
          }
        },
      },
    ]);
  }

  async function curtirPost() {
    try {
      const response = await api.post<Post>(`/posts/${postId}/like`, {
        usuarioId: user?._id,
      });
      setPost(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao curtir post");
    }
  }

  async function criarComentario() {
    if (!novoComentario.trim()) {
      Alert.alert("Atenção", "Digite um comentário.");
      return;
    }

    try {
      await api.post(`/posts/${postId}/comments`, {
        texto: novoComentario,
        autor: user?.nome,
        usuarioId: user?._id,
      });

      setNovoComentario("");
      carregarComentarios();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao criar comentário");
    }
  }

  function iniciarEdicao(comment: Comment) {
    setEditandoId(comment._id);
    setTextoEditando(comment.texto);
  }

  async function salvarEdicao(commentId: string) {
    if (!textoEditando.trim()) {
      Alert.alert("Atenção", "O comentário não pode ficar vazio.");
      return;
    }

    try {
      await api.put(`/comments/${commentId}`, {
        texto: textoEditando,
        usuarioId: user?._id,
        perfil: user?.perfil,
      });

      setEditandoId(null);
      setTextoEditando("");
      carregarComentarios();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao editar comentário");
    }
  }

  function excluirComentario(commentId: string) {
    Alert.alert("Excluir comentário", "Deseja realmente excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/comments/${commentId}`, {
              data: { usuarioId: user?._id, perfil: user?.perfil },
            });
            carregarComentarios();
          } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Erro ao excluir comentário");
          }
        },
      },
    ]);
  }

  async function curtirComentario(commentId: string) {
    try {
      await api.post(`/comments/${commentId}/like`, { usuarioId: user?._id });
      carregarComentarios();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao curtir comentário");
    }
  }

  function podeEditarOuExcluir(comment: Comment) {
    return comment.usuarioId === user?._id || isProfessor;
  }

  if (!post) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, padding: 16 }}>
          Carregando post...
        </Text>
      </View>
    );
  }

  const usuarioCurtiu = post.likes?.some((id) => id === user?._id);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSoft, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.textHeading }]}>
          {post.titulo}
        </Text>
        <Text style={[styles.date, { color: colors.text }]}>
          Publicado em {formatarData(post.createdAt)}
        </Text>
        <Text style={[styles.meta, { color: colors.text }]}>
          Autor: {post.autor}
        </Text>
        <Text style={[styles.body, { color: colors.text }]}>
          {post.conteudo}
        </Text>

        {post.anexo && (
          <Pressable
            onPress={() => Linking.openURL(resolveUploadUrl(post.anexo!.caminho))}
          >
            <Text style={[styles.attachment, { color: colors.accent }]}>
              📎 {post.anexo.nome}
            </Text>
          </Pressable>
        )}

        <Text style={[styles.likeCount, { color: colors.text }]}>
          {post.likes?.length ?? 0} curtida(s)
        </Text>

        <View style={styles.actions}>
          <Button
            title={usuarioCurtiu ? "Curtido" : "Curtir"}
            variant="like"
            onPress={curtirPost}
          />

          {isProfessor && (
            <>
              <Button
                title="Editar"
                onPress={() =>
                  navigation.navigate("PostForm", { postId: post._id })
                }
              />
              <Button title="Excluir" variant="danger" onPress={excluirPost} />
            </>
          )}
        </View>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.backgroundSoft, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
          Comentários
        </Text>

        <TextField
          label="Novo comentário"
          value={novoComentario}
          onChangeText={setNovoComentario}
          placeholder="Escreva um comentário..."
          multiline
        />
        <Button title="Enviar comentário" onPress={criarComentario} />

        {comments.length === 0 && (
          <Text style={[styles.empty, { color: colors.text }]}>
            Nenhum comentário ainda.
          </Text>
        )}

        {comments.map((comment) => {
          const curtiu = comment.likes?.some((id) => id === user?._id);

          return (
            <View
              key={comment._id}
              style={[styles.comment, { borderColor: colors.border }]}
            >
              <View style={styles.commentHeader}>
                <Text style={[styles.commentAuthor, { color: colors.textHeading }]}>
                  {comment.autor}
                </Text>
                <Text style={[styles.commentDate, { color: colors.text }]}>
                  {formatarData(comment.createdAt)}
                </Text>
              </View>

              {editandoId === comment._id ? (
                <>
                  <TextField
                    label=""
                    value={textoEditando}
                    onChangeText={setTextoEditando}
                    multiline
                  />
                  <View style={styles.actions}>
                    <Button
                      title="Salvar"
                      onPress={() => salvarEdicao(comment._id)}
                    />
                    <Button
                      title="Cancelar"
                      variant="secondary"
                      onPress={() => setEditandoId(null)}
                    />
                  </View>
                </>
              ) : (
                <Text style={[styles.commentText, { color: colors.text }]}>
                  {comment.texto}
                </Text>
              )}

              <View style={styles.commentFooter}>
                <Button
                  title={curtiu ? "Curtido" : "Curtir"}
                  variant="like"
                  onPress={() => curtirComentario(comment._id)}
                />
                <Text style={[styles.commentLikes, { color: colors.text }]}>
                  {comment.likes?.length ?? 0} curtida(s)
                </Text>

                {podeEditarOuExcluir(comment) && editandoId !== comment._id && (
                  <View style={styles.commentActionsInline}>
                    <Button
                      title="Editar"
                      variant="secondary"
                      onPress={() => iniciarEdicao(comment)}
                    />
                    <Button
                      title="Excluir"
                      variant="danger"
                      onPress={() => excluirComentario(comment._id)}
                    />
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
  date: {
    fontSize: 12,
    opacity: 0.8,
  },
  meta: {
    fontSize: 13,
    fontWeight: "600",
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  attachment: {
    fontSize: 13,
    fontWeight: "600",
  },
  likeCount: {
    fontSize: 12,
    opacity: 0.8,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  empty: {
    textAlign: "center",
    marginVertical: 12,
    opacity: 0.8,
  },
  comment: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
    gap: 6,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentAuthor: {
    fontWeight: "700",
    fontSize: 13,
  },
  commentDate: {
    fontSize: 11,
    opacity: 0.8,
  },
  commentText: {
    fontSize: 14,
  },
  commentFooter: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  commentLikes: {
    fontSize: 12,
  },
  commentActionsInline: {
    flexDirection: "row",
    gap: 8,
    marginLeft: "auto",
  },
});
