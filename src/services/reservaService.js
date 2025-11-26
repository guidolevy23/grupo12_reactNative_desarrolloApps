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
    await Api.delete(`/api/reservas/${reservaId}`);
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
    // ✅ Backend custom controller expects simple format
    const body = { usuarioId, courseId };

    console.log("📤 Enviando reserva con body:", JSON.stringify(body, null, 2));

    const { data } = await Api.post("/api/reservas", body);

    console.log("✅ Reserva creada exitosamente:", data);
    return data;
  } catch (error) {
    const status = error.response?.status;
    const msg = error.response?.data?.message;

    console.error("❌ Error al crear reserva:", {
      status,
      message: msg,
      fullError: error.response?.data
    });

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

// 📱 Check-in con código QR
export async function checkInWithQR(reservaId, qrData) {
  try {
    console.log("🔄 Realizando check-in con QR:", { reservaId, qrData });

    // The QR data might contain the course/class ID or a unique check-in code
    // Adjust the endpoint according to your backend implementation
    const body = {
      reservaId,
      qrCode: qrData,
    };

    const { data } = await Api.post("/api/reservas/check-in", body);

    console.log("✅ Check-in exitoso:", data);
    return data;
  } catch (error) {
    const status = error.response?.status;
    const msg = error.response?.data?.message;

    console.error("❌ Error en check-in:", error.response?.data || error.message);

    // 🟥 QR inválido o expirado
    if (status === 400) {
      throw new Error(msg || "El código QR no es válido o ha expirado.");
    }

    // 🟧 Reserva no encontrada
    if (status === 404) {
      throw new Error("No se encontró la reserva.");
    }

    // 🟨 Check-in ya realizado
    if (status === 409) {
      throw new Error("Ya realizaste el check-in para esta clase.");
    }

    // 🟪 Clase no disponible para check-in aún
    if (status === 403) {
      throw new Error(msg || "La clase aún no está disponible para check-in.");
    }

    // 🟦 Errores desconocidos
    throw new Error(msg || "No se pudo completar el check-in. Intentá de nuevo.");
  }
}
