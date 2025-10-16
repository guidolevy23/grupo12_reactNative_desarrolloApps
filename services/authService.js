import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.146:8080";

// Crear instancia de Axios general
const api = axios.create({
  baseURL: BASE_URL,
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
    const response = await api.post("/api/auth/otp/request", { email });
    return response.data;
  },

 validateOtp: async (email, otp) => {
  try {
    const response = await axios.post(
      "http://192.168.0.146:8080/api/auth/otp/validate",
      { email, otp }
    );

    const token = response.data.token;
    console.log("🟢 Respuesta del backend (validateOtp):", response.data);

    if (token) {
      console.log("✅ TOKEN GUARDADO:", token);
      await AsyncStorage.setItem("token", token);

      // Espera breve para asegurar que se guarde
      await new Promise((r) => setTimeout(r, 300));
    } else {
      console.log("❌ No vino token en la respuesta");
    }

    return response.data;
  } catch (error) {
    console.log("❌ Error en validateOtp:", error);
    throw error;
  }
},


register: async (email, password, name) => {
  const response = await api.post("/api/auth/register", {
    username: email,  // 👈 CAMBIA ACÁ
    password,
    name,
  });
  return response.data;
},


  // 🔹 Obtener datos del usuario logueado
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
};

export default authService;
