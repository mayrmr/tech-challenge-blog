import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../theme/colors";
import { AppStackParamList } from "../navigation/types";
import { Post } from "../types";
import TextField from "../components/TextField";
import Button from "../components/Button";

type Nav = NativeStackNavigationProp<AppStackParamList, "Home">;

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<Nav>();
  const { isProfessor } = useAuth();
  const colors = useTheme();

  async function carregarPosts() {
    try {
      const response = await api.get<Post[]>("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarPosts();
    }, [])
  );

  function excluirPost(id: string) {
    Alert.alert(
      "Excluir post",
      "Deseja realmente excluir este post?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/posts/${id}`);
              carregarPosts();
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Erro ao excluir post");
            }
          },
        },
      ]
    );
  }

  const postsFiltrados = posts.filter((post) =>
    `${post.titulo} ${post.conteudo} ${post.autor}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchWrapper}>
        <TextField
          label="Pesquisar"
          value={search}
          onChangeText={setSearch}
          placeholder="Pesquisar posts"
        />
      </View>

      <FlatList
        data={postsFiltrados}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={carregarPosts}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.text }]}>
            {loading ? "Carregando posts..." : "Nenhum post cadastrado ainda."}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: colors.backgroundSoft,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              navigation.navigate("PostDetail", { postId: item._id })
            }
          >
            <Text style={[styles.cardTitle, { color: colors.textHeading }]}>
              {item.titulo}
            </Text>
            <Text style={[styles.cardDate, { color: colors.text }]}>
              Publicado em {formatarData(item.createdAt)}
            </Text>
            <Text
              style={[styles.cardContent, { color: colors.text }]}
              numberOfLines={3}
            >
              {item.conteudo}
            </Text>
            <Text style={[styles.cardMeta, { color: colors.text }]}>
              Autor(a): {item.autor}
            </Text>

            {item.anexo && (
              <Text style={[styles.cardAttachment, { color: colors.accent }]}>
                📎 {item.anexo.nome}
              </Text>
            )}

            {isProfessor && (
              <View style={styles.actions}>
                <Button
                  title="Editar"
                  variant="secondary"
                  onPress={() =>
                    navigation.navigate("PostForm", { postId: item._id })
                  }
                />
                <Button
                  title="Excluir"
                  variant="danger"
                  onPress={() => excluirPost(item._id)}
                />
              </View>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    padding: 16,
    paddingTop: 4,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  cardDate: {
    fontSize: 12,
    opacity: 0.8,
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardAttachment: {
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
  },
});
