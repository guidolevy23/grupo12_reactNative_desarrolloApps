import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useProfile } from "../../services/profileService";
import {
  getReservasUsuario,
  cancelarReserva,
} from "../../services/reservaService";
import ReservaCard from "./components/ReservasCard";



export default function ReservasScreen() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getUserDetail } = useProfile();

  const cargarReservas = useCallback(async () => {
    try {
      const usuario = await getUserDetail();
      console.log("👤 Usuario obtenido:", usuario);
      const id = usuario.id || usuario.idUsuario;
      console.log("🔢 Buscando reservas para usuario ID:", id);

      const data = await getReservasUsuario(id);
      console.log("📦 Reservas recibidas:", data);

      setReservas(data);
    } catch (error) {
      console.error("⚠️ Error al cargar reservas:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudieron cargar tus reservas.");
    } finally {
      setLoading(false);
    }
  }, [getUserDetail]);



const route = useRoute();

useFocusEffect(
  useCallback(() => {
    cargarReservas();
  }, [cargarReservas])
);

// Si querés además refrescar si te la mandan con params:
useEffect(() => {
  if (route.params?.refresh) {
    cargarReservas();
  }
}, [route.params]);

  const handleCancelar = async (id) => {
    Alert.alert("Cancelar reserva", "¿Querés cancelar esta reserva?", [
      { text: "No" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelarReserva(id);
            cargarReservas(); // recarga lista
          } catch (err) {
            console.error("❌ Error cancelando reserva:", err);
            Alert.alert("Error", "No se pudo cancelar la reserva.");
          }
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.textMuted}>Cargando tus reservas...</Text>
      </View>
    );

  if (reservas.length === 0)
    return (
      <View style={styles.center}>
        <Text style={styles.textEmpty}>No tenés reservas activas 💤</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis reservas</Text>

      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ReservaCard reserva={item} onCancelar={handleCancelar} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  textMuted: { color: "#666", marginTop: 10 },
  textEmpty: { color: "#999", fontSize: 16 },
});
