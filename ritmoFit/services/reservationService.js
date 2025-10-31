import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../app/home/utils/api";

const api = axios.create({
  baseURL: BASE_URL, // /api
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    console.log("❌ Error leyendo token:", e);
  }
  return config;
});

async function getMyUserId() {
  const { data } = await api.get("/users/me");
  return data?.id;
}

const reservationService = {
  /**
   * Back real:
   *  - GET /reservas/usuario/{usuarioId}
   *  Opcionalmente filtro por status en cliente si llega.
   */
  getMyReservations: async (status = null) => {
    const usuarioId = await getMyUserId();
    const { data } = await api.get(`/reservas/usuario/${usuarioId}`);
    if (!status) return data;
    return data.filter((r) => (r?.estado || "").toLowerCase() === status.toLowerCase());
  },

  /**
   * Back real:
   *  - POST /reservas  (ReservaCreateRequestDTO -> Reserva)
   * Tu front antes mandaba { classId }. Mapeo a { courseId, usuarioId }.
   * Si tu DTO tiene otros campos, agregalos acá.
   */
  createReservation: async (classId) => {
    const usuarioId = await getMyUserId();
    const body = { courseId: classId, usuarioId }; // <- alinea con tu service
    const { data } = await api.post("/reservas", body);
    return data;
  },

  // DELETE /reservas/{id}
  cancelReservation: async (reservationId) => {
    const { data } = await api.delete(`/reservas/${reservationId}`);
    return data;
  },

  /**
   * Tu back NO tiene GET /reservas/{id}. Lo emulo buscando en “mis reservas”.
   */
  getReservationById: async (reservationId) => {
    const all = await reservationService.getMyReservations();
    return all.find((r) => String(r.id) === String(reservationId)) || null;
  },
};

export default reservationService;
