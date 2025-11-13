import axios from "axios";
import { Platform } from "react-native";
import { getToken } from "../utils/tokenStorage";
import { API_URL } from '@env';


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
      // Para dispositivo físico: usa tu IP local (ej: 192.168.0.165)
      return 'http://10.0.2.2:8080/api';  // Emulador por defecto
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

export default Api;
