import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { openMapsByCoords } from "../../../utils/mapsLinking";

export default function ReservasCard({ reserva, onCancelar }) {
  const { id, course, estado } = reserva;
  const { branch } = course;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🏋️ {course.name}</Text>
      <TouchableOpacity style={styles.flex} onPress={() => openMapsByCoords(branch?.lat, branch?.lng)}>
        <Text style={styles.text} >📍</Text> 
        <Text style={[styles.text, { textDecorationLine: "underline", color: "#3366ff" }]}>{branch.nombre}</Text>
      </TouchableOpacity>
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
        <TouchableOpacity
          onPress={() => onCancelar(id)}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelText}>Cancelar reserva</Text>
        </TouchableOpacity>
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
  cancelBtn: {
    backgroundColor: "#fceaea",
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelText: {
    color: "#c0392b",
    textAlign: "center",
    fontWeight: "600",
  },
  flex:{
    display: "flex",
    flexDirection: "row"
  }
});
