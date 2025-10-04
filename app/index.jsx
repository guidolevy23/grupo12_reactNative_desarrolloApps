import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "black" }}>
        Hola Rocco 👋
      </Text>
      <Button title="Ir a login" onPress={() => router.push("/login")} />
    </View>
  );
}
