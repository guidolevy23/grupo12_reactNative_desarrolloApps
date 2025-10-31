import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "../../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar token y perfil al iniciar la app
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const profile = await authService.getProfile();
          setUser(profile);
        }
      } catch (error) {
        console.log("❌ Error cargando sesión:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  // 🔹 Login: guarda token y usuario
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.token) {
      await AsyncStorage.setItem("token", res.token);
      const profile = await authService.getProfile();
      setUser(profile);
    }
  };

  // 🔹 Logout: limpia token y sesión
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);
