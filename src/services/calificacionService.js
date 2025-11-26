import Api from '../api/axios';

const submitRating = async (asistenciaId, estrellas, comentario = null) => {
  const body = {
    asistenciaId: Number(asistenciaId),
    estrellas: Number(estrellas),
    comentario: comentario ? String(comentario).trim() : null,
  };

  try {
    const resp = await Api.post('/calificaciones', body);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const getMyRatings = async () => {
  const resp = await Api.get('/calificaciones/me');
  return resp.data;
};

export default { submitRating, getMyRatings };
