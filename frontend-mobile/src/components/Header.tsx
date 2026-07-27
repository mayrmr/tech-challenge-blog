import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../theme/colors";
import { AppStackParamList } from "../navigation/types";

const logo = require("../../assets/logo-school.png");
const userIcon = require("../../assets/user-icon.png");

export default function Header({ navigation }: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const { user, isProfessor, logout } = useAuth();

  const nav = navigation as unknown as {
    navigate: (screen: keyof AppStackParamList, params?: object) => void;
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 10,
          backgroundColor: colors.backgroundSoft,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Pressable
          style={styles.brand}
          onPress={() => nav.navigate("Home")}
        >
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={[styles.title, { color: colors.textHeading }]}>
              Escola Tech
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Tech Challenge - Fase 03
            </Text>
          </View>
        </Pressable>

        <View style={styles.userBox}>
          <Image source={userIcon} style={styles.avatar} />
          <Text
            style={[styles.userName, { color: colors.text }]}
            numberOfLines={1}
          >
            {user?.nome ?? "Visitante"}
          </Text>

          <Pressable
            style={[styles.logoutButton, { backgroundColor: colors.accent }]}
            onPress={logout}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>
      </View>

      {isProfessor && (
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionButton, { borderColor: colors.accentHover }]}
            onPress={() => nav.navigate("PostForm", {})}
          >
            <Text style={[styles.actionText, { color: colors.accentHover }]}>
              + Novo Post
            </Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, { borderColor: colors.accentHover }]}
            onPress={() => nav.navigate("UserList")}
          >
            <Text style={[styles.actionText, { color: colors.accentHover }]}>
              Usuários
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  logo: {
    width: 36,
    height: 36,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 11,
  },
  userBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: 150,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  userName: {
    fontSize: 12,
    flexShrink: 1,
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
