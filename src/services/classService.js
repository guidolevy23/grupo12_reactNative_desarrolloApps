import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getClassList = async () => {
  try {
    const response = await api.get('/api/courses');
    
    // Spring Data REST devuelve: { _embedded: { courses: [...] } }
    if (response.data._embedded && response.data._embedded.courses) {
      return response.data._embedded.courses;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener lista de cursos:', error);
    throw error;
  }
};

export const getClassDetails = async (classId) => {
  try {
    const response = await api.get(`/api/courses/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles del curso:', error);
    throw error;
  }
};

export const reserveClass = async (classId) => {
  try {
    const response = await api.post('/api/reservations', { courseId: classId });
    return response.data;
  } catch (error) {
    console.error('Error al reservar clase:', error);
    throw error;
  }
};
