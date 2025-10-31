import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../app/home/utils/api";

// Instancia de Axios para usuario
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

const userService = {
  // Obtener perfil del usuario actual
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Actualizar perfil del usuario
  updateProfile: async (profileData) => {
    const formData = new FormData();
    
    if (profileData.name) formData.append("name", profileData.name);
    if (profileData.email) formData.append("email", profileData.email);
    if (profileData.photo) {
      formData.append("photo", {
        uri: profileData.photo.uri,
        type: profileData.photo.type || "image/jpeg",
        name: profileData.photo.fileName || "photo.jpg",
      });
    }

    const response = await api.put("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Actualizar perfil sin foto (solo datos básicos)
  updateProfileBasic: async (name, email) => {
    const response = await api.put("/users/me", { name, email });
    return response.data;
  },
};

export default userService;
