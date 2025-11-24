import Api from "../api/axios";

// 📋 Obtener reservas del usuario
export async function getReservasUsuario(usuarioId) {
  const { data } = await Api.get(`/reservations/search/byUser?userId=${usuarioId}`);
  console.log(data._embedded.reservas)
  return data._embedded.reservas;
}

export async function cancelarReserva(reservaId) {
  try {
    console.log(reservaId)
    await Api.delete(`/reservas/${reservaId}`);
  } catch (error) {
    const status = error.response?.status;
    const msg = error.response?.data?.message;

    if (status === 404) {
      throw new Error("Esta reserva ya no existe.");
    }

    if (status === 409) {
      throw new Error("Esta reserva ya había sido cancelada.");
    }

    if (status === 403) {
      throw new Error("No tenés permiso para cancelar esta reserva.");
    }

    throw new Error("No se pudo cancelar la reserva. Intentá nuevamente.");
  }
}


// 🆕 Crear reserva CON MANEJO DE ERRORES
export async function crearReserva(usuarioId, courseId) {
  try {
    const body = { usuarioId, courseId };
    const { data } = await Api.post("/reservas", body);
    return data;
  } catch (error) {
    const status = error.response?.status;
    const msg = error.response?.data?.message;

    // 🟥 Usuario ya tiene reserva
    if (status === 409) {
      throw new Error("Ya estás reservado en esta clase.");
    }

    // 🟧 Cupo lleno
    if (status === 400 && msg?.includes("cupo")) {
      throw new Error("No hay cupos disponibles para esta clase.");
    }

    // 🟨 Cualquier validación del negocio
    if (status === 400 && msg) {
      throw new Error(msg);
    }

    // 🟦 Errores desconocidos
    throw new Error("No se pudo completar la reserva. Intentá de nuevo.");
  }
}

