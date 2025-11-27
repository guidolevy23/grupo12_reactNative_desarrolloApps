import Api from '../api/axios'


export async function getNews() {
  const response = await Api.get("/news"); // ✔ SIN /api
  return response.data;
}
