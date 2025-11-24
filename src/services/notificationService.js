import Api from '../api/axios';

const NotificationService = {

  getAll: async () => {
    try {
      const response = await Api.get('/notifications');
      return response.data;
    } catch (error) {
      let msg = `Error al traer las notificaciones: ${error.response?.data?.message }`
      throw new Error(msg);
    }
  },
  markRead: async (id) => {
    try {
      await Api.put(`/notifications/${id}/read`);
    } catch (error) {
      let msg = `Error al marcar leida la notification: ${error.response?.data?.message}`
      throw new Error(msg);
    }
  },
}

export default NotificationService;