import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, FlatList } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "../services/authService";

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          // 👈 No hay token → ir al login
          router.replace("/login");
          return;
        }

        // Si hay token, cargamos usuario
        const data = await authService.getProfile();
        setUser(data);

        // Clases mockeadas por ahora
        setClasses([
          { id: 1, nombre: "Funcional 18:00", sede: "Palermo" },
          { id: 2, nombre: "Crossfit 19:30", sede: "Recoleta" },
        ]);
      } catch (error) {
        console.log("❌ Error verificando sesión:", error);
        // Si el token no sirve → volver al login
        await AsyncStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Hola {user?.name || "socio"} 👋
      </Text>

      <Text style={{ marginVertical: 10, fontSize: 16 }}>
        Estas son las clases de hoy:
      </Text>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              marginVertical: 5,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.nombre}</Text>
            <Text style={{ color: "gray" }}>Sede: {item.sede}</Text>
          </View>
        )}
      />

      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
