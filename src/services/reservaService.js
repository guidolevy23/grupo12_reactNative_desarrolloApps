import Api from "../api/axios";

// 📋 Obtener reservas del usuario
export async function getReservasUsuario(usuarioId) {
  const { data } = await Api.get(`/api/reservas/usuario/${usuarioId}`);
  return data;
}

// 🗑️ Cancelar reserva
export async function cancelarReserva(reservaId) {
  await Api.delete(`/api/reservas/${reservaId}`);
}

// 🆕 Crear reserva
export async function crearReserva(usuarioId, courseId) {
  const body = { usuarioId, courseId };
  const { data } = await Api.post("/api/reservas", body);
  return data;
}
