import axios from "axios";

const API_URL = "http://192.168.0.146:8080/api/auth";

const authService = {
  sendOtp: async (email) => {
    try {
      console.log("Enviando OTP a:", email);
      const response = await axios.post(`${API_URL}/otp/request`, { email });
      return response.data;
    } catch (error) {
      console.error("Error en sendOtp:", error);
      throw error;
    }
  },

validateOtp: async (email, otp) => {
  try {
    console.log("Validando OTP:", otp, "para:", email);
    const response = await axios.post(`${API_URL}/otp/validate`, { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error en validateOtp:", error.message);

    if (error.response) {
      console.log("📩 Respuesta del backend:");
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else if (error.request) {
      console.log("📡 No hubo respuesta del servidor. Request:", error.request);
    } else {
      console.log("❌ Error al configurar la solicitud:", error.message);
    }

    throw error;
  }
},
}

export default authService;
