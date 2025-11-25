import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { getNews } from "../../services/newsService";

export default function NoticiasScreen() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getNews();
      setNews(data);
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
            <Text style={styles.fecha}>{item.fecha}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  card: {
    marginBottom: 20,
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 10,
  },
  image: { width: "100%", height: 140, borderRadius: 10 },
  title: { marginTop: 8, fontSize: 18, fontWeight: "bold" },
  desc: { fontSize: 14, color: "#555" },
  fecha: { marginTop: 6, fontSize: 12, color: "#999" },
});
