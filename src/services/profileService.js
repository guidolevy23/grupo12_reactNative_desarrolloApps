import Api from '../api/axios';
import { useCallback } from 'react';

export function useProfile() {

  const getUserDetail = useCallback(async () => {
    try {
      const { data } = await Api.get('/users/me');
      console.log("✅ Usuario recibido:", data);
      return data;
    } catch (err) {
      console.error("❌ Error al obtener /users/me:", err.response?.data || err.message);
      throw err; // volvemos a lanzar para que se capture arriba
    }
  }, []);

  return { getUserDetail };
}
