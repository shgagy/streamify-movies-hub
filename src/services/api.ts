
import axios from 'axios';

// Create an axios instance with base URL
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movies API
export const fetchAllMovies = async () => {
  const response = await api.get('/movies');
  return response.data;
};

export const fetchMovieById = async (id: string) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const fetchMoviesByGenre = async (genreId: string) => {
  const response = await api.get(`/movies/genre/${genreId}`);
  return response.data;
};

export const fetchTrendingMovies = async () => {
  const response = await api.get('/movies/trending');
  return response.data;
};

export const fetchPopularMovies = async () => {
  const response = await api.get('/movies/popular');
  return response.data;
};

export const searchMovies = async (query: string) => {
  const response = await api.get(`/movies/search?q=${query}`);
  return response.data;
};

// Genres API
export const fetchAllGenres = async () => {
  const response = await api.get('/genres');
  return response.data;
};

export default api;
