import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import userService from "../services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
      } catch (err) {
        console.log("❌ Error al obtener perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("login");
  };

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Mi Perfil</Text>
      {user ? (
        <>
          <Text>Email: {user.email}</Text>
          <Text>Rol: {user.role}</Text>
          <Text>Validado: {user.validated ? "Sí" : "No"}</Text>
        </>
      ) : (
        <Text>No se pudo obtener el usuario.</Text>
      )}
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
