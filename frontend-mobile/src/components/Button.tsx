import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../theme/colors";

type Variant = "primary" | "secondary" | "danger" | "like";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: ButtonProps) {
  const colors = useTheme();

  const backgrounds: Record<Variant, string> = {
    primary: colors.accent,
    secondary: colors.border,
    danger: colors.danger,
    like: colors.greenLight,
  };

  const textColors: Record<Variant, string> = {
    primary: "#FFFFFF",
    secondary: colors.text,
    danger: "#FFFFFF",
    like: colors.accentHover,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: backgrounds[variant],
          opacity: disabled ? 0.6 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text style={[styles.text, { color: textColors[variant] }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "700",
    fontSize: 14,
  },
});
