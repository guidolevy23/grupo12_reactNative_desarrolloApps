import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import authService from "../services/authService";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa tu email");
      return;
    }

    setLoading(true);
    try {
      await authService.sendOtp(email);
      Alert.alert(
        "Código enviado",
        "Se ha enviado un código OTP a tu correo electrónico"
      );
      setStep(2);
    } catch (error) {
      const message =
        error.response?.data?.message || "Error al enviar el código OTP";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.sendOtp(email);
      Alert.alert("Código reenviado", "Se ha enviado un nuevo código OTP");
    } catch (error) {
      const message =
        error.response?.data?.message || "Error al reenviar el código OTP";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || !name.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const result = await authService.validateOtp(email, otp);
      if (result.status === "OK" || result.token) {
        // Si el registro requiere nombre, hacerlo ahora
        if (name && !result.user) {
          try {
            await authService.register(email, "", name);
          } catch (regError) {
            console.log("Registro adicional:", regError);
          }
        }
        Alert.alert("¡Registro exitoso!", "Tu cuenta ha sido creada correctamente", [
          { text: "OK", onPress: () => router.replace("/(tabs)") },
        ]);
      } else {
        Alert.alert("Error", "Código OTP inválido");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Error al validar el código OTP";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {step === 1 ? "Crear cuenta" : "Verificar código"}
      </Text>

      {step === 1 ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar código OTP</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.linkText}>¿Ya tienes cuenta? Iniciar sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Ingresa el código enviado a {email}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Código OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verificar y crear cuenta</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleResendOtp}
            disabled={loading}
          >
            <Text style={styles.linkText}>Reenviar código</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setStep(1)}
          >
            <Text style={styles.linkText}>Cambiar email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#e67e22",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#e67e22",
    fontSize: 14,
  },
});

