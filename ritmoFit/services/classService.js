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

// Desanidar respuesta HAL de Spring Data REST
function unwrapCourses(resp) {
  const embedded = resp?.data?._embedded;
  return embedded?.courses ?? [];
}

const classService = {
  /**
   * Filtros soportados por el back:
   * - sede -> /courses/search/byBranch?branch=
   * - fecha -> /courses/search/byDateBetween?start=...&end=...
   * (disciplina no existe en repo; se filtra en cliente si viene)
   */
  getClasses: async (filters = {}) => {
    const { sede, disciplina, fecha, page = 0, size = 10 } = filters;

    let data = [];
    if (sede && fecha) {
      // 1) Traigo por sede (branch)
      const r1 = await api.get("/courses/search/byBranch", {
        params: { branch: sede, page, size },
      });
      let list = unwrapCourses(r1);

      // 2) Si hay fecha, filtro en cliente (no hay endpoint combinado)
      if (fecha) {
        const start = new Date(`${fecha}T00:00:00`);
        const end = new Date(`${fecha}T23:59:59`);
        list = list.filter((c) => {
          const startsAt = c?.startsAt ? new Date(c.startsAt) : null;
          return startsAt && startsAt >= start && startsAt <= end;
        });
      }

      data = list;
    } else if (sede) {
      const r = await api.get("/courses/search/byBranch", {
        params: { branch: sede, page, size },
      });
      data = unwrapCourses(r);
    } else if (fecha) {
      // LocalDateTime (ISO) esperado por tu repo
      const start = `${fecha}T00:00:00`;
      const end = `${fecha}T23:59:59`;
      const r = await api.get("/courses/search/byDateBetween", {
        params: { start, end, page, size },
      });
      data = unwrapCourses(r);
    } else {
      // listado general paginado
      const r = await api.get("/courses", { params: { page, size } });
      data = unwrapCourses(r);
    }

    // Filtrado por disciplina en cliente (no hay endpoint dedicado)
    if (disciplina) {
      data = data.filter(
        (c) =>
          c?.disciplina?.nombre &&
          c.disciplina.nombre.toLowerCase() === disciplina.toLowerCase()
      );
    }

    return data;
  },

  getClassById: async (classId) => {
    const { data } = await api.get(`/courses/${classId}`);
    return data;
  },

  // No existen /sedes ni /disciplines en el back: los armo desde courses.
  getSedes: async () => {
    const r = await api.get("/courses", { params: { page: 0, size: 200 } });
    const list = unwrapCourses(r);
    const set = new Set(list.map((c) => (c?.branch || "").trim()).filter(Boolean));
    return Array.from(set).sort();
  },

  getDisciplines: async () => {
    const r = await api.get("/courses", { params: { page: 0, size: 200 } });
    const list = unwrapCourses(r);
    const set = new Set(
      list
        .map((c) => (c?.disciplina?.nombre || "").trim())
        .filter(Boolean)
    );
    return Array.from(set).sort();
  },
};

export default classService;
