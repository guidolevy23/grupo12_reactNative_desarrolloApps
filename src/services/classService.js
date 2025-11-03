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
    console.log('🔗 Haciendo GET a: /api/courses');
    const response = await api.get('/api/courses');
    console.log('✅ Lista response status:', response.status);
    console.log('✅ Lista response data:', response.data);
    
    // Spring Data REST devuelve: { _embedded: { courses: [...] } }
    let courses = [];
    if (response.data._embedded && response.data._embedded.courses) {
      console.log('📦 Procesando cursos desde _embedded');
      courses = response.data._embedded.courses;
    } else {
      console.log('📦 Procesando data directamente');
      courses = response.data;
    }
    
    // Extraer ID de la URL de _links.self.href
    // Spring Data REST: href = "http://192.168.0.12:8080/api/courses/1"
    const coursesWithId = courses.map(course => {
      let id = course.id; // Por si acaso ya tiene id
      
      if (!id && course._links?.self?.href) {
        // Extraer el ID de la URL: .../courses/1 -> 1
        const match = course._links.self.href.match(/\/courses\/(\d+)$/);
        if (match) {
          id = parseInt(match[1], 10);
        }
      }
      
      return { ...course, id };
    });
    
    console.log('📦 Cursos con IDs:', coursesWithId);
    return coursesWithId;
  } catch (error) {
    console.error('❌ Error al obtener lista de cursos:', error);
    console.error('❌ Error response:', error.response?.data);
    throw error;
  }
};

export const getClassDetails = async (classId) => {
  try {
    const response = await api.get(`/api/courses/${classId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener detalles del curso:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
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
