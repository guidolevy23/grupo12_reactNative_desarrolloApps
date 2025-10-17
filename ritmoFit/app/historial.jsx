import { View, Text, FlatList, StyleSheet } from "react-native";

export default function Historial() {
  const historial = [
    { id: "1", clase: "Yoga", fecha: "10/10/2025", sede: "Belgrano" },
    { id: "2", clase: "Funcional", fecha: "12/10/2025", sede: "Palermo" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de asistencias</Text>
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.clase}</Text>
            <Text>{item.fecha}</Text>
            <Text>{item.sede}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
});
