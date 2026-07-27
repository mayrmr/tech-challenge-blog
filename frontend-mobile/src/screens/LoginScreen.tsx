import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../theme/colors";
import Button from "../components/Button";
import TextField from "../components/TextField";

const logo = require("../../assets/logo-school.png");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const colors = useTheme();

  async function handleLogin() {
    setLoading(true);

    try {
      await login(email, senha);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível entrar. Confira email e senha.");
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
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={[styles.title, { color: colors.textHeading }]}>
          Escola Tech
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Entre para acessar o blog educacional.
        </Text>

        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextField
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            secureTextEntry
          />

          <Button title="Entrar" onPress={handleLogin} loading={loading} />
        </View>

        <Text style={[styles.hint, { color: colors.text }]}>
          Cadastros de alunos e professores são feitos por um(a) professor(a)
          já autenticado(a), dentro do app.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  hint: {
    fontSize: 12,
    marginTop: 24,
    textAlign: "center",
    opacity: 0.8,
  },
});
