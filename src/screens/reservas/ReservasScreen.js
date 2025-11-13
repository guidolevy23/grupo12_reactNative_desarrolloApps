import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
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
  const route = useRoute();

  const cargarReservas = useCallback(async () => {
    try {
      const usuario = await getUserDetail();
      const id = usuario.id || usuario.idUsuario;

      const data = await getReservasUsuario(id);
      setReservas(data);
    } catch (error) {
      console.error("⚠️ Error al cargar reservas:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudieron cargar tus reservas.");
    } finally {
      setLoading(false);
    }
  }, [getUserDetail]);

  useFocusEffect(
    useCallback(() => {
      cargarReservas();
    }, [cargarReservas])
  );

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
          Alert.alert("Éxito", "La reserva fue cancelada.");
          cargarReservas();
        } catch (err) {
          Alert.alert("Atención", err.message);
        }
      },
    },
  ]);
};


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.textMuted}>Cargando tus reservas...</Text>
          </View>
        ) : reservas.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.textEmpty}>No tenés reservas activas 💤</Text>
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  textMuted: { color: "#666", marginTop: 10 },
  textEmpty: { color: "#999", fontSize: 16 },
});
