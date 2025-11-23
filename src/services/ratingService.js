import Api from '../api/axios';

/**
 * Servicio para calificar asistencias a clases
 */
const RatingService = {
  /**
   * Calificar una asistencia (clase completada)
   * @param {number} asistenciaId - ID de la asistencia a calificar
   * @param {number} rating - Calificación de 1 a 5 estrellas
   * @param {string} comment - Comentario opcional (máx 500 caracteres)
   * @returns {Promise<Object>} La asistencia actualizada con rating y comment
   */
  calificarAsistencia: async (asistenciaId, rating, comment = '') => {
    try {
      console.log('⭐ Enviando calificación:', { asistenciaId, rating, comment });

      // Validaciones locales antes de enviar
      if (!asistenciaId || asistenciaId <= 0) {
        throw new Error('ID de asistencia inválido');
      }

      if (!rating || rating < 1 || rating > 5) {
        throw new Error('La calificación debe ser entre 1 y 5 estrellas');
      }

      if (comment && comment.length > 500) {
        throw new Error('El comentario no puede superar los 500 caracteres');
      }

      const body = {
        rating: parseInt(rating, 10),
        comment: comment.trim() || null,
      };

      const response = await Api.put(`/historial/${asistenciaId}/calificar`, body);
      console.log('✅ Calificación guardada:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al calificar:', error);
      
      const status = error.response?.status;
      const message = error.response?.data?.message;

      // Manejo de errores del backend
      if (status === 404) {
        throw new Error('Esta clase no existe o fue eliminada');
      }

      if (status === 400) {
        throw new Error(message || 'Datos de calificación inválidos');
      }

      if (status === 403) {
        throw new Error('No tenés permiso para calificar esta clase');
      }

      // Error genérico o de red
      throw new Error(
        error.message || 'No se pudo guardar la calificación. Intentá nuevamente.'
      );
    }
  },
};

export const { calificarAsistencia } = RatingService;
export default RatingService;
