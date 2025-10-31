import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import classService from "../services/classService";
import reservationService from "../services/reservationService";

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [alreadyReserved, setAlreadyReserved] = useState(false);

  useEffect(() => {
    loadClassDetail();
    checkReservation();
  }, [id]);

  const loadClassDetail = async () => {
    try {
      const data = await classService.getClassById(id);
      setClassData(data);
    } catch (error) {
      console.error("Error cargando detalle:", error);
      Alert.alert("Error", "No se pudo cargar el detalle de la clase");
    } finally {
      setLoading(false);
    }
  };

  const checkReservation = async () => {
    try {
      const reservations = await reservationService.getMyReservations("confirmed");
      const isReserved = reservations.some(
        (r) => r.classId === id || r.class?.id === id
      );
      setAlreadyReserved(isReserved);
    } catch (error) {
      console.error("Error verificando reserva:", error);
    }
  };

  const handleReserve = async () => {
    if (alreadyReserved) {
      Alert.alert("Ya tienes una reserva", "Ya tienes una reserva para esta clase");
      return;
    }

    if (!classData || (classData.availableSlots || classData.cuposDisponibles) <= 0) {
      Alert.alert("Sin cupos", "No hay cupos disponibles para esta clase");
      return;
    }

    setReserving(true);
    try {
      await reservationService.createReservation(id);
      Alert.alert("¡Reserva confirmada!", "Tu reserva ha sido creada exitosamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
      setAlreadyReserved(true);
    } catch (error) {
      const message =
        error.response?.data?.message || "No se pudo crear la reserva";
      Alert.alert("Error", message);
    } finally {
      setReserving(false);
    }
  };

  const handleDirections = () => {
    if (!classData?.location || !classData?.address) {
      Alert.alert("Sin dirección", "No hay dirección disponible para esta sede");
      return;
    }

    const address = classData.address || classData.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "No se pudo abrir Google Maps")
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!classData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se encontró la clase</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{classData.name || classData.disciplina}</Text>
        <Text style={styles.date}>{formatDate(classData.date || classData.fecha)}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>🕐 Horario:</Text>
          <Text style={styles.value}>
            {formatTime(classData.time || classData.horario)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📍 Sede:</Text>
          <Text style={styles.value}>
            {classData.sede || classData.location}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>👤 Instructor:</Text>
          <Text style={styles.value}>
            {classData.instructor || classData.professor || "Sin asignar"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>⏱️ Duración:</Text>
          <Text style={styles.value}>
            {classData.duration || classData.duracion || "60"} minutos
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>🎫 Cupos disponibles:</Text>
          <Text
            style={[
              styles.value,
              (classData.availableSlots || classData.cuposDisponibles) <= 0 &&
                styles.noSlots,
            ]}
          >
            {classData.availableSlots || classData.cuposDisponibles || 0}
          </Text>
        </View>

        {classData.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{classData.description}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleDirections}
        >
          <Text style={styles.directionsButtonText}>📍 Cómo llegar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.reserveButton,
            (alreadyReserved ||
              (classData.availableSlots || classData.cuposDisponibles) <= 0) &&
              styles.reserveButtonDisabled,
          ]}
          onPress={handleReserve}
          disabled={reserving || alreadyReserved}
        >
          {reserving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.reserveButtonText}>
              {alreadyReserved ? "Ya reservada" : "Reservar clase"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#999",
  },
  header: {
    backgroundColor: "#e67e22",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#666",
    flex: 2,
    textAlign: "right",
  },
  noSlots: {
    color: "#e74c3c",
    fontWeight: "600",
  },
  descriptionContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  directionsButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  directionsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  reserveButton: {
    backgroundColor: "#e67e22",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  reserveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

