import { useContext, useMemo } from "react";
import axios from "axios";
import { Platform } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getToken as getStoredToken } from "../utils/tokenStorage";

export const useAxios = () => {
  const { token, logout } = useContext(AuthContext);

  const instance = useMemo(() => {
    const baseURL =
      Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';

    const api = axios.create({ baseURL, timeout: 10000 });

    api.interceptors.request.use(async (config) => {
      // preferí el token del contexto; si no, leé del storage
      console.log(token)
      let auth = token ?? (await getStoredToken());
      console.log("TOKEN ENVIADO:", auth);
      if (auth) config.headers.Authorization = `Bearer ${auth}`;
      return config;
    });

    api.interceptors.response.use(
      (res) => res,
      async (err) => {
        console.log("AXIOS ERROR:", err.message, err.response?.status, err.config?.url);
        if (err.response?.status === 401) {   // solo en 401
          await logout?.();
        }
        return Promise.reject(err);
      }
    );

    return api;
  }, [token, logout]);

  return instance;
};