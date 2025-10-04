import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import authService from "../services/authService";

export default function OtpScreen() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleValidateOtp = async () => {
    try {
      console.log("Presionaste validar OTP con:", otp);
      const result = await authService.validateOtp(email, otp);
      setMessage(result.message);
      if (result.status === "OK") {
        // 🔁 Redirigir al home (o login, lo que quieras)
        router.push("/home");
      }
    } catch (error) {
      setMessage("Error al validar OTP");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Ingrese el código OTP</Text>
      <TextInput
        placeholder="Código"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Button title="Validar código" onPress={handleValidateOtp} />
      {message && <Text style={{ marginTop: 20 }}>{message}</Text>}
    </View>
  );
}
