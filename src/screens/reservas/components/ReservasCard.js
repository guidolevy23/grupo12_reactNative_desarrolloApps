import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ReservasCard({ reserva, onCancelar }) {
  const { id, course, estado } = reserva;
  const { branch } = course;
  const navigation = useNavigation();

  const handleCheckIn = () => {
    navigation.navigate("QRScanner", { reservaId: id });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🏋️ {course.name}</Text>
      <Text style={styles.text}>📍 {branch?.nombre || "Sede no disponible"}</Text>
      <Text style={styles.text}>🕓 {course.startsAt}</Text>

      <Text
        style={[
          styles.estado,
          estado === "CONFIRMADA"
            ? styles.estadoConfirmada
            : estado === "CANCELADA"
              ? styles.estadoCancelada
              : styles.estadoExpirada,
        ]}
      >
        {estado}
      </Text>

      {estado === "CONFIRMADA" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleCheckIn}
            style={styles.checkInBtn}
          >
            <Text style={styles.checkInText}>📱 Check In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onCancelar(id)}
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelText}>Cancelar reserva</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  text: {
    color: "#555",
    fontSize: 14,
  },
  estado: {
    marginTop: 8,
    fontWeight: "600",
  },
  estadoConfirmada: {
    color: "#27ae60",
  },
  estadoCancelada: {
    color: "#e74c3c",
  },
  estadoExpirada: {
    color: "#999",
  },
  buttonContainer: {
    marginTop: 10,
    gap: 8,
  },
  checkInBtn: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#667eea",
  },
  checkInText: {
    color: "#667eea",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: "#fceaea",
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelText: {
    color: "#c0392b",
    textAlign: "center",
    fontWeight: "600",
  },
});
