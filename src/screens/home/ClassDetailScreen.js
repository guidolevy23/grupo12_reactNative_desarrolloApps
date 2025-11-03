import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getClassDetails, reserveClass } from "../../services/classService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClassDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { classId } = route.params;
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        const details = await getClassDetails(classId);
        setClassData(details);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar los detalles de la clase");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId]);

  const handleReserve = async () => {
    try {
      setReserving(true);
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        setError("Debes iniciar sesión para reservar");
        return;
      }

      await reserveClass(classId, token);
      alert("¡Clase reservada exitosamente!");
      navigation.goBack();
    } catch (err) {
      setError("Error al reservar la clase. Intenta nuevamente.");
      console.error(err);
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!classData) {
    return null;
  }

  // Formatear fecha/hora
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Por confirmar";
    try {
      const date = new Date(dateStr);
      const dateFormatted = date.toLocaleDateString('es-AR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      return `${dateFormatted} - ${time}`;
    } catch {
      return dateStr;
    }
  };

  const availableSpots = (classData.capacity || 20) - (classData.currentEnrollment || 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.className}>{classData.name}</Text>
        <Text style={styles.type}>{classData.name?.split(' ')[0] || 'Clase'}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🏢 Sede:</Text>
            <Text style={styles.value}>{classData.branch || 'Sede Principal'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>⏰ Horario:</Text>
            <Text style={styles.value}>{formatDateTime(classData.startsAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>👤 Profesor:</Text>
            <Text style={styles.value}>{classData.professor || "Por asignar"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>⏱️ Duración:</Text>
            <Text style={styles.value}>{classData.duration || "60 min"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>👥 Lugares disponibles:</Text>
            <Text style={styles.value}>
              {availableSpots > 0 ? `${availableSpots} lugares` : 'Clase llena'}
            </Text>
          </View>

          {classData.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>📝 Descripción:</Text>
              <Text style={styles.description}>{classData.description}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.reserveButton,
            reserving && styles.reserveButtonDisabled
          ]}
          onPress={handleReserve}
          disabled={reserving}
        >
          {reserving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.reserveButtonText}>
              🏋️‍♂️ Reservar Clase
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  className: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 5,
  },
  type: {
    fontSize: 18,
    textAlign: "center",
    color: "#667eea",
    marginBottom: 30,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  descriptionContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    lineHeight: 22,
  },
  reserveButton: {
    backgroundColor: "#667eea",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  reserveButtonDisabled: {
    backgroundColor: "#9ca3db",
  },
  reserveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#667eea",
  },
  backButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#E63F34",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#667eea",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 150,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ClassDetailScreen;
