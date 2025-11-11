import { createContext, useEffect, useState, useMemo } from 'react';
import { saveToken, getToken, removeToken } from '../utils/tokenStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, []);

  const login = async (jwt) => {
    setToken(jwt);
    await saveToken(jwt);
  };

  const logout = async (jwt) => {
    setToken(null);
    await removeToken(jwt);
  };

  const value = useMemo(() => ({ token, login, logout }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
