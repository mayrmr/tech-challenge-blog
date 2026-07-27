import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { TOKEN_KEY, USER_KEY } from "../services/api";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: "HYDRATE"; payload: { user: User | null; token: string | null } }
  | { type: "SIGN_IN"; payload: { user: User; token: string } }
  | { type: "SIGN_OUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "HYDRATE":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };
    case "SIGN_OUT":
      return { user: null, token: null, isLoading: false };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  isProfessor: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    async function hydrate() {
      const [token, userRaw] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      dispatch({
        type: "HYDRATE",
        payload: {
          token,
          user: userRaw ? (JSON.parse(userRaw) as User) : null,
        },
      });
    }

    hydrate();
  }, []);

  async function login(email: string, senha: string) {
    const response = await api.post("/auth/login", { email, senha });
    const { token, user } = response.data;

    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

    dispatch({ type: "SIGN_IN", payload: { token, user } });
  }

  async function logout() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    dispatch({ type: "SIGN_OUT" });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isProfessor: state.user?.perfil === "professor",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
