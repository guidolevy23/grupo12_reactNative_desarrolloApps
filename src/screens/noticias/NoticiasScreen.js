// ===============================================
//   NoticiasScreen.js
// ===============================================
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { getNews } from "../../services/newsService";

const categorias = ["todas", "promos", "eventos", "novedades"];

export default function NoticiasScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [categoria, setCategoria] = useState("todas");

  useEffect(() => {
    const loadNews = async () => {
      const data = await getNews();

      // Ordenar por fecha descendente
      const ordenado = [...data].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      setNews(ordenado);
    };
    loadNews();
  }, []);

  const filteredNews =
    categoria === "todas"
      ? news
      : news.filter((n) => n.tipo === categoria.slice(0, -1));

  const banner = news.length > 0 ? news[0] : null;

  return (
    <View style={styles.container}>
      <ScrollView>

        {/* Banner principal */}
        {banner && (
          <TouchableOpacity
            onPress={() => navigation.navigate("NoticiaDetalle", { noticia: banner })}
          >
            <View style={styles.bannerContainer}>
              <Image
                source={{ uri: banner.imagenUrl }}
                style={styles.bannerImage}
              />
              <Text style={styles.bannerTitle}>{banner.titulo}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Categorías */}
        <View style={styles.categoriasContainer}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                categoria === cat && styles.chipActive
              ]}
              onPress={() => setCategoria(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  categoria === cat && styles.chipTextActive
                ]}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de noticias */}
        <FlatList
          data={filteredNews}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("NoticiaDetalle", { noticia: item })}
            >
              <View style={styles.card}>
                <Image source={{ uri: item.imagenUrl }} style={styles.image} />
                <Text style={styles.title}>{item.titulo}</Text>
                <Text style={styles.desc}>{item.descripcion}</Text>
                <Text style={styles.fecha}>{item.fecha}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  bannerContainer: { marginBottom: 20, position: "relative" },
  bannerImage: { width: "100%", height: 180, borderRadius: 10 },
  bannerTitle: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowRadius: 8,
  },

  categoriasContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  chipActive: { backgroundColor: "#667eea" },
  chipText: { fontSize: 14, color: "#333" },
  chipTextActive: { color: "#fff", fontWeight: "bold" },

  card: {
    marginBottom: 20,
    marginHorizontal: 16,
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderRadius: 10,
  },
  image: { width: "100%", height: 140, borderRadius: 10 },
  title: { marginTop: 8, fontSize: 18, fontWeight: "bold" },
  desc: { fontSize: 14, color: "#555" },
  fecha: { marginTop: 6, fontSize: 12, color: "#999" },
});
