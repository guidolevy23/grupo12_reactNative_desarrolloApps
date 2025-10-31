import { Platform } from "react-native";
import Constants from "expo-constants";

// 🔧 Detecta si estás en Android Emulator, iOS o dispositivo físico
const getBaseUrl = () => {
  // 🧠 Caso 1: Android Emulator (localhost del host = 10.0.2.2)
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080/api";
  }

  // 🧠 Caso 2: iOS Simulator (usa localhost directo)
  if (Platform.OS === "ios") {
    return "http://localhost:8080/api";
  }

  // 🧠 Caso 3: corriendo desde Expo Go en tu celular físico
  // Detecta automáticamente la IP local del host
  const expoHost = Constants.manifest?.hostUri?.split(":")[0];
  if (expoHost) {
    return `http://${expoHost}:8080/api`;
  }

  // 🧠 Fallback: web o cualquier otro entorno
  return "http://localhost:8080/api";
};

export const BASE_URL = getBaseUrl();

// Helper para requests genéricos
export async function apiFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ Error:", response.status, text);
    throw new Error(text || `Error ${response.status}`);
  }

  return response.json();
}
