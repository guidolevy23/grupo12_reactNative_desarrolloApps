// app/profile.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Sesión no encontrada", "Iniciá sesión nuevamente.");
          router.replace("/login");
          return;
        }

        const res = await fetch("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al obtener perfil");

        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    Alert.alert("Sesión cerrada", "Tu sesión fue cerrada correctamente.");
    router.replace("/"); // vuelve al inicio
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (!user)
    return (
      <View style={styles.container}>
        <Text>No se pudo cargar el perfil.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {user.photoUrl ? (
        <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
      ) : (
        <Image
          source={require("../assets/default-avatar.png")}
          style={styles.avatar}
        />
      )}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.role}>Rol: {user.role}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar sesión" color="#FF3B30" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  email: { color: "#666", marginBottom: 5 },
  role: { color: "#007AFF", fontWeight: "600" },
});
