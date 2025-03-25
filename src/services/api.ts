
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

// Movies API
export const fetchAllMovies = async () => {
  return movies;
};

export const fetchMovieById = async (id: string) => {
  const movie = getMovieById(id);
  if (!movie) {
    throw new Error('Movie not found');
  }
  return movie;
};

export const fetchMoviesByGenre = async (genreId: string) => {
  return getMoviesByGenre(genreId);
};

export const fetchTrendingMovies = async () => {
  return getFeaturedMovies();
};

export const fetchPopularMovies = async () => {
  return [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5);
};

export const searchMovies = async (query: string) => {
  return searchMoviesHelper(query);
};

// TV Shows API
export const fetchAllTVShows = async () => {
  return tvShows;
};

export const fetchTVShowById = async (id: string) => {
  const show = getTVShowById(id);
  if (!show) {
    throw new Error('TV Show not found');
  }
  return show;
};

export const fetchTVShowsByGenre = async (genreId: string) => {
  return getTVShowsByGenre(genreId);
};

export const fetchTrendingTVShows = async () => {
  return getFeaturedTVShows();
};

export const fetchPopularTVShows = async () => {
  return [...tvShows].sort((a, b) => b.rating - a.rating).slice(0, 5);
};

export const searchTVShows = async (query: string) => {
  return searchTVShowsHelper(query);
};

// Genres API
export const fetchAllGenres = async () => {
  return genres;
};
