import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getClassList = async () => {
  try {
    const response = await axios.get(`${API_URL}/classes`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener lista de clases:', error);
    throw error;
  }
};

export const getClassDetails = async (classId) => {
  try {
    const response = await axios.get(`${API_URL}/classes/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles de la clase:', error);
    throw error;
  }
};

export const reserveClass = async (classId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/reservations`, 
      { classId },
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al reservar clase:', error);
    throw error;
  }
};
