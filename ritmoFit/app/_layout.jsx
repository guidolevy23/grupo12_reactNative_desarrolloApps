// app/_layout.jsx
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { Link, useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Verifica login cada vez que cambia la ruta
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLogged(!!token);
    };
    checkLogin();
  }, [pathname]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#000",
        headerTitleAlign: "center",

        // 🔹 Botón derecho: Login solo si NO estás logueado
        headerRight: () =>
          !isLogged && (
            <Link href="/login" asChild>
              <Pressable style={{ marginRight: 15 }}>
                <Text style={{ color: "#007AFF", fontWeight: "600" }}>Login</Text>
              </Pressable>
            </Link>
          ),

        // 🔹 Botón izquierdo: Perfil solo si estás logueado
        headerLeft: () =>
          isLogged && (
            <Link href="/profile" asChild>
              <Pressable style={{ marginLeft: 15 }}>
                <Text style={{ color: "#007AFF", fontWeight: "600" }}>
                  Perfil
                </Text>
              </Pressable>
            </Link>
          ),
      }}
    />
  );
}
