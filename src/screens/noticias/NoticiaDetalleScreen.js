import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

export default function NoticiaDetalleScreen({ route }) {
  const { noticia } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: noticia.imagenUrl }} style={styles.image} />

      <Text style={styles.title}>{noticia.titulo}</Text>
      <Text style={styles.type}>{noticia.tipo.toUpperCase()}</Text>
      <Text style={styles.date}>{noticia.fecha}</Text>

      <Text style={styles.desc}>{noticia.descripcion}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  image: { width: "100%", height: 240 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
  },
  type: {
    marginHorizontal: 16,
    marginTop: 6,
    fontSize: 15,
    fontWeight: "bold",
    color: "#3498DB",
  },
  date: {
    marginHorizontal: 16,
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  desc: {
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
    margin: 16,
    marginTop: 20,
  },
});
