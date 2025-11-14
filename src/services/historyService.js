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
      console.error("Failed to fetch current user:", error);
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
      console.log('🔍 Getting current user...');
      
      let usuarioId;
      try {
        // Intentar obtener el usuario actual
        const user = await HistoryService.getCurrentUser();
        console.log('👤 Current user:', user);
        usuarioId = user.id;
      } catch (userError) {
        console.warn('⚠️ Could not get user from /users/me, trying to decode JWT...');
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
          console.log('🔓 JWT payload:', payload);
          
          // El backend puede usar 'sub', 'userId', 'id', etc.
          usuarioId = payload.userId || payload.id || payload.sub;
          
          if (!usuarioId) {
            console.error('❌ Could not extract userId from JWT:', payload);
            throw new Error('No se pudo obtener el ID de usuario');
          }
          
          console.log('✅ Extracted userId from JWT:', usuarioId);
        } else {
          throw new Error('No hay token de autenticación');
        }
      }

      // Si hay filtros de fecha, usar el endpoint de filtrado
      if (startDate || endDate) {
        console.log('📅 Fetching filtered history:', { usuarioId, startDate, endDate });
        const response = await Api.post('/historial/filtrar', {
          usuarioId,
          fechaInicio: startDate,
          fechaFin: endDate,
        });
        console.log('✅ Filtered history response:', response.data);
        return response.data;
      }

      // Si no hay filtros, obtener historial completo
      console.log(`📋 Fetching complete history for user ${usuarioId}`);
      const response = await Api.get(`/historial/${usuarioId}`);
      console.log('✅ Complete history response:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch attendance history:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw new Error(error.response?.data?.message || error.message || 'Error al cargar el historial');
    }
  },
};

export const getAttendanceHistory = HistoryService.getAttendanceHistory;

export default HistoryService;
