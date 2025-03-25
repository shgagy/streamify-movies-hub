
import axios from 'axios';
import { 
  movies, 
  tvShows,
  genres, 
  getMovieById, 
  getTVShowById,
  getMoviesByGenre, 
  getTVShowsByGenre,
  searchMovies as searchMoviesHelper,
  searchTVShows as searchTVShowsHelper,
  getFeaturedMovies,
  getFeaturedTVShows
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

// TV Shows API
export const fetchAllTVShows = async () => {
  if (USE_MOCK_DATA) {
    return tvShows;
  }
  const response = await api.get('/tv-shows');
  return response.data;
};

export const fetchTVShowById = async (id: string) => {
  if (USE_MOCK_DATA) {
    const show = getTVShowById(id);
    if (!show) {
      throw new Error('TV Show not found');
    }
    return show;
  }
  const response = await api.get(`/tv-shows/${id}`);
  return response.data;
};

export const fetchTVShowsByGenre = async (genreId: string) => {
  if (USE_MOCK_DATA) {
    return getTVShowsByGenre(genreId);
  }
  const response = await api.get(`/tv-shows/genre/${genreId}`);
  return response.data;
};

export const fetchTrendingTVShows = async () => {
  if (USE_MOCK_DATA) {
    // For mock data, we'll consider featured TV shows as trending
    return getFeaturedTVShows();
  }
  const response = await api.get('/tv-shows/trending');
  return response.data;
};

export const fetchPopularTVShows = async () => {
  if (USE_MOCK_DATA) {
    // For mock data, simulate popular TV shows by taking highest rated ones
    return [...tvShows].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }
  const response = await api.get('/tv-shows/popular');
  return response.data;
};

export const searchTVShows = async (query: string) => {
  if (USE_MOCK_DATA) {
    return searchTVShowsHelper(query);
  }
  const response = await api.get(`/tv-shows/search?q=${query}`);
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
