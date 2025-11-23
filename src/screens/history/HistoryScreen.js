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
  Alert,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAttendanceHistory } from "../../services/historyService";
import { calificarAsistencia } from "../../services/ratingService";
import RatingModal from "./components/RatingModal";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching attendance history...');
      const data = await getAttendanceHistory(
        dateFilter.startDate,
        dateFilter.endDate
      );
      console.log('✅ History data received:', data);
      setHistory(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching history:', err);
      console.error('Error details:', err.message);
      setError(`Error al cargar el historial: ${err.message}`);
      // Datos de ejemplo en caso de error (formato actualizado con campos para calificar)
      setHistory([
        {
          id: 1,
          courseName: "Funcional",
          branch: "Palermo",
          fecha: "10/11/2025 18:00",
          durationMinutes: 60,
          professor: "Juan Pérez",
          rating: null, // Sin calificar
          comment: null,
        },
        {
          id: 2,
          courseName: "Yoga",
          branch: "Belgrano",
          fecha: "08/11/2025 19:00",
          durationMinutes: 60,
          professor: "María González",
          rating: 5, // Ya calificada
          comment: "Excelente clase, muy relajante",
        },
        {
          id: 3,
          courseName: "Spinning",
          branch: "Palermo",
          fecha: "05/11/2025 20:00",
          duracionMinutos: 45,
          professor: "Carlos Ruiz",
          rating: null, // Sin calificar
          comment: null,
        },
        {
          id: 4,
          courseName: "HIIT",
          branch: "Recoleta",
          fecha: "03/11/2025 17:00",
          durationMinutes: 45,
          professor: "Ana Martínez",
          rating: 4, // Ya calificada
          comment: "Muy intensa pero efectiva",
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
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

  const handleRateClass = (classItem) => {
    setSelectedClass(classItem);
    setModalVisible(true);
  };

  const handleSubmitRating = async (rating, comment) => {
    try {
      console.log('📝 Enviando calificación:', { 
        asistenciaId: selectedClass.id, 
        rating, 
        comment 
      });

      await calificarAsistencia(selectedClass.id, rating, comment);
      
      Alert.alert(
        '¡Gracias por tu calificación! 🎉',
        'Tu opinión nos ayuda a mejorar'
      );

      // Recargar historial para mostrar la calificación
      fetchHistory();
      setModalVisible(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Error al calificar:', error);
      Alert.alert('Error', error.message);
    }
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

          {item.comment && (
            <View style={styles.commentContainer}>
              <Text style={styles.commentText}>💬 {item.comment}</Text>
            </View>
          )}
        </View>

        {/* Botón de calificar solo si no tiene rating */}
        {!item.rating && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => handleRateClass(item)}
          >
            <Text style={styles.rateButtonText}>⭐ Calificar clase</Text>
          </TouchableOpacity>
        )}

        {/* Texto si ya fue calificada */}
        {item.rating && (
          <View style={styles.ratedContainer}>
            <Text style={styles.ratedText}>✓ Ya calificaste esta clase</Text>
          </View>
        )}
      </View>
    );
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

      {/* Modal de calificación */}
      <RatingModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedClass(null);
        }}
        onSubmit={handleSubmitRating}
        classInfo={selectedClass}
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
  commentContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#667eea",
  },
  commentText: {
    fontSize: 13,
    color: "#555",
    fontStyle: "italic",
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
  rateButton: {
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  rateButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  ratedContainer: {
    backgroundColor: "#e8f5e9",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  ratedText: {
    color: "#2e7d32",
    fontSize: 14,
    fontWeight: "600",
  },
});
