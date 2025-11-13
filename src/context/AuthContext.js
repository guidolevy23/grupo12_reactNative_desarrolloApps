// import { createContext, useEffect, useState, useMemo } from 'react';
// import { saveToken, getToken, removeToken } from '../utils/tokenStorage';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const t = await getToken();
//       setToken(t);
//     })();
//   }, []);

//   const login = async (jwt) => {
//     setToken(jwt);
//     await saveToken(jwt);
//   };

//   const logout = async (jwt) => {
//     setToken(null);
//     await removeToken(jwt);
//   };

//   const value = useMemo(() => ({ token, login, logout }), [token]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AuthService from '../services/authService'; 
import { getToken, removeToken, saveToken } from '../utils/tokenStorage';

// 1. Create the Context object
export const AuthContext = createContext(null);

// 3. The Provider component that manages state and logic
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const token = await getToken();
      if (token) {
        // Si hay token, solicitar autenticación biométrica
        await authenticateWithBiometrics();
      } else {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  // --- Biometric Authentication ---
  const authenticateWithBiometrics = async () => {
    try {
      // 1. Verificar si el dispositivo tiene hardware biométrico
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        console.log("⚠️ Dispositivo sin hardware biométrico, permitiendo acceso");
        setIsAuthenticated(true);
        setIsBiometricVerified(true);
        setIsLoading(false);
        return true;
      }

      // 2. Verificar si el usuario tiene credenciales biométricas configuradas (enrolamiento)
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        console.log("⚠️ Usuario sin credenciales biométricas configuradas");
        return new Promise((resolve) => {
          Alert.alert(
            "Configuración requerida",
            "No tienes configurada la autenticación biométrica en tu dispositivo. Por favor, configura tu huella digital o Face ID en los ajustes del sistema.",
            [
              {
                text: "Continuar sin biometría",
                onPress: () => {
                  setIsAuthenticated(true);
                  setIsBiometricVerified(true);
                  setIsLoading(false);
                  resolve(true);
                },
              },
            ]
          );
        });
      }

      // 3. Solicitar autenticación biométrica
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentícate para acceder a RitmoFit",
        fallbackLabel: "Usar código",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
      });

      if (result.success) {
        console.log("✅ Autenticación biométrica exitosa");
        setIsAuthenticated(true);
        setIsBiometricVerified(true);
        setIsLoading(false);
        return true;
      } else {
        console.log("❌ Autenticación biométrica fallida");
        return new Promise((resolve) => {
          Alert.alert(
            "Autenticación fallida",
            "No se pudo verificar tu identidad. ¿Deseas intentar nuevamente?",
            [
              { 
                text: "Reintentar", 
                onPress: async () => {
                  const retry = await authenticateWithBiometrics();
                  resolve(retry);
                }
              },
              { 
                text: "Cancelar", 
                style: "cancel",
                onPress: async () => {
                  await logout();
                  setIsLoading(false);
                  resolve(false);
                }
              },
            ]
          );
        });
      }
    } catch (error) {
      console.error("Error en autenticación biométrica:", error);
      return new Promise((resolve) => {
        Alert.alert(
          "Error",
          "Ocurrió un error al intentar autenticar. Permitiendo acceso.",
          [{ 
            text: "OK", 
            onPress: () => {
              setIsAuthenticated(true);
              setIsBiometricVerified(true);
              setIsLoading(false);
              resolve(true);
            }
          }]
        );
      });
    }
  };

  // --- Authentication Functions ---
  
  const login = async (email, password) => {
    try {
      const token = await AuthService.login(email, password);
      await saveToken(token);
      
      // Después del login exitoso, solicitar autenticación biométrica
      const biometricSuccess = await authenticateWithBiometrics();
      
      if (biometricSuccess) {
        setIsAuthenticated(true);
        setIsBiometricVerified(true);
      }
      
      return true;
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    await removeToken();
    setIsAuthenticated(false);
    setIsBiometricVerified(false);
  };

  // 4. The value provided to all children components
  const contextValue = {
    isLoading,
    isAuthenticated,
    isBiometricVerified,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};