import { useCallback } from 'react';
import Api from '../api/axios';

export function userAuthService(){
  
  const loginUser = useCallback(async(username, password) =>{
    try {
      const { data } = await Api.post('/auth/login', { username, password });
      console.log(data)
      return data;

    } catch (e) {
      console.log('Login error:', e.message, e.response?.data);
      throw e
    }
  },[Api])

  return { loginUser };
}