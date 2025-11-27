import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { getNews } from "../../services/newsService";

export default function NoticiasScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNews();

        // 🔥 IMPORTANTE: convertir URLs de backend a Android Emulator
        const processed = data.map((item) => ({
          ...item,
          imagenUrl: item.imagenUrl.replace("localhost", "10.0.2.2"), // ← SOLO ESTO
        }));

        setNews(processed);
        setFiltered(processed);

      } catch (err) {
        console.log("Error cargando noticias:", err);
      }
    };
    load();
  }, []);

  const applyFilter = (type) => {
    setFilter(type);

    if (type === "todos") {
      setFiltered(news);
    } else {
      setFiltered(news.filter((n) => n.tipo === type));
    }
  };

  const renderItem = ({ item }) => {
    console.log("🖼 URL FINAL:", item.imagenUrl);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("NoticiaDetalle", { noticia: item })}
      >
        <Image source={{ uri: item.imagenUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.desc} numberOfLines={2}>
            {item.descripcion}
          </Text>
          <Text style={[styles.badge, styles[item.tipo]]}>{item.tipo.toUpperCase()}</Text>
          <Text style={styles.date}>{item.fecha}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "todos" && styles.filterActive]}
          onPress={() => applyFilter("todos")}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === "promo" && styles.filterActive]}
          onPress={() => applyFilter("promo")}
        >
          <Text style={styles.filterText}>Promos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === "evento" && styles.filterActive]}
          onPress={() => applyFilter("evento")}
        >
          <Text style={styles.filterText}>Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === "novedad" && styles.filterActive]}
          onPress={() => applyFilter("novedad")}
        >
          <Text style={styles.filterText}>Novedades</Text>
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },

  filters: {
    flexDirection: "row",
    marginBottom: 16,
    height: 45,
    maxHeight: 45,
  },

  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#EEE",
    borderRadius: 16,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },

  filterActive: {
    backgroundColor: "#3498DB",
  },

  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  card: {
    backgroundColor: "#F4F4F4",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  desc: {
    marginTop: 6,
    fontSize: 14,
    color: "#444",
  },
  badge: {
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: "white",
  },

  promo: { backgroundColor: "#E74C3C" },
  evento: { backgroundColor: "#2980B9" },
  novedad: { backgroundColor: "#27AE60" },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
  },
});
