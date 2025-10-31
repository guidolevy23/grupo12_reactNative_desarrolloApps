import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../app/home/utils/api";


// Crear instancia de Axios general
const api = axios.create({
  baseURL: BASE_URL, // ⚠️ BASE_URL ya tiene "/api"
  headers: { "Content-Type": "application/json" },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log("❌ Error leyendo token:", error);
  }
  return config;
});

const authService = {
  // 🔹 Enviar OTP
  sendOtp: async (email) => {
    const response = await api.post("/auth/otp/request", { email });
    return response.data;
  },

  // 🔹 Validar OTP (ya usa BASE_URL)
  validateOtp: async (email, otp) => {
    try {
      const response = await api.post("/auth/otp/validate", { email, otp });
      console.log("🟢 Respuesta del backend (validateOtp):", response.data);

      const token = response.data.token;
      if (token) {
        console.log("✅ TOKEN GUARDADO:", token);
        await AsyncStorage.setItem("token", token);
        await new Promise((r) => setTimeout(r, 300)); // espera breve
      } else {
        console.log("⚠️ No vino token en la respuesta");
      }

      return response.data;
    } catch (error) {
      console.log("❌ Error en validateOtp:", error);
      throw error;
    }
  },

  // 🔹 Registro
  register: async (email, password, name) => {
    const response = await api.post("/auth/register", {
      username: email,
      password,
      name,
    });
    return response.data;
  },

  // 🔹 Login
  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      username: email,
      password,
    });
    const { token } = response.data;
    if (token) {
      await AsyncStorage.setItem("token", token);
    }
    return response.data;
  },

  // 🔹 Obtener perfil
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
};

export default authService;
