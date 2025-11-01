import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useAxios } from "../../hooks/useAxios";

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const axios = useAxios();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", onPress: logout, style: "destructive" },
      ]
    );
  };

  // Ejemplo de uso del hook useAxios con interceptor
  const pedirDatos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/datos-protegidos');
      console.log(res.data);
      Alert.alert("Éxito", "Datos obtenidos correctamente");
    } catch (err) {
      console.log('Error:', err.message);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Usuario:</Text>
        <Text style={styles.value}>Entrenador Pokémon</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.requestButton]} 
        onPress={pedirDatos}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Cargando..." : "Pedir Datos (Ejemplo useAxios)"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#333",
  },
  button: {
    backgroundColor: "#E63F34",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  requestButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
