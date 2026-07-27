import { useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

export function useProfessorGuard() {
  const { isProfessor } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isProfessor) {
      Alert.alert("Acesso restrito", "Esta área é exclusiva para professores.");
      navigation.goBack();
    }
  }, [isProfessor]);
}
