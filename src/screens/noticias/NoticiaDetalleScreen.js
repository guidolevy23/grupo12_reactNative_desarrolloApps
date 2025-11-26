// ===============================================
//   NoticiaDetalleScreen.js
// ===============================================
import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function NoticiaDetalleScreen({ route }) {
  const { noticia } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: noticia.imagenUrl }} style={styles.image} />

      <Text style={styles.title}>{noticia.titulo}</Text>
      <Text style={styles.fecha}>{noticia.fecha}</Text>
      <Text style={styles.desc}>{noticia.descripcion}</Text>

      {noticia.tipo === "promo" && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ver promoción</Text>
        </TouchableOpacity>
      )}

      {noticia.tipo === "evento" && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Agregar al calendario</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  image: { width: "100%", height: 250, borderRadius: 12, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  fecha: { color: "#888", marginBottom: 20 },
  desc: { fontSize: 16, lineHeight: 22, color: "#444", marginBottom: 30 },
  button: {
    backgroundColor: "#667eea",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
