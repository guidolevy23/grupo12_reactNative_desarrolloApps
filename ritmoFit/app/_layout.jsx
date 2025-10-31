import React from "react";
import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { AuthProvider } from "./context/authContext";

// 🧹 Silenciamos warnings de Web innecesarios
LogBox.ignoreLogs([
  "props.pointerEvents is deprecated",
  '"shadow*" style props are deprecated',
]);

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#000",
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          options={{ 
            title: "Iniciar Sesión",
            headerShown: true 
          }}
        />
        <Stack.Screen
          name="otp"
          options={{ 
            title: "Validar Código OTP",
            headerShown: true 
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
