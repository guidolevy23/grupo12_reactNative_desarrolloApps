import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getClassDetails } from "../../services/classService";
import { crearReserva } from "../../services/reservaService";
import { useProfile } from "../../services/profileService";
import { getCupos, initCupos, incrementarCupo } from "../../services/cuposService";
import { openMapsByCoords } from "../../utils/mapsLinking";


export default function ClassDetailScreen({ route }) {
  const navigation = useNavigation();
  const { classId } = route.params;
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState(false);

  const { getUserDetail } = useProfile();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        const details = await getClassDetails(classId);

        // inicializo cupos simulados
        const cupos = await initCupos(
          classId,
          20, // capacity fake
          0   // inscriptos iniciales fake
        );

        setClassData({
          ...details,
          capacity: cupos.capacity,
          currentEnrollment: cupos.currentEnrollment,
        });


        setClassData(details);
      } catch (err) {
        console.error("❌ Error al cargar detalles:", err);
        setError("No se pudieron cargar los detalles de la clase");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId]);

const handleReserve = async () => {
  try {
    setReserving(true);

    const usuario = await getUserDetail();
    const userId = usuario?.id || usuario?.idUsuario;

    if (!userId) {
      Alert.alert(
        "Error",
        "⚠ No se pudo obtener el usuario. Iniciá sesión nuevamente."
      );
      return;
    }

    console.log("🧩 Reservando clase:", {
      usuarioId: userId,
      courseId: classId,
    });

    // ⬇️ ahora crearReserva lanza errores con mensajes limpios
    await crearReserva(userId, classId);

    const nuevosCupos = await incrementarCupo(classId);

    setClassData(prev => ({
      ...prev,
      currentEnrollment: nuevosCupos.currentEnrollment,
    }));


    Alert.alert("Reserva confirmada", "🎉 ¡Te anotaste correctamente!");

  } catch (error) {
    console.log("❌ Error al reservar:", error);

    // ⛑ Los errores ya llegan con error.message desde reservaService
    Alert.alert("Atención", error.message);
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
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!classData) return null;

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Por confirmar";
    try {
      const date = new Date(dateStr);
      const dateFormatted = date.toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const time = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
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
        <Text style={styles.type}>{classData.name?.split(" ")[0] || "Clase"}</Text>

        <View style={styles.infoSection}>
          <Info label="🏢 Sede:" value={classData.branch?.nombre || "Sede Principal"} onPress={() =>
          openMapsByCoords(classData.branch?.lat, classData.branch?.lng)}/>
          <Info label="⏰ Horario:" value={formatDateTime(classData.startsAt)} />
          <Info label="👤 Profesor:" value={classData.professor || "Por asignar"} />
          <Info label="⏱️ Duración:" value={classData.duration || "60 min"} />
          <Info
            label="👥 Lugares disponibles:"
            value={availableSpots > 0 ? `${availableSpots} lugares` : "Clase llena"}
          />
          {classData.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>📝 Descripción:</Text>
              <Text style={styles.description}>{classData.description}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.reserveButton, reserving && styles.reserveButtonDisabled]}
          onPress={handleReserve}
          disabled={reserving}
        >
          {reserving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.reserveButtonText}>🏋️‍♂️ Reservar Clase</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const Info = ({ label, value, onPress }) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>

      {onPress ? (
        <Text
          style={[styles.value, styles.valueLink]}
          onPress={onPress}
        >
          {value}
        </Text>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  className: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#333", marginBottom: 5 },
  type: { fontSize: 18, textAlign: "center", color: "#667eea", marginBottom: 30, fontWeight: "600", textTransform: "uppercase" },
  infoSection: { backgroundColor: "white", borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  label: { fontSize: 16, fontWeight: "600", color: "#333" },
  value: { fontSize: 16, color: "#666" },
  valueLink: { color: "#3366ff", textDecorationLine: "underline"},
  descriptionContainer: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  description: { fontSize: 14, color: "#666", marginTop: 10, lineHeight: 22 },
  reserveButton: { backgroundColor: "#667eea", padding: 18, borderRadius: 12, alignItems: "center", marginBottom: 15, shadowColor: "#667eea", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  reserveButtonDisabled: { backgroundColor: "#9ca3db" },
  reserveButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  backButton: { backgroundColor: "white", padding: 15, borderRadius: 12, alignItems: "center", borderWidth: 2, borderColor: "#667eea" },
  backButtonText: { color: "#667eea", fontSize: 16, fontWeight: "600" },
  errorText: { color: "#E63F34", fontSize: 16, textAlign: "center", marginBottom: 20 },
  loadingText: { marginTop: 10, color: "#666", fontSize: 16 },
  button: { backgroundColor: "#667eea", padding: 15, borderRadius: 10, alignItems: "center", minWidth: 150 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  mapButton: {
    marginTop: 18,
    backgroundColor: "#667eea",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
