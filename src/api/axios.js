import axios from "axios";
import { Platform } from "react-native";
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

export default Api;
