import * as SecureStore from 'expo-secure-store';


export const saveToken = async (token) => {
  await SecureStore.setItemAsync('jwt', token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('jwt');
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync('jwt');
};


