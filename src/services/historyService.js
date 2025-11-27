import Api from '../api/axios';

const HistoryService = {
  /**
   * Get current user info to obtain userId
   * @returns {Promise<Object>} User data with id
   */
  getCurrentUser: async () => {
    try {
      const response = await Api.get('/users/me');
      return response.data;
    } catch (error) {
      // failed to fetch current user
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  },

  /**
   * Get attendance history for the current user
   * @param {string} startDate - Optional start date filter (ISO format)
   * @param {string} endDate - Optional end date filter (ISO format)
   * @returns {Promise<Array>} A promise that resolves to attendance history array
   */
  getAttendanceHistory: async (startDate = null, endDate = null) => {
    try {
      
      
      let usuarioId;
      try {
        // Intentar obtener el usuario actual
        const user = await HistoryService.getCurrentUser();
        usuarioId = user.id;
      } catch (userError) {
        // Could not get user from /users/me, trying to decode JWT...
        // Si falla, intentar decodificar el JWT para obtener el userId
        const { getToken } = require('../utils/tokenStorage');
        const token = await getToken();
        
        if (token) {
          // Decodificar JWT (simple, sin verificar firma)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const payload = JSON.parse(jsonPayload);
          // No logueamos el token completo, solo indicamos si existe
          
          
          // Preferir campos numéricos conocidos
          usuarioId = payload.userId || payload.id;

          // Si no hay userId/id, NO usar 'sub' cuando contiene email
          if (!usuarioId) {
            const sub = payload.sub;
            if (sub && /^\d+$/.test(String(sub))) {
              usuarioId = Number(sub);
            } else {
              console.error('❌ JWT does not contain numeric user id (sub looks like email).');
              throw new Error('El token no contiene el ID numérico del usuario. Verificá el endpoint /users/me en el backend.');
            }
          }

          
        } else {
          throw new Error('No hay token de autenticación');
        }
      }

      // Si hay filtros de fecha, usar el endpoint de filtrado
      if (startDate || endDate) {
        
        const response = await Api.post('/historial/filtrar', {
          usuarioId,
          fechaInicio: startDate,
          fechaFin: endDate,
        });
        
        return response.data;
      }

      // Si no hay filtros, obtener historial completo
      const response = await Api.get(`/historial/${usuarioId}`);
      return response.data;
    } catch (error) {
      // failed to fetch attendance history
      throw new Error(error.response?.data?.message || error.message || 'Error al cargar el historial');
    }
  },
};

export const getAttendanceHistory = HistoryService.getAttendanceHistory;

export default HistoryService;
