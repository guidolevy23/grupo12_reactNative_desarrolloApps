import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getClassList } from "../../services/classService";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getClassList();
      setClasses(data.results || data);
      setError(null);
    } catch (err) {
      setError("Error al cargar las clases");
      console.error(err);
      // Datos de ejemplo en caso de error
      setClasses([
        {
          id: 1,
          nombre: "Funcional 18:00",
          tipo: "Funcional",
          sede: "Palermo",
          horario: "18:00 - 19:00",
          instructor: "Juan Pérez",
          capacidad: 20,
          ocupados: 15,
        },
        {
          id: 2,
          nombre: "Yoga 19:00",
          tipo: "Yoga",
          sede: "Belgrano",
          horario: "19:00 - 20:00",
          instructor: "María González",
          capacidad: 15,
          ocupados: 10,
        },
        {
          id: 3,
          nombre: "Spinning 20:00",
          tipo: "Spinning",
          sede: "Palermo",
          horario: "20:00 - 21:00",
          instructor: "Carlos Ruiz",
          capacidad: 25,
          ocupados: 20,
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  const renderClassItem = ({ item }) => {
    // Simplificado: solo mostrar info básica sin mucho procesamiento
    const availableSpots = (item.capacidad || item.capacity || 20) - (item.ocupados || item.currentEnrollment || 0);
    const isAlmostFull = availableSpots <= 5;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ClassDetail", { classId: item.id })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.className}>{item.nombre || item.name}</Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor(item.tipo || item.type) },
            ]}
          >
            <Text style={styles.typeBadgeText}>{item.tipo || item.type}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏢 {item.sede || item.branch || item.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              ⏰ {item.horario || item.schedule}
            </Text>
          </View>

          {(item.instructor || item.professor) && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👤 {item.instructor || item.professor}</Text>
            </View>
          )}

          <View style={styles.cardFooter}>
            <Text
              style={[
                styles.spotsText,
                isAlmostFull && styles.spotsTextWarning,
              ]}
            >
              {availableSpots > 0
                ? `${availableSpots} lugares disponibles`
                : "Clase llena"}
            </Text>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getTypeColor = (type) => {
    const colors = {
      Funcional: "#667eea",
      Yoga: "#764ba2",
      Spinning: "#f093fb",
      Crossfit: "#E63F34",
      Pilates: "#48bb78",
    };
    return colors[type] || "#667eea";
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando clases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏋️‍♂️ Clases Disponibles</Text>
        <Text style={styles.subtitle}>
          Elegí tu clase y reservá tu lugar
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.errorSubtext}>Mostrando datos de ejemplo</Text>
        </View>
      )}

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderClassItem}
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
              No hay clases disponibles en este momento
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
    marginBottom: 15,
  },
  className: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  typeBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
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
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  spotsText: {
    fontSize: 14,
    color: "#48bb78",
    fontWeight: "600",
  },
  spotsTextWarning: {
    color: "#f59e0b",
  },
  arrowText: {
    fontSize: 20,
    color: "#667eea",
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});