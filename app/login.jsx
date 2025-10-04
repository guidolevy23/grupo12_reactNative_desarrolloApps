import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import authService from "../services/authService";
import CustomButton from "../components/CustomButton";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

const handleSendOtp = async () => {
  console.log("Botón presionado con email:", email);
  Alert.alert("Intentando enviar código...");

  try {
    if (!email.includes("@")) {
      Alert.alert("Error", "Ingresá un email válido");
      return;
    }

    const response = await authService.sendOtp(email);
    Alert.alert("Éxito", response);
    router.push({ pathname: "/otp", params: { email } });
  } catch (error) {
    console.error("Error:", error);
    Alert.alert("Error", "No se pudo enviar el código. Verificá el backend.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>RitmoFit 🏋️‍♂️</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresá tu email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <CustomButton title="Enviar código" onPress={handleSendOtp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 30, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
    borderRadius: 6,
    borderColor: "#ccc",
  },
});
