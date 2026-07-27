import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const TOKEN_KEY = "@escola-tech:token";
export const USER_KEY = "@escola-tech:user";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function resolveUploadUrl(caminho: string) {
  return `${API_URL}${caminho}`;
}

export default api;
