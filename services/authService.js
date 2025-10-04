import axios from "axios";

// ⚠️ Usá tu IP local en vez de localhost si vas a abrir desde Expo Web o Expo Go en celular.
// Para verla: en Windows corré `ipconfig` y buscá tu IPv4 (ej: 192.168.0.146).
const API_URL = "exp://127.0.0.1:8081/otp"; 

// 👉 Envía un OTP al email
const sendOtp = async (email) => {
  const res = await axios.post(`${API_URL}/request`, { email });
  return res.data; // debería devolver "OTP sent to <email>"
};

// 👉 Valida un OTP
const verifyOtp = async (email, otp) => {
  const res = await axios.post(`${API_URL}/validate`, { email, otp });
  return res.data; 
  // tu backend devuelve ResultDto: { status: "OK"/"ERROR", message: "..." }
};

export default { sendOtp, verifyOtp };
