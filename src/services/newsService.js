import Api from '../api/axios'


export async function getNews() {
  try {
    const response = await Api.get("/news");
    const data = response.data;

    // 🔥 Convertir automáticamente imágenes para Android Emulator
    const processed = data.map((item) => ({
      ...item,
      imagenUrl: item.imagenUrl.replace("localhost", "10.0.2.2"),
    }));

    return processed;

  } catch (error) {
    console.error("❌ Error cargando noticias:", error);
    throw error;
  }
}

