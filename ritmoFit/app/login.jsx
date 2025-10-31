import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import authService from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [usingOtp, setUsingOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkBiometric();
    checkSavedCredentials();
  }, []);

  const checkBiometric = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.error("Error checking biometric:", error);
    }
  };

  const checkSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("savedEmail");
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch (error) {
      console.error("Error loading saved credentials:", error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticación biométrica",
        cancelLabel: "Cancelar",
        fallbackLabel: "Usar contraseña",
      });

      if (result.success) {
        const savedEmail = await AsyncStorage.getItem("savedEmail");
        const savedPassword = await AsyncStorage.getItem("savedPassword");

        if (savedEmail && savedPassword) {
          await performLogin(savedEmail, savedPassword, true);
        } else {
          Alert.alert("Error", "No hay credenciales guardadas");
        }
      }
    } catch (error) {
      console.error("Error en autenticación biométrica:", error);
      Alert.alert("Error", "No se pudo usar la biometría");
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa tu email");
      return;
    }

    if (!password.trim() && !usingOtp) {
      Alert.alert("Error", "Por favor ingresa tu contraseña o usa OTP");
      return;
    }

    if (usingOtp && !otp.trim()) {
      Alert.alert("Error", "Por favor ingresa el código OTP");
      return;
    }

    if (usingOtp) {
      await handleOtpLogin();
    } else {
      await performLogin(email, password);
    }
  };

  const performLogin = async (userEmail, userPassword, isBiometric = false) => {
    setLoading(true);
    try {
      const data = await authService.login(userEmail, userPassword);

      if (data.token) {
        // Guardar credenciales para biometría (solo si no es biometría)
        if (!isBiometric) {
          await AsyncStorage.setItem("savedEmail", userEmail);
          // Guardar contraseña de forma segura (en producción usar keychain)
          await AsyncStorage.setItem("savedPassword", userPassword);
        }
        Alert.alert("Bienvenido", "Inicio de sesión exitoso");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Respuesta inesperada del servidor.");
      }
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "No se pudo iniciar sesión.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    setLoading(true);
    try {
      const result = await authService.validateOtp(email, otp);
      if (result.status === "OK" || result.token) {
        Alert.alert("Bienvenido", "Inicio de sesión exitoso");
        router.replace("/(tabs)");
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
      setUsingOtp(true);
    } catch (error) {
      const message =
        error.response?.data?.message || "Error al enviar el código OTP";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      {!usingOtp ? (
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Código OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
          editable={!loading}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {usingOtp ? "Verificar código" : "Ingresar"}
          </Text>
        )}
      </TouchableOpacity>

      {biometricAvailable && !usingOtp && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricLogin}
          disabled={loading}
        >
          <Text style={styles.biometricButtonText}>🔒 Usar biometría</Text>
        </TouchableOpacity>
      )}

      <View style={styles.linksContainer}>
        {!usingOtp ? (
          <>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleSendOtp}
              disabled={loading}
            >
              <Text style={styles.linkText}>
                ¿Olvidaste tu contraseña? Usar código OTP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.linkText}>¿No tienes cuenta? Registrarse</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                setUsingOtp(false);
                setOtp("");
              }}
            >
              <Text style={styles.linkText}>Volver a contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleSendOtp}
              disabled={loading}
            >
              <Text style={styles.linkText}>Reenviar código</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%",
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
  biometricButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  biometricButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linksContainer: {
    marginTop: 20,
    gap: 10,
  },
  linkButton: {
    alignItems: "center",
    padding: 10,
  },
  linkText: {
    color: "#e67e22",
    fontSize: 14,
  },
});

