import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { getNews } from "../../services/newsService";

export default function NoticiasScreen() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNews();
        setNews(data);
      } catch (err) {
        console.error("Error cargando noticias:", err);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagenUrl }} style={styles.image} />
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.desc}>{item.descripcion}</Text>
            <Text style={styles.type}>{item.tipo.toUpperCase()}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF"
  },
  card: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    elevation: 3
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold"
  },
  desc: {
    marginTop: 6,
    fontSize: 14,
    color: "#444"
  },
  type: {
    marginTop: 8,
    fontSize: 12,
    color: "#0066cc",
    fontWeight: "bold"
  },
  fecha: {
    marginTop: 4,
    fontSize: 12,
    color: "#777"
  }
});
