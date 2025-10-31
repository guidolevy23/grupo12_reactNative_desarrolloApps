import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReservasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Reservas</Text>
      <Text>Aquí se listarán tus reservas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
});

