import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.replace("/home"); // ✅ redirige automáticamente
      }
    };
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a RitmoFit 🏋️‍♂️</Text>
      <Text style={styles.subtitle}>
        Iniciá sesión para reservar tus clases.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#555", marginTop: 10 },
});
