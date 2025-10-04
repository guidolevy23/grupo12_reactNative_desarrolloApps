import React from "react";

import { useState } from "react";
import { View, TextInput, Alert, StyleSheet, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import authService from "../services/authService";
import CustomButton from "../components/CustomButton";

export default function OtpScreen() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const verifyOtp = async () => {
    try {
      const result = await authService.verifyOtp(email, otp);
      if (result.status === "OK") {
        Alert.alert("Éxito", result.message);
        router.replace("/");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo validar el código");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificación OTP</Text>
      <Text style={styles.subtitle}>Código enviado a {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresá el código"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <CustomButton title="Validar" onPress={verifyOtp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, marginBottom: 20, padding: 12, borderRadius: 5, textAlign: "center" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 30 },
});
