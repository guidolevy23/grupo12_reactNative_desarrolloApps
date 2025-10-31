import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import reservationService from "../../../services/reservationService";

export default function ReservasScreen() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("upcoming"); // upcoming, past, all

  useEffect(() => {
    loadReservations();
  }, [filter]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      let data;
      
      if (filter === "upcoming") {
        data = await reservationService.getMyReservations("confirmed");
      } else if (filter === "past") {
        data = await reservationService.getMyReservations("completed");
      } else {
        data = await reservationService.getMyReservations();
      }

      // Filtrar por fecha si es necesario
      if (filter === "upcoming" && Array.isArray(data)) {
        const now = new Date();
        data = data.filter((res) => {
          const resDate = new Date(res.classDate || res.date || res.class?.date);
          return resDate >= now && res.status !== "cancelled";
        });
      }

      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      Alert.alert("Error", "No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReservations();
  };

  const handleCancel = (reservation) => {
    Alert.alert(
      "Cancelar reserva",
      `¿Estás seguro de que deseas cancelar la reserva de ${reservation.className || reservation.class?.name}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => cancelReservation(reservation.id),
        },
      ]
    );
  };

  const cancelReservation = async (reservationId) => {
    try {
      await reservationService.cancelReservation(reservationId);
      Alert.alert("Reserva cancelada", "Tu reserva ha sido cancelada exitosamente");
      loadReservations();
    } catch (error) {
      const message =
        error.response?.data?.message || "No se pudo cancelar la reserva";
      Alert.alert("Error", message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#27ae60";
      case "cancelled":
        return "#e74c3c";
      case "completed":
        return "#3498db";
      case "expired":
        return "#95a5a6";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Cancelada";
      case "completed":
        return "Completada";
      case "expired":
        return "Expirada";
      default:
        return status || "Sin estado";
    }
  };

  const renderReservationItem = ({ item }) => {
    const classInfo = item.class || {};
    const className = item.className || classInfo.name || classInfo.disciplina || "Clase";
    const classDate = item.classDate || item.date || classInfo.date || classInfo.fecha;
    const classTime = item.classTime || classInfo.time || classInfo.horario;
    const sede = item.sede || classInfo.sede || classInfo.location || "Sede";
    const status = item.status || "confirmed";

    const canCancel =
      filter === "upcoming" &&
      status === "confirmed" &&
      new Date(classDate) > new Date();

    return (
      <View style={styles.reservationCard}>
        <View style={styles.reservationHeader}>
          <Text style={styles.reservationName}>{className}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(status)}</Text>
          </View>
        </View>

        <View style={styles.reservationInfo}>
          <Text style={styles.infoItem}>
            📅 {formatDate(classDate)}
          </Text>
          <Text style={styles.infoItem}>
            🕐 {formatTime(classTime)}
          </Text>
          <Text style={styles.infoItem}>📍 {sede}</Text>
        </View>

        {canCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancel(item)}
          >
            <Text style={styles.cancelButtonText}>Cancelar reserva</Text>
          </TouchableOpacity>
        )}

        {status === "confirmed" && (
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              router.push(`/class-detail?id=${classInfo.id || item.classId}`)
            }
          >
            <Text style={styles.detailButtonText}>Ver detalle</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading && reservations.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "upcoming" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("upcoming")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === "upcoming" && styles.filterButtonTextActive,
            ]}
          >
            Próximas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "past" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("past")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === "past" && styles.filterButtonTextActive,
            ]}
          >
            Pasadas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === "all" && styles.filterButtonTextActive,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de reservas */}
      <FlatList
        data={reservations}
        renderItem={renderReservationItem}
        keyExtractor={(item, index) => `${item.id || index}`}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filter === "upcoming"
                ? "No tienes reservas próximas"
                : filter === "past"
                ? "No tienes reservas pasadas"
                : "No tienes reservas"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  filtersContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#e67e22",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  list: {
    padding: 15,
  },
  reservationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reservationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reservationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  reservationInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: "#666",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  detailButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
