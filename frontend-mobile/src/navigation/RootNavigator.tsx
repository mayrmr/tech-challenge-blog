import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../theme/colors";
import { AuthStackParamList, AppStackParamList } from "./types";
import Header from "../components/Header";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import PostFormScreen from "../screens/PostFormScreen";
import UserListScreen from "../screens/UserListScreen";
import UserFormScreen from "../screens/UserFormScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <AppStack.Screen name="Home" component={HomeScreen} />
      <AppStack.Screen name="PostDetail" component={PostDetailScreen} />
      <AppStack.Screen name="PostForm" component={PostFormScreen} />
      <AppStack.Screen name="UserList" component={UserListScreen} />
      <AppStack.Screen name="UserForm" component={UserFormScreen} />
    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, isLoading } = useAuth();
  const colors = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
