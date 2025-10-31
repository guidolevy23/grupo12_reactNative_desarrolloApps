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
  Modal,
  TextInput,
} from "react-native";
import historyService from "../../../services/historyService";

export default function HistorialScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async (newFilters = null) => {
    try {
      setLoading(true);
      const activeFilters = newFilters || filters;
      const data = await historyService.getHistory(activeFilters);
      setHistory(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error("Error cargando historial:", error);
      Alert.alert("Error", "No se pudo cargar el historial");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    loadHistory();
  };

  const handleClearFilters = () => {
    setFilters({ startDate: "", endDate: "" });
    setShowFilterModal(false);
    loadHistory({ startDate: "", endDate: "" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const renderHistoryItem = ({ item }) => {
    const asistencia = item.attendance || item;
    const clase = asistencia.class || asistencia.clase || {};
    const fecha = asistencia.date || asistencia.fecha;
    const hora = asistencia.time || asistencia.horario;
    const sede = asistencia.sede || asistencia.location || clase.sede;
    const duracion = asistencia.duration || asistencia.duracion || clase.duration;
    const nombreClase = clase.name || clase.disciplina || "Clase";

    return (
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.className}>{nombreClase}</Text>
          <Text style={styles.date}>{formatDate(fecha)}</Text>
        </View>
        
        <View style={styles.historyInfo}>
          <Text style={styles.infoItem}>
            🕐 {formatTime(hora)}
          </Text>
          <Text style={styles.infoItem}>📍 {sede}</Text>
          {duracion && (
            <Text style={styles.infoItem}>
              ⏱️ {formatDuration(duracion)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (loading && history.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con filtro */}
      <View style={styles.header}>
        <Text style={styles.title}>Historial de asistencias</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>🔍 Filtrar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de filtros */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por fecha</Text>
            
            <Text style={styles.modalLabel}>Fecha desde (YYYY-MM-DD):</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="2025-01-01"
              value={filters.startDate}
              onChangeText={(text) => setFilters({ ...filters, startDate: text })}
            />
            
            <Text style={styles.modalLabel}>Fecha hasta (YYYY-MM-DD):</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="2025-12-31"
              value={filters.endDate}
              onChangeText={(text) => setFilters({ ...filters, endDate: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonClear]}
                onPress={handleClearFilters}
              >
                <Text style={styles.modalButtonText}>Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonApply]}
                onPress={handleApplyFilters}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextWhite]}>
                  Aplicar
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lista de historial */}
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => `${item.id || index}`}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filters.startDate || filters.endDate
                ? "No hay asistencias en el rango seleccionado"
                : "No hay historial de asistencias"}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#e67e22",
    borderRadius: 8,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  list: {
    padding: 15,
  },
  historyCard: {
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
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: "#e67e22",
    fontWeight: "600",
  },
  historyInfo: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonClear: {
    backgroundColor: "#f5f5f5",
  },
  modalButtonApply: {
    backgroundColor: "#e67e22",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  modalButtonTextWhite: {
    color: "#fff",
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#666",
    fontSize: 14,
  },
});
