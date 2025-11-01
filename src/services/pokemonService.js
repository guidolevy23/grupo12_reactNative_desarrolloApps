import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${API_URL}/pokemon`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPokemonDetails = async (pokemonId) => {
  try {
    const response = await axios.get(`${API_URL}/pokemon/${pokemonId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
