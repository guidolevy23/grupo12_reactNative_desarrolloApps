import Api from '../api/axios';
import { useCallback } from 'react';

export function useProfile() {
  
  const getUserDetail = useCallback(async () => {
    const { data } = await Api.get('/users/me'); // SIN /api
    return data;
  }, [Api]);

  const postChangesUser = useCallback(async(usuario)=>{
    const {id, name, telefono, direccion, photoUrl, password, role, email} = usuario;
    const {data} = await Api.put(`/users/${id}`, {id, name, telefono, direccion, photoUrl, password, role, email, validated: true})
    console.log(data)
  },[Api])

  return { getUserDetail, postChangesUser};
}