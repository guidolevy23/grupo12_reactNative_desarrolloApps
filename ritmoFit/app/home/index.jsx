import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Clases() {
  const router = useRouter();
  const clases = [
    { id: "1", nombre: "Funcional 18:00", sede: "Palermo" },
    { id: "2", nombre: "Yoga 19:00", sede: "Belgrano" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clases disponibles</Text>
      <FlatList
        data={clases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/home/detalle?id=${item.id}`)}
          >
            <Text style={styles.className}>{item.nombre}</Text>
            <Text style={styles.location}>{item.sede}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: { backgroundColor: "#f4f4f4", padding: 15, borderRadius: 10, marginBottom: 10 },
  className: { fontSize: 18, fontWeight: "600" },
  location: { color: "#555" },
});
