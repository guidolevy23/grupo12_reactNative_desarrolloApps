import React, {useCallback, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { openMapsByCoords } from "../../../utils/mapsLinking";

export default function ReservasCard({ reserva, onCancelar }) {
  const { id, course, estado } = reserva;
  const { branch } = course;
  const navigation = useNavigation();

  const handleCheckIn = () => {
    navigation.navigate("QRScanner", { reservaId: id });
  };
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const ordenarFecha = () =>{
    const fechaCompleta = course.startsAt.split("T");
    const horario = fechaCompleta[1].slice(0, 5); // HH:MM
    const fechaSola = fechaCompleta[0].split("-");

    const fechaOrdenada = [
      fechaSola[2],
      meses[Number(fechaSola[1]) - 1],
      fechaSola[0],
    ];
    setHora(horario)
    setFecha(fechaOrdenada.join(" "))
  }

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        if (!alive) return;
         ordenarFecha();
      })();
      return () => {
        alive = false;
      };
    }, [])
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🏋️ {course.name}</Text>
      <TouchableOpacity style={styles.flex} onPress={() => openMapsByCoords(branch?.lat, branch?.lng)}>
        <Text style={styles.text} >📍</Text> 
        <Text style={[styles.text, { textDecorationLine: "underline", color: "#3366ff" }]}>{branch.nombre}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>🕓 {hora}</Text>
      <Text style={styles.text}>📅 {fecha}</Text>

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
  flex:{
    display: "flex",
    flexDirection: "row"
  }
});
