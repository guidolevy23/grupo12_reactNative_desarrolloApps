import { useCallback } from 'react';
import { useAxios } from '../hooks/useAxios';

export function userAuthService(){
  const api = useAxios();
  const loginUser = useCallback(async(username, password) =>{
    try {
      const { data } = await api.post('/auth/login', { username, password });
      console.log(data)
      return data; // { token, ... }

    } catch (e) {
      console.log('Login error:', e.message, e.response?.data);
      throw e
    }
  },[api])

  return { loginUser };
}