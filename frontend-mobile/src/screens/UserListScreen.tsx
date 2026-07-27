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
import { Perfil, User } from "../types";
import Button from "../components/Button";
import { useProfessorGuard } from "../hooks/useProfessorGuard";

type Nav = NativeStackNavigationProp<AppStackParamList, "UserList">;

type Filtro = "todos" | Perfil;

const FILTROS: { key: Filtro; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "aluno", label: "Alunos" },
  { key: "professor", label: "Professores" },
];

export default function UserListScreen() {
  useProfessorGuard();

  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<Nav>();
  const { user: usuarioLogado } = useAuth();
  const colors = useTheme();

  async function carregarUsuarios() {
    setLoading(true);

    try {
      const query = filtro === "todos" ? "" : `?perfil=${filtro}`;
      const response = await api.get<User[]>(`/users${query}`);
      setUsuarios(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [filtro])
  );

  function excluirUsuario(usuario: User) {
    Alert.alert(
      "Excluir usuário",
      `Deseja realmente excluir ${usuario.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/users/${usuario._id}`);
              carregarUsuarios();
            } catch (error: any) {
              console.error(error);
              const mensagem =
                error?.response?.data?.erro ?? "Erro ao excluir usuário";
              Alert.alert("Erro", mensagem);
            }
          },
        },
      ]
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <View style={styles.filters}>
          {FILTROS.map((item) => {
            const ativo = filtro === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setFiltro(item.key)}
                style={[
                  styles.filterChip,
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
                    fontSize: 12,
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Button
          title="+ Novo Usuário"
          onPress={() => navigation.navigate("UserForm", {})}
        />
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={carregarUsuarios}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.text }]}>
            {loading ? "Carregando..." : "Nenhum usuário encontrado."}
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              { backgroundColor: colors.backgroundSoft, borderColor: colors.border },
            ]}
          >
            <View style={styles.rowInfo}>
              <Text style={[styles.rowName, { color: colors.textHeading }]}>
                {item.nome}
              </Text>
              <Text style={[styles.rowEmail, { color: colors.text }]}>
                {item.email}
              </Text>
              <Text style={[styles.rowBadge, { color: colors.accentHover }]}>
                {item.perfil === "professor" ? "Professor(a)" : "Aluno(a)"}
              </Text>
            </View>

            <View style={styles.rowActions}>
              <Button
                title="Editar"
                variant="secondary"
                onPress={() =>
                  navigation.navigate("UserForm", { userId: item._id })
                }
              />

              {item._id !== usuarioLogado?._id && (
                <Button
                  title="Excluir"
                  variant="danger"
                  onPress={() => excluirUsuario(item)}
                />
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    padding: 16,
    gap: 12,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  list: {
    padding: 16,
    paddingTop: 0,
    gap: 10,
  },
  row: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  rowInfo: {
    flexShrink: 1,
    gap: 2,
  },
  rowName: {
    fontSize: 15,
    fontWeight: "700",
  },
  rowEmail: {
    fontSize: 12,
    opacity: 0.8,
  },
  rowBadge: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  rowActions: {
    flexDirection: "row",
    gap: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
  },
});
