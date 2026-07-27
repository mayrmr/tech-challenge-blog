import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import api from "../services/api";
import { useTheme } from "../theme/colors";
import { AppStackParamList } from "../navigation/types";
import { Anexo } from "../types";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { useProfessorGuard } from "../hooks/useProfessorGuard";

type Nav = NativeStackNavigationProp<AppStackParamList, "PostForm">;
type Rt = RouteProp<AppStackParamList, "PostForm">;

interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string;
}

export default function PostFormScreen() {
  useProfessorGuard();

  const { postId } = useRoute<Rt>().params ?? {};
  const navigation = useNavigation<Nav>();
  const colors = useTheme();
  const isEdicao = Boolean(postId);

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");
  const [anexoAtual, setAnexoAtual] = useState<Anexo | null>(null);
  const [novoArquivo, setNovoArquivo] = useState<PickedFile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    async function carregarPost() {
      try {
        const response = await api.get(`/posts/${postId}`);
        setTitulo(response.data.titulo);
        setConteudo(response.data.conteudo);
        setAutor(response.data.autor);
        setAnexoAtual(response.data.anexo ?? null);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Erro ao carregar post");
      }
    }

    carregarPost();
  }, [postId]);

  async function escolherArquivo() {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (resultado.canceled || !resultado.assets?.length) return;

    const asset = resultado.assets[0];
    setNovoArquivo({
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType,
    });
  }

  async function handleSubmit() {
    if (!titulo.trim() || !conteudo.trim() || !autor.trim()) {
      Alert.alert("Atenção", "Preencha título, conteúdo e autor(a).");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("conteudo", conteudo);
    formData.append("autor", autor);

    if (novoArquivo) {
      formData.append("anexo", {
        uri: novoArquivo.uri,
        name: novoArquivo.name,
        type: novoArquivo.mimeType ?? "application/octet-stream",
      } as unknown as Blob);
    }

    setLoading(true);

    try {
      if (isEdicao) {
        await api.put(`/posts/${postId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", `Erro ao ${isEdicao ? "editar" : "criar"} post`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.textHeading }]}>
          {isEdicao ? "Editar Post" : "Criar Post"}
        </Text>

        <TextField label="Título" value={titulo} onChangeText={setTitulo} />
        <TextField
          label="Conteúdo"
          value={conteudo}
          onChangeText={setConteudo}
          multiline
          numberOfLines={5}
        />
        <TextField label="Autor(a)" value={autor} onChangeText={setAutor} />

        {anexoAtual && !novoArquivo && (
          <Text style={[styles.helper, { color: colors.text }]}>
            Anexo atual: {anexoAtual.nome}
          </Text>
        )}

        {novoArquivo && (
          <Text style={[styles.helper, { color: colors.text }]}>
            Novo anexo selecionado: {novoArquivo.name}
          </Text>
        )}

        <Button
          title={anexoAtual ? "Trocar anexo" : "Selecionar anexo (opcional)"}
          variant="secondary"
          onPress={escolherArquivo}
        />

        <Button
          title={isEdicao ? "Salvar edição" : "Criar"}
          onPress={handleSubmit}
          loading={loading}
        />
        <Button
          title="Voltar"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  helper: {
    fontSize: 12,
    marginBottom: -4,
  },
});
