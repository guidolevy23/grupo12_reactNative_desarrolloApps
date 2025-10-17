import { View, Text, Button, StyleSheet } from "react-native";

export default function Reservas() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservar una clase</Text>
      <Button title="Reservar Funcional 18:00" onPress={() => alert("Clase reservada")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});
