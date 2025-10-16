import api from "./authService";

const userService = {
  getCurrentUser: async () => {
    const res = await api.get("/users/me");
    return res.data;
  },
};

export default userService;
