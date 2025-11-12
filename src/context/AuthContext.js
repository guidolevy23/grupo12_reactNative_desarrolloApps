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
import AuthService from '../services/authService'; 
import { getToken, removeToken, saveToken } from '../utils/tokenStorage';

// 1. Create the Context object
export const AuthContext = createContext(null);

// 3. The Provider component that manages state and logic
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const token = await getToken();
      if (token) {
        setIsAuthenticated(true)
      }
      setIsLoading(false);
    };
    loadSession();
  }, []);

  // --- Authentication Functions ---
  
  const login = async (email, password) => {
    try {
      const token = await AuthService.login(email, password);
      saveToken(token);
      setIsAuthenticated(true)
      return true;
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    await removeToken()
    setIsAuthenticated(false)
  };

  // 4. The value provided to all children components
  const contextValue = {
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};