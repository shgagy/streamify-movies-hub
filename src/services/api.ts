
import axios from 'axios';
import { 
  movies, 
  genres, 
  getMovieById, 
  getMoviesByGenre, 
  searchMovies as searchMoviesHelper,
  getFeaturedMovies
} from '@/lib/mockData';

// Create an axios instance with base URL
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to determine if we should use mock data or real API
const USE_MOCK_DATA = true;

// Movies API
export const fetchAllMovies = async () => {
  if (USE_MOCK_DATA) {
    return movies;
  }
  const response = await api.get('/movies');
  return response.data;
};

export const fetchMovieById = async (id: string) => {
  if (USE_MOCK_DATA) {
    const movie = getMovieById(id);
    if (!movie) {
      throw new Error('Movie not found');
    }
    return movie;
  }
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const fetchMoviesByGenre = async (genreId: string) => {
  if (USE_MOCK_DATA) {
    return getMoviesByGenre(genreId);
  }
  const response = await api.get(`/movies/genre/${genreId}`);
  return response.data;
};

export const fetchTrendingMovies = async () => {
  if (USE_MOCK_DATA) {
    // For mock data, we'll consider featured movies as trending
    return getFeaturedMovies();
  }
  const response = await api.get('/movies/trending');
  return response.data;
};

export const fetchPopularMovies = async () => {
  if (USE_MOCK_DATA) {
    // For mock data, simulate popular movies by taking highest rated ones
    return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }
  const response = await api.get('/movies/popular');
  return response.data;
};

export const searchMovies = async (query: string) => {
  if (USE_MOCK_DATA) {
    return searchMoviesHelper(query);
  }
  const response = await api.get(`/movies/search?q=${query}`);
  return response.data;
};

// Genres API
export const fetchAllGenres = async () => {
  if (USE_MOCK_DATA) {
    return genres;
  }
  const response = await api.get('/genres');
  return response.data;
};

export default api;
