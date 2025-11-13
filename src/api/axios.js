import axios from "axios";
import { Platform, Alert } from "react-native";
import { getToken  } from "../utils/tokenStorage";


const Api = axios.create({
  baseURL: Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api', 
  timeout: 10000, // 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

Api.interceptors.request.use(
  async (config) => {
    const token = await getToken(); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Interceptor global para manejar errores
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || 'Ocurrió un error inesperado.';

      switch (status) {
        case 400:
          Alert.alert('Solicitud incorrecta', message);
          break;
        case 500:
          Alert.alert('Error del servidor', 'Intenta de nuevo más tarde.');
          break;
      }
    } else if (error.request) {
      Alert.alert('Error de conexión', 'Revisa tu conexión a internet.');
    } else {
      Alert.alert('Error inesperado', error.message);
    }

    return Promise.reject(error);
  }
);

export default Api;
