import Api from "../api/axios";

export const getNews = async () => {
  try {
    const res = await Api.get("/api/news");
    return res.data;
  } catch (err) {
    console.log("❌ Error fetching news:", err);
    return [];
  }
};
