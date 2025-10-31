import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../app/home/utils/api";

// Instancia de Axios para historial
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

const historyService = {
  // Obtener historial de asistencias con filtros
  getHistory: async (filters = {}) => {
    const { startDate, endDate, page = 0, size = 20 } = filters;
    const params = new URLSearchParams();
    
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    params.append("page", page);
    params.append("size", size);

    const response = await api.get(`/history?${params.toString()}`);
    return response.data;
  },

  // Obtener estadísticas del historial
  getHistoryStats: async () => {
    const response = await api.get("/history/stats");
    return response.data;
  },
};

export default historyService;

