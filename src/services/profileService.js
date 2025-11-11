import { useAxios } from '../hooks/useAxios';
import { useCallback } from 'react';

export function useProfile() {
  const api = useAxios();
  
  const getUserDetail = useCallback(async () => {
    const { data } = await api.get('/users/me'); // SIN /api
    return data;
  }, [api]);

  const postChangesUser = useCallback(async()=>{

  },[api])

  return { getUserDetail };
}