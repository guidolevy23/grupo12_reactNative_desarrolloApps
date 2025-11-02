import axios from 'axios';
import { useAxios } from '../hooks/useAxios';

export const loginUser = async (username, password) => {
  const api = useAxios();
  try {
    const response = await api.post("/api/auth/login", { username, password })
    return response.data
  } catch (error) {
    throw error;
  }
}