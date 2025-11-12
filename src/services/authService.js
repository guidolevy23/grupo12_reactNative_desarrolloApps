import Api from '../api/axios';

const AuthService = {

  /**
   * Logs a user into the application.
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} A promise that resolves to user data (or token).
   */
  login: async (username, password) => {
    try {
      const response = await Api.post('/auth/login', {
        username,
        password,
      });

      const { token } = response.data;
      return token;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.message || 'Error sistematico');
    }
  },
  register: async (name, username, password) => {
    try {
      await Api.post('/auth/register', { name, username, password });
    } catch (error) {
      console.error("Register failed:", error);
      throw new Error(error.response?.data?.message || 'Error sistematico');
    }
  },
}

export default AuthService;