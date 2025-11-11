import Api from '../api/axios';
import { useCallback } from 'react';

export function useProfile() {
  
  const getUserDetail = useCallback(async () => {
    const { data } = await Api.get('/users/me'); // SIN /api
    return data;
  }, [Api]);

  const postChangesUser = useCallback(async()=>{

  },[Api])

  return { getUserDetail };
}