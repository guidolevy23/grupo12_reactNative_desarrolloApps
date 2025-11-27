import Api from "../api/axios";

/** 🔧 Utilidad para parsear Spring Data REST */
const parseCourses = (data) => {
  let courses = [];

  if (data._embedded?.courses) {
    courses = data._embedded.courses;
  } else {
    courses = Array.isArray(data) ? data : [];
  }

  return courses.map((course) => {
    let id = course.id;

    if (!id && course._links?.self?.href) {
      const match = course._links.self.href.match(/\/courses\/(\d+)$/);
      id = match ? parseInt(match[1], 10) : null;
    }

    return { ...course, id };
  });
};

/** 🔹 Obtener TODAS las clases */
export const getClassList = async () => {
  const res = await Api.get("/courses");
  return parseCourses(res.data);
};

/** 🔹 Detalle */
export const getClassDetails = async (classId) => {
  const res = await Api.get(`/courses/${classId}?projection=courseWithBranch`);
  return res.data;
};

/** 🔹 Reservar */
export const reserveClass = async (classId, usuarioId) =>
  Api.post("/api/reservas", { usuarioId, courseId: classId });


// ================================================================
// 🔥🔥🔥 FILTROS (igual que Android) 🔥🔥🔥
// ================================================================

/** 🔹 Buscar por sede (branch) */
export const getClassesByBranch = async (branch) => {
  const res = await Api.get("/courses/search/byBranch", {
    params: { branch },
  });
  return parseCourses(res.data);
};

/** 🔹 Buscar por disciplina (name) */
export const getClassesByName = async (name) => {
  const res = await Api.get("/courses/search/byName", {
    params: { name },
  });
  return parseCourses(res.data);
};

/** 🔹 Buscar por fecha (yyyy-MM-dd) */
export const getClassesByDate = async (date) => {
  const start = `${date}T00:00:00`;
  const end = `${date}T23:59:59`;

  const res = await Api.get("/courses/search/byDateBetween", {
    params: { start, end },
  });

  return parseCourses(res.data);
};
