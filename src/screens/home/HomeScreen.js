import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import Filtros from "./components/Filter";

import {
  getClassList,
  getClassesByBranch,
  getClassesByName,
  getClassesByDate,
} from "../../services/classService";
import { getCupos } from "../../services/cuposService";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filtros dinámicos desde backend
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableDisciplines, setAvailableDisciplines] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const ordenarFecha = (inicio) =>{
    const fechaCompleta = inicio.split("T");
    const fechaSola = fechaCompleta[0].split("-");
    const fechaOrdenada = [
      fechaSola[2],
      meses[Number(fechaSola[1]) - 1],
      fechaSola[0],
    ];
    return fechaOrdenada.join(" ");
  }

  // ==================================================================
  // 🔥 EXTRACTORES (igual que Android → se derivan de los cursos)
  // ==================================================================
  const extractUniqueBranches = (courses) => {
    const branches = courses.map(c => c.branch.nombre).filter(Boolean);
    return [...new Set(branches)];
  };

  const extractUniqueDisciplines = (courses) => {
    const disciplines = courses
      .map(c => c.name?.split(" ")[0]) // “Yoga Avanzado” → “Yoga”
      .filter(Boolean);
    return [...new Set(disciplines)];
  };

  const extractUniqueDates = (courses) => {
    const dates = courses
      .map(c => c.startsAt?.split("T")[0])
      .filter(Boolean);
    return [...new Set(dates)];
  };

  // ==================================================================
  // 🔥 FILTRAR (backend)
  // ==================================================================
  const applyFilters = async ({ branch, discipline, date }) => {
    try {
      setLoading(true);
      setError(null);

      let results;

      if (branch) results = await getClassesByBranch(branch);
      else if (discipline) results = await getClassesByName(discipline);
      else if (date) results = await getClassesByDate(date);
      else results = await getClassList();

      // Cargar cupos reales para cada clase filtrada
      const resultsWithCupos = await Promise.all(
        results.map(async (course) => {
          try {
            const cupos = await getCupos(course.id);
            return {
              ...course,
              capacity: cupos.capacity,
              currentEnrollment: cupos.currentEnrollment,
            };
          } catch {
            return {
              ...course,
              capacity: 20,
              currentEnrollment: 0,
            };
          }
        })
      );

      setClasses(resultsWithCupos);
    } catch (err) {
      console.log("❌ Error al filtrar:", err);
      setError("No se pudieron cargar las clases filtradas");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================================
  // 🔥 CARGAR LISTA INICIAL (y extraer filtros dinámicos)
  // ==================================================================
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getClassList();
      
      // Cargar cupos reales para cada clase
      const dataWithCupos = await Promise.all(
        data.map(async (course) => {
          try {
            const cupos = await getCupos(course.id);
            return {
              ...course,
              capacity: cupos.capacity,
              currentEnrollment: cupos.currentEnrollment,
            };
          } catch {
            // Si falla, usar valores por defecto
            return {
              ...course,
              capacity: 20,
              currentEnrollment: 0,
            };
          }
        })
      );
      
      setClasses(dataWithCupos);

      // Extraer listas dinámicas (como Android)
      setAvailableBranches(extractUniqueBranches(dataWithCupos));
      setAvailableDisciplines(extractUniqueDisciplines(dataWithCupos));
      setAvailableDates(extractUniqueDates(dataWithCupos));

    } catch (err) {
      console.error(err);
      setError("Error al cargar las clases");
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

  // ==================================================================
  // 🔥 Render de cada card
  // ==================================================================
  const renderClassItem = ({ item }) => {
    const availableSpots =
      (item.capacity || 20) - (item.currentEnrollment || 0);

    const isAlmostFull = availableSpots <= 5;
    const fechaLegible = ordenarFecha(item.startsAt);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ClassDetail", { classId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.className}>{item.name}</Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor(item.name?.split(" ")[0]) },
            ]}
          >
            <Text style={styles.typeBadgeText}>
              {item.name?.split(" ")[0]}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.infoLabel}>🏢 {item.branch.nombre}</Text>
          {fechaLegible && (
            <Text style={styles.infoLabel}>
              📅 {fechaLegible}
            </Text>
          )}
          {item.startsAt && (
            <Text style={styles.infoLabel}>
              ⏰ {new Date(item.startsAt).toLocaleTimeString('es-AR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              {item.endsAt && ` - ${new Date(item.endsAt).toLocaleTimeString('es-AR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}`}
            </Text>
          )}

          {item.professor && (
            <Text style={styles.infoLabel}>👤 {item.professor}</Text>
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

  // ==================================================================
  // 🔥 Loading
  // ==================================================================
  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando clases...</Text>
      </View>
    );
  }

  // ==================================================================
  // 🔥 PANTALLA COMPLETA
  // ==================================================================
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>🏋️‍♂️ Clases Disponibles</Text>
        <Text style={styles.subtitle}>Elegí tu clase y reservá tu lugar</Text>
      </View>

      {/* BOTÓN PARA ABRIR LOS FILTROS */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterButtonText}>
          {showFilters ? "Ocultar filtros ▲" : "Mostrar filtros ▼"}
        </Text>
      </TouchableOpacity>

      {/* PANEL DESPLEGABLE */}
      {showFilters && (
        <View style={{ paddingHorizontal: 15 }}>
          <Filtros
            branches={availableBranches}
            disciplines={availableDisciplines}
            dates={availableDates}
            onApply={(f) => {
              applyFilters(f);
              setShowFilters(false);
            }}
          />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id?.toString()}
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
            <Text style={styles.emptyText}>No hay clases disponibles ahora</Text>
          </View>
        }
      />
    </View>
  );
}

// ==================================================================
// 🔥 ESTILOS (LOS MISMOS QUE TENÍAS)
// ==================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  loadingText: { marginTop: 10, color: "#666", fontSize: 16 },

  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 16, color: "#666" },

  filterButton: {
    backgroundColor: "white",
    padding: 12,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  filterButtonText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  listContent: { padding: 15 },

  errorContainer: {
    backgroundColor: "#fff3cd",
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  errorText: { color: "#856404", fontWeight: "600" },

  emptyContainer: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 16, color: "#999" },

  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  className: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  typeBadgeText: { color: "white", fontSize: 12, fontWeight: "600" },
  cardBody: { gap: 8 },
  infoLabel: { fontSize: 14, color: "#666" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  spotsText: { fontSize: 14, color: "#48bb78", fontWeight: "600" },
  spotsTextWarning: { color: "#f59e0b" },
  arrowText: { fontSize: 20, color: "#667eea", fontWeight: "bold" },
});
