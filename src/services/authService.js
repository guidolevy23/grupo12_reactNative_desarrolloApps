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
      let message = 'UNEXPECTED_ERROR';
      if (error.response.status == 422) {
        message = 'USER_NOT_VALID';
      } else {
        message = error.response?.data?.message || 'UNEXPECTED_ERROR';
      }
      throw new Error(message);
    }
  },
  register: async (name, username, password) => {
    try {
      await Api.post('/auth/register', { name, username, password });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error sistematico');
    }
  },
  requestOtp: async (email) => {
    try {
      await Api.post('/auth/otp/request', { email });
    } catch (error) {
      console.error("OTP requesting failed:", error.request);
      throw new Error(error.response?.data?.message || 'Error sistematico');
    }
  },
  validateOtp: async (email, otp) => {
    try {
      await Api.post('/auth/otp/validate', { email, otp });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error sistematico');
    }
  },
}

export default AuthService;