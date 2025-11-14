import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "cupos_cursos";

export async function getCupos(courseId) {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : {};

  return parsed[courseId] || null;
}

export async function initCupos(courseId, initialCapacity = 20, initialEnrollment = 0) {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : {};

  if (!parsed[courseId]) {
    parsed[courseId] = {
      capacity: initialCapacity,
      currentEnrollment: initialEnrollment,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }

  return parsed[courseId];
}

export async function incrementarCupo(courseId) {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : {};

  if (!parsed[courseId]) return null;

  parsed[courseId].currentEnrollment++;

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  return parsed[courseId];
}

export async function decrementarCupo(courseId) {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : {};

  if (!parsed[courseId]) return null;

  parsed[courseId].currentEnrollment =
    Math.max(0, parsed[courseId].currentEnrollment - 1);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  return parsed[courseId];
}
