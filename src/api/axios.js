import axios from "axios";
import { Platform, Alert } from "react-native";
import { getToken } from "../utils/tokenStorage";
import { API_URL } from "@env";

let logoutFn = null;

export const setAxiosLogoutFunction = (fn) => {
  logoutFn = fn;
};

// Configuración de URL base según el entorno
// Para desarrollo: usa la IP de tu máquina local o localhost
// Para producción: usa la URL del servidor real

const getBaseURL = () => {
  // Si hay una variable de entorno API_URL, úsala (desde .env)
  if (API_URL) {
    console.log('🌐 Using API_URL from .env:', API_URL);
    return API_URL;
  }

  // Fallback para desarrollo si no hay .env
  console.warn('⚠️ No API_URL found in .env, using fallback');
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Para emulador Android: 10.0.2.2 apunta a localhost de la máquina host
      return 'http://10.0.2.2:8080/api';  
    }
    // iOS simulator puede usar localhost
    return 'http://localhost:8080/api';
  }

  // Producción: deberías tener una URL real aquí
  return 'https://api.tudominio.com/api';
};

const Api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
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
    // const { logout } = useContext(AuthContext)
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || 'Ocurrió un error inesperado.';

      switch (status) {
        case 401:
          if (logoutFn) logoutFn();
          break;
        case 400:
          Alert.alert('Solicitud incorrecta', message);
          break;
        case 500:
          Alert.alert('Error del servidor', 'Intenta de nuevo más tarde.');
          break;
      }
    } else if (error.request) {
      console.error(error)
      console.error(error.request)
      Alert.alert('Error de conexión', 'Revisa tu conexión a internet.');
    } else {
      Alert.alert('Error inesperado', error.message);
    }

    return Promise.reject(error);
  }
);

export default Api;
