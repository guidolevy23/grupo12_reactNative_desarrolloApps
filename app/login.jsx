import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import authService from "../services/authService";
import CustomButton from "../components/CustomButton";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    try {
      if (!email.includes("@")) {
        Alert.alert("Error", "Ingresá un email válido");
        return;
      }
      await authService.sendOtp(email);
      router.push({ pathname: "/otp", params: { email } });
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el código");
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
      <CustomButton title="Enviar código" onPress={sendOtp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, marginBottom: 20, padding: 12, borderRadius: 5 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 40 },
});
