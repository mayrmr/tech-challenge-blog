import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { useTheme } from "../theme/colors";

interface TextFieldProps extends TextInputProps {
  label: string;
}

export default function TextField({ label, style, ...rest }: TextFieldProps) {
  const colors = useTheme();

  return (
    <View style={styles.group}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.text + "80"}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.backgroundSoft,
            color: colors.text,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
});
