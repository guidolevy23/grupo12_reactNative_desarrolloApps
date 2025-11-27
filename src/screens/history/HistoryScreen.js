import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAttendanceHistory } from "../../services/historyService";
import CalificacionService from '../../services/calificacionService';
import RatingModal from './components/RatingModal';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedAsistenciaId, setSelectedAsistenciaId] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getAttendanceHistory(
        dateFilter.startDate,
        dateFilter.endDate
      );
      

      // Fetch user's own calificaciones and merge them with history items
      let myCalificaciones = [];
      try {
        myCalificaciones = await CalificacionService.getMyRatings();
      } catch (calErr) {
        // ignore errors fetching user's calificaciones
      }

      const merged = data.map((item) => {
        // Normalize possible turno id locations
        const itemTurnoId = item.turnoId || item.turno?.id || null;
        // Try to find a matching calificacion by various possibilities:
        // - calificacion.turnoId === item.turnoId
        // - calificacion.turnoId === item.id (some backends return turnoId while history item id is the asistencia id equal to turno)
        // - calificacion.asistenciaId === item.id
        const match = myCalificaciones.find((c) => {
          const cTurno = c.turnoId || c.turnoId;
          const cAsistencia = c.asistenciaId || c.asistenciaId;

          if (cTurno && itemTurnoId && Number(cTurno) === Number(itemTurnoId)) return true;
          if (cTurno && item.id && Number(cTurno) === Number(item.id)) return true;
          if (cAsistencia && item.id && Number(cAsistencia) === Number(item.id)) return true;
          return false;
        });

        if (match) {
          return { ...item, rating: match.estrellas || match.stars || match.rating, comment: match.comentario || match.comment };
        }

        return item;
      });

      setHistory(merged);
      setError(null);
    } catch (err) {
      setError(`Error al cargar el historial: ${err.message}`);
      // Datos de ejemplo en caso de error (formato del backend)
      setHistory([
        {
          id: 1,
          nombreClase: "Funcional",
          nombreSede: "Palermo",
          fecha: "10/11/2025 18:00",
          duracionMinutos: 60,
          profesor: "Juan Pérez",
        },
        {
          id: 2,
          nombreClase: "Yoga",
          nombreSede: "Belgrano",
          fecha: "08/11/2025 19:00",
          duracionMinutos: 60,
          profesor: "María González",
        },
        {
          id: 3,
          nombreClase: "Spinning",
          nombreSede: "Palermo",
          fecha: "05/11/2025 20:00",
          duracionMinutos: 45,
          profesor: "Carlos Ruiz",
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (dateFilter.startDate || dateFilter.endDate) {
      fetchHistory();
    }
  }, [dateFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const isoDate = selectedDate.toISOString();
      setDateFilter(prev => ({ ...prev, startDate: isoDate }));
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const isoDate = selectedDate.toISOString();
      setDateFilter(prev => ({ ...prev, endDate: isoDate }));
    }
  };

  const clearFilters = () => {
    setDateFilter({ startDate: null, endDate: null });
  };

  const formatDateDisplay = (isoDate) => {
    if (!isoDate) return 'Seleccionar';
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-AR');
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>
          {"⭐".repeat(rating)}
        </Text>
      </View>
    );
  };

  const renderHistoryItem = ({ item }) => {
    // Handle both old and new field names for backward compatibility
    const courseName = item.courseName || item.nombreClase;
    const branch = item.branch || item.nombreSede;
    const durationMinutes = item.durationMinutes || item.duracionMinutos;
    const professor = item.professor || item.profesor;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{item.fecha}</Text>
          {renderStars(item.rating)}
        </View>

        <Text style={styles.className}>{courseName}</Text>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏢 {branch}</Text>
          </View>

          {durationMinutes && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>⏱️ {durationMinutes} min</Text>
            </View>
          )}

          {professor && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👤 {professor}</Text>
            </View>
          )}
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSeparator}>
          {item.rating ? (
            <View style={styles.ratingSection}>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingLabel}>Mi valoración:</Text>
                <View style={styles.starsRow}>
                  {[...Array(5)].map((_, index) => (
                    <Text key={index} style={styles.starIcon}>
                      {index < item.rating ? '⭐' : '☆'}
                    </Text>
                  ))}
                </View>
              </View>
              {item.comment && (
              <View style={styles.commentContainer}>
                <Text style={styles.commentText}>💬 {item.comment}</Text>
              </View>
            )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => {
                setSelectedAsistenciaId(item.id);
                setRatingModalVisible(true);
              }}
            >
              <Text style={styles.rateButtonText}>⭐ Calificar clase</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const handleSavedRating = (resp) => {
    // resp may contain { id, turnoId, estrellas, comentario } or similar
    if (!resp) return;

    setHistory((prev) => prev.map((h) => {
      // Match by asistenciaId if available in resp, else by turnoId
      const matchesByAsistencia = resp.asistenciaId && h.id && Number(resp.asistenciaId) === Number(h.id);
      const hTurnoId = h.turnoId || h.turno?.id || h.turnoId;
      const matchesByTurno = resp.turnoId && hTurnoId && Number(resp.turnoId) === Number(hTurnoId);

      if (matchesByAsistencia || matchesByTurno || (selectedAsistenciaId && h.id === selectedAsistenciaId)) {
        return { ...h, rating: resp.estrellas || resp.stars || resp.rating, comment: resp.comentario || resp.comment };
      }
      return h;
    }));
    setSelectedAsistenciaId(null);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Historial de Asistencias</Text>
        <Text style={styles.subtitle}>Tus clases completadas</Text>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>
            {showFilters ? '🔼 Ocultar filtros' : '🔽 Filtrar por fecha'}
          </Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterContainer}>
          <View style={styles.dateRow}>
            <View style={styles.datePickerWrapper}>
              <Text style={styles.dateLabel}>Desde:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formatDateDisplay(dateFilter.startDate)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.datePickerWrapper}>
              <Text style={styles.dateLabel}>Hasta:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formatDateDisplay(dateFilter.endDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {(dateFilter.startDate || dateFilter.endDate) && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>✕ Limpiar filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {showStartPicker && (
        <DateTimePicker
          value={dateFilter.startDate ? new Date(dateFilter.startDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
          maximumDate={new Date()}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={dateFilter.endDate ? new Date(dateFilter.endDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
          maximumDate={new Date()}
          minimumDate={dateFilter.startDate ? new Date(dateFilter.startDate) : undefined}
        />
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.errorSubtext}>Mostrando datos de ejemplo</Text>
        </View>
      )}

      <FlatList
        data={history}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#667eea"]}
            tintColor="#667eea"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              📭 No hay asistencias registradas
            </Text>
            <Text style={styles.emptySubtext}>
              Tus clases aparecerán aquí después del check-in
            </Text>
          </View>
        }
      />

      <RatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        asistenciaId={selectedAsistenciaId}
        onSaved={handleSavedRating}
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
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#fff3cd",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  errorText: {
    color: "#856404",
    fontSize: 14,
    fontWeight: "600",
  },
  errorSubtext: {
    color: "#856404",
    fontSize: 12,
    marginTop: 5,
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  ratingText: {
    fontSize: 14,
  },
  className: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  ratingSeparator: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  ratingSection: {
    gap: 8,
  },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  starIcon: {
    fontSize: 16,
  },
  commentContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f8f9ff",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#667eea",
  },
  commentText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  rateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#667eea",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  rateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
  },
  filterButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#667eea",
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  filterContainer: {
    backgroundColor: "white",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  datePickerWrapper: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
  },
  dateButton: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  clearButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  clearButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
});
