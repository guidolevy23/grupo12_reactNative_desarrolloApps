import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import classService from "../../../services/classService";

export default function HomeScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Filtros
  const [filters, setFilters] = useState({
    sede: "",
    disciplina: "",
    fecha: "",
  });
  
  const [sedes, setSedes] = useState([]);
  const [disciplines, setDisciplines] = useState([]);

  useEffect(() => {
    loadFilters();
    loadClasses(true);
  }, []);

  useEffect(() => {
    loadClasses(true);
  }, [filters]);

  const loadFilters = async () => {
    try {
      const [sedesData, disciplinesData] = await Promise.all([
        classService.getSedes(),
        classService.getDisciplines(),
      ]);
      setSedes(sedesData || []);
      setDisciplines(disciplinesData || []);
    } catch (error) {
      console.error("Error cargando filtros:", error);
    }
  };

  const loadClasses = async (reset = false) => {
    try {
      if (reset) {
        setPage(0);
        setHasMore(true);
      }
      
      const currentPage = reset ? 0 : page;
      const response = await classService.getClasses({
        ...filters,
        page: currentPage,
        size: 10,
      });

      if (reset) {
        setClasses(response.content || response || []);
      } else {
        setClasses((prev) => [...prev, ...(response.content || response || [])]);
      }

      setHasMore(
        response.content
          ? response.content.length === 10 && !response.last
          : (response || []).length === 10
      );
    } catch (error) {
      console.error("Error cargando clases:", error);
      Alert.alert("Error", "No se pudieron cargar las clases");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadClasses(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      loadClasses(false);
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={styles.classCard}
      onPress={() => router.push(`/class-detail?id=${item.id}`)}
    >
      <View style={styles.classHeader}>
        <Text style={styles.className}>{item.name || item.disciplina}</Text>
        <Text style={styles.classDate}>
          {formatDate(item.date || item.fecha)}
        </Text>
      </View>
      
      <View style={styles.classInfo}>
        <Text style={styles.classTime}>
          🕐 {formatTime(item.time || item.horario)}
        </Text>
        <Text style={styles.classSede}>📍 {item.sede || item.location}</Text>
      </View>
      
      <View style={styles.classFooter}>
        <Text style={styles.instructor}>
          👤 {item.instructor || item.professor || "Sin instructor"}
        </Text>
        <Text style={styles.capacity}>
          {item.availableSlots || item.cuposDisponibles || 0} cupos
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && classes.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={styles.loadingText}>Cargando clases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filtrar por fecha (YYYY-MM-DD)"
          value={filters.fecha}
          onChangeText={(text) => handleFilterChange("fecha", text)}
        />
        
        {sedes.length > 0 && (
          <View style={styles.filterRow}>
            <TextInput
              style={[styles.filterInput, styles.filterInputSmall]}
              placeholder="Sede"
              value={filters.sede}
              onChangeText={(text) => handleFilterChange("sede", text)}
            />
            <TextInput
              style={[styles.filterInput, styles.filterInputSmall]}
              placeholder="Disciplina"
              value={filters.disciplina}
              onChangeText={(text) => handleFilterChange("disciplina", text)}
            />
          </View>
        )}
      </View>

      {/* Lista de clases */}
      <FlatList
        data={classes}
        renderItem={renderClassItem}
        keyExtractor={(item, index) => `${item.id || index}`}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay clases disponibles</Text>
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
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  filterInputSmall: {
    flex: 1,
  },
  list: {
    padding: 15,
  },
  classCard: {
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
  classHeader: {
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
  classDate: {
    fontSize: 14,
    color: "#e67e22",
    fontWeight: "600",
  },
  classInfo: {
    marginBottom: 10,
  },
  classTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  classSede: {
    fontSize: 14,
    color: "#666",
  },
  classFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  instructor: {
    fontSize: 14,
    color: "#888",
  },
  capacity: {
    fontSize: 14,
    color: "#e67e22",
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
