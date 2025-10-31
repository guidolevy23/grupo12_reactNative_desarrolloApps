import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../app/home/utils/api";

// BASE_URL ya incluye /api
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    console.log("❌ Error leyendo token:", e);
  }
  return config;
});

const authService = {
  sendOtp: async (email) => {
    const { data } = await api.post("/auth/otp/request", { email });
    return data;
  },

  validateOtp: async (email, otp) => {
    const { data } = await api.post("/auth/otp/validate", { email, otp });
    // si tu validate devuelve token, lo guardo
    if (data?.token) {
      await AsyncStorage.setItem("token", data.token);
      await new Promise((r) => setTimeout(r, 200));
    }
    return data;
  },

  register: async (email, password, name) => {
    const { data } = await api.post("/auth/register", {
      username: email,
      password,
      name,
    });
    return data;
  },

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", {
      username: email,
      password,
    });
    if (data?.token) await AsyncStorage.setItem("token", data.token);
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get("/users/me");
    return data; // { id, email, name, ... }
  },
};

export default authService;
