import { useColorScheme } from "react-native";

export type Theme = typeof lightColors;

export const lightColors = {
  text: "#26332B",
  textHeading: "#1B2A20",
  background: "#FAF7F5",
  backgroundSoft: "#FFFFFF",
  border: "#DDEFE4",
  accent: "#E85D9E",
  accentHover: "#2F6F4E",
  accentBg: "rgba(232, 93, 158, 0.12)",
  green: "#2F6F4E",
  greenLight: "#DDEFE4",
  pink: "#E85D9E",
  pinkLight: "#FADCEB",
  danger: "#C0392B",
  white: "#FFFFFF",
};

export const darkColors: Theme = {
  text: "#DDEFE4",
  textHeading: "#FFFFFF",
  background: "#1B2A20",
  backgroundSoft: "#243629",
  border: "rgba(221, 239, 228, 0.18)",
  accent: "#F68BBB",
  accentHover: "#DDEFE4",
  accentBg: "rgba(246, 139, 187, 0.15)",
  green: "#DDEFE4",
  greenLight: "rgba(221, 239, 228, 0.12)",
  pink: "#F68BBB",
  pinkLight: "rgba(250, 220, 235, 0.16)",
  danger: "#E57373",
  white: "#FFFFFF",
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkColors : lightColors;
}
