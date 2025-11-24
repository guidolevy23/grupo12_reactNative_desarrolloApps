import Api from '../api/axios';

const HistoryService = {
  /**
   * Get current user info to obtain userId
   * @returns {Promise<Object>} User data with id
   */
  getCurrentUser: async () => {
    try {
      console.log('👤 Attempting to get current user from /users/me');
      const response = await Api.get('/users/me');
      console.log('✅ Current user response:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch current user:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
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
        // Intentar obtener el usuario actual desde /api/users/me
        const user = await HistoryService.getCurrentUser();
        console.log('👤 Current user:', user);
        usuarioId = user.id || user.idUsuario;
        console.log('✅ UserId from /users/me:', usuarioId);
      } catch (userError) {
        console.warn('⚠️ Could not get user from /users/me, trying to decode JWT...');
        console.error('getUserError:', userError.message);
        
        // Si falla /users/me, intentar decodificar el JWT
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
          
          // IMPORTANTE: El backend JWT tiene 'sub' con el email, no el ID
          // Necesitamos usar el endpoint /users/me, pero si falla, usar hardcoded para admin
          if (payload.sub === 'admin@root.com') {
            usuarioId = 1; // Usuario admin tiene ID 1
            console.log('✅ Using hardcoded userId for admin: 1');
          } else {
            // Para otros usuarios, intentar extraer del token
            usuarioId = payload.userId || payload.id;
            if (!usuarioId) {
              console.error('❌ Could not extract userId from JWT:', payload);
              throw new Error('No se pudo obtener el ID de usuario. El token solo contiene el email.');
            }
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
      console.log(`📍 Full URL: ${Api.defaults.baseURL}/historial/${usuarioId}`);
      const response = await Api.get(`/historial/${usuarioId}`);
      console.log('✅ Complete history response:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch attendance history:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error config:", error.config?.url);
      
      // Mensajes más descriptivos según el tipo de error
      if (error.response?.status === 404) {
        throw new Error('Endpoint de historial no encontrado. Verificá que el backend esté corriendo.');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('No tenés autorización. Iniciá sesión nuevamente.');
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Timeout: El servidor no responde. Verificá tu conexión.');
      } else if (error.message.includes('Network Error') || !error.response) {
        throw new Error('No se puede conectar al servidor. Verificá que el backend esté corriendo en http://10.0.2.2:8080');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Error al cargar el historial');
    }
  },
};

export const getAttendanceHistory = HistoryService.getAttendanceHistory;

export default HistoryService;
