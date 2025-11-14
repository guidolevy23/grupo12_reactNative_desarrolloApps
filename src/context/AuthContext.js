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
import { Alert, Linking, Platform } from 'react-native';
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

      // 2. Obtener los tipos de seguridad disponibles
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log("🔐 Tipos de autenticación soportados:", supportedTypes);

      // 3. Intentar autenticar directamente (esto incluye PIN/patrón automáticamente)
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentícate para acceder a RitmoFit",
        fallbackLabel: "Usar PIN",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false, // Permite usar PIN/patrón como alternativa
      });

      if (result.success) {
        console.log("✅ Autenticación exitosa");
        setIsAuthenticated(true);
        setIsBiometricVerified(true);
        setIsLoading(false);
        return true;
      } else {
        console.log("❌ Autenticación fallida o cancelada");

        // Si el usuario canceló o falló, verificar si tiene algún método configurado
        const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();

        if (securityLevel === LocalAuthentication.SecurityLevel.NONE) {
          // No tiene ningún método de seguridad configurado
          return new Promise((resolve) => {
            Alert.alert(
              "Seguridad Requerida",
              "Para usar RitmoFit, necesitas configurar un método de seguridad en tu dispositivo (huella digital, Face ID, PIN o patrón).\n\n¿Deseas ir a Ajustes ahora?",
              [
                {
                  text: "Cancelar",
                  style: "cancel",
                  onPress: async () => {
                    await logout();
                    setIsLoading(false);
                    resolve(false);
                  },
                },
                {
                  text: "Ir a Ajustes",
                  onPress: async () => {
                    try {
                      if (Platform.OS === 'ios') {
                        await Linking.openURL('App-Prefs:TOUCHID_PASSCODE');
                      } else {
                        await Linking.sendIntent('android.settings.SECURITY_SETTINGS');
                      }
                    } catch (error) {
                      await Linking.openSettings();
                    }

                    setTimeout(() => {
                      Alert.alert(
                        "¿Configuraste la seguridad?",
                        "Una vez que hayas configurado tu método de seguridad, presiona Reintentar.",
                        [
                          {
                            text: "Cerrar sesión",
                            style: "cancel",
                            onPress: async () => {
                              await logout();
                              setIsLoading(false);
                              resolve(false);
                            },
                          },
                          {
                            text: "Reintentar",
                            onPress: async () => {
                              const retry = await authenticateWithBiometrics();
                              resolve(retry);
                            },
                          },
                        ]
                      );
                    }, 1000);
                  },
                },
              ]
            );
          });
        } else {
          // Tiene seguridad configurada pero canceló o falló
          return new Promise((resolve) => {
            Alert.alert(
              "Autenticación requerida",
              "Necesitas autenticarte para continuar.",
              [
                {
                  text: "Reintentar",
                  onPress: async () => {
                    const retry = await authenticateWithBiometrics();
                    resolve(retry);
                  }
                },
                {
                  text: "Cerrar sesión",
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
      }
    } catch (error) {
      console.error("Error en autenticación:", error);
      setIsAuthenticated(true);
      setIsBiometricVerified(true);
      setIsLoading(false);
      return true;
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