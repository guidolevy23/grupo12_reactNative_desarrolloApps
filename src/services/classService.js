import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear instancia de axios
const api = axios.create({ 
  baseURL: 'http://192.168.0.12:8080' 
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error al obtener token:', error);
  }
  return config;
});

export const getClassList = async () => {
  try {
    // Spring Data REST endpoint
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

export const reserveClass = async (classId, usuarioId) => {
  try {
    // Tu backend espera: { usuario: { id }, course: { id } }
    const response = await api.post('/api/reservas', { 
      usuario: { id: usuarioId },
      course: { id: classId }  // classId del frontend = course.id del backend
    });
    return response.data;
  } catch (error) {
    console.error('Error al reservar clase:', error);
    throw error;
  }
};
