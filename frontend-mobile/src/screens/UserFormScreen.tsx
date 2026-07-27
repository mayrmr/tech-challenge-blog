import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import api from "../services/api";
import { useTheme } from "../theme/colors";
import { AppStackParamList } from "../navigation/types";
import { Perfil } from "../types";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { useProfessorGuard } from "../hooks/useProfessorGuard";

type Nav = NativeStackNavigationProp<AppStackParamList, "UserForm">;
type Rt = RouteProp<AppStackParamList, "UserForm">;

const PERFIS: { key: Perfil; label: string }[] = [
  { key: "aluno", label: "Aluno(a)" },
  { key: "professor", label: "Professor(a)" },
];

export default function UserFormScreen() {
  useProfessorGuard();

  const { userId } = useRoute<Rt>().params ?? {};
  const navigation = useNavigation<Nav>();
  const colors = useTheme();
  const isEdicao = Boolean(userId);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState<Perfil>("aluno");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    async function carregarUsuario() {
      try {
        const response = await api.get(`/users/${userId}`);
        setNome(response.data.nome);
        setEmail(response.data.email);
        setPerfil(response.data.perfil);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Erro ao carregar usuário");
      }
    }

    carregarUsuario();
  }, [userId]);

  async function handleSubmit() {
    if (!nome.trim() || !email.trim() || (!isEdicao && !senha.trim())) {
      Alert.alert("Atenção", "Preencha nome, email e senha.");
      return;
    }

    setLoading(true);

    try {
      if (isEdicao) {
        const payload: Record<string, string> = { nome, email, perfil };
        if (senha.trim()) payload.senha = senha;
        await api.put(`/users/${userId}`, payload);
      } else {
        await api.post("/auth/register", { nome, email, senha, perfil });
      }

      navigation.navigate("UserList");
    } catch (error: any) {
      console.error(error);
      const mensagem =
        error?.response?.data?.erro ??
        `Erro ao ${isEdicao ? "editar" : "cadastrar"} usuário`;
      Alert.alert("Erro", mensagem);
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
          {isEdicao ? "Editar Usuário" : "Novo Usuário"}
        </Text>

        <TextField label="Nome" value={nome} onChangeText={setNome} />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label={isEdicao ? "Nova senha (opcional)" : "Senha"}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder={isEdicao ? "Deixe em branco para manter a atual" : ""}
        />

        <Text style={[styles.label, { color: colors.text }]}>Perfil</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <>
            {PERFIS.map((item) => {
              const ativo = perfil === item.key;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => setPerfil(item.key)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: ativo ? colors.accent : colors.backgroundSoft,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: ativo ? "#FFFFFF" : colors.text,
                      fontWeight: "700",
                    }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </>
        </ScrollView>

        <Button
          title={isEdicao ? "Salvar alterações" : "Cadastrar"}
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
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: -4,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
});
