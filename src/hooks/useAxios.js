import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../utils/tokenStorage";
import axios from "axios";
import { ALWAYS } from "expo-secure-store";

export const useAxios = () => {
  const { logout } = useContext(AuthContext);

  const instance = useMemo(() => {
    const axiosInstance = axios.create({ baseURL: "https://api.com" });

    axiosInstance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosInstance.interceptors.response.use(
      (res) => res,
      async (err) => {
        await logout();
        if (err.response?.status === 401) {
          await logout();
        }
        return Promise.reject(err);
      }
    );

    return axiosInstance;
  }, [logout]);

  return instance;
};
