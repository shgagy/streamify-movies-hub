
import { movieService } from './mongodb/services/movieService';
import { tvShowService } from './mongodb/services/tvShowService';
import { userService } from './mongodb/services/userService';
import { userListService } from './mongodb/services/userListService';
import { genres } from '@/lib/mockData';
import { mapMovieDocument, mapMovieDocuments, mapTVShowDocument, mapTVShowDocuments } from './mongodb/utils/documentMappers';

// Movies API
export const fetchAllMovies = async () => {
  try {
    const movies = await movieService.getAllMovies();
    return mapMovieDocuments(movies);
  } catch (error) {
    console.error('Error fetching all movies:', error);
    throw error;
  }
};

export const fetchMovieById = async (id: string) => {
  try {
    const movie = await movieService.getMovieById(id);
    if (!movie) {
      throw new Error('Movie not found');
    }
    return mapMovieDocument(movie);
  } catch (error) {
    console.error(`Error fetching movie with id ${id}:`, error);
    throw error;
  }
};

export const fetchMoviesByGenre = async (genreId: string) => {
  try {
    const movies = await movieService.getMoviesByGenre(genreId);
    return mapMovieDocuments(movies);
  } catch (error) {
    console.error(`Error fetching movies by genre ${genreId}:`, error);
    throw error;
  }
};

export const fetchTrendingMovies = async () => {
  try {
    const movies = await movieService.getTrendingMovies();
    return mapMovieDocuments(movies);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const fetchPopularMovies = async () => {
  try {
    const movies = await movieService.getPopularMovies();
    return mapMovieDocuments(movies);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string) => {
  try {
    const movies = await movieService.searchMovies(query);
    return mapMovieDocuments(movies);
  } catch (error) {
    console.error(`Error searching movies with query "${query}":`, error);
    throw error;
  }
};

// TV Shows API
export const fetchAllTVShows = async () => {
  try {
    const tvShows = await tvShowService.getAllTVShows();
    return mapTVShowDocuments(tvShows);
  } catch (error) {
    console.error('Error fetching all TV shows:', error);
    throw error;
  }
};

export const fetchTVShowById = async (id: string) => {
  try {
    const tvShow = await tvShowService.getTVShowById(id);
    if (!tvShow) {
      throw new Error('TV Show not found');
    }
    return mapTVShowDocument(tvShow);
  } catch (error) {
    console.error(`Error fetching TV show with id ${id}:`, error);
    throw error;
  }
};

export const fetchTVShowsByGenre = async (genreId: string) => {
  try {
    const tvShows = await tvShowService.getTVShowsByGenre(genreId);
    return mapTVShowDocuments(tvShows);
  } catch (error) {
    console.error(`Error fetching TV shows by genre ${genreId}:`, error);
    throw error;
  }
};

export const fetchTrendingTVShows = async () => {
  try {
    const tvShows = await tvShowService.getTrendingTVShows();
    return mapTVShowDocuments(tvShows);
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    throw error;
  }
};

export const fetchPopularTVShows = async () => {
  try {
    const tvShows = await tvShowService.getPopularTVShows();
    return mapTVShowDocuments(tvShows);
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw error;
  }
};

export const searchTVShows = async (query: string) => {
  try {
    const tvShows = await tvShowService.searchTVShows(query);
    return mapTVShowDocuments(tvShows);
  } catch (error) {
    console.error(`Error searching TV shows with query "${query}":`, error);
    throw error;
  }
};

// Genres API
export const fetchAllGenres = async () => {
  // Using mock data for genres as they rarely change
  // In a production app, this would come from MongoDB
  return genres;
};

// User List API
export const fetchUserList = async (userId: string) => {
  try {
    const items = await userListService.getUserListItems(userId);
    // Map each item appropriately
    return items.map(item => {
      if ('firstAirDate' in item) {
        return mapTVShowDocument(item as TVShowDocument);
      } else {
        return mapMovieDocument(item as MovieDocument);
      }
    });
  } catch (error) {
    console.error(`Error fetching user list for user ${userId}:`, error);
    throw error;
  }
};

export const addToUserList = async (userId: string, itemId: string, itemType: 'movie' | 'tvshow') => {
  try {
    return await userListService.addToUserList(userId, itemId, itemType);
  } catch (error) {
    console.error(`Error adding item ${itemId} to user ${userId}'s list:`, error);
    throw error;
  }
};

export const removeFromUserList = async (userId: string, itemId: string) => {
  try {
    return await userListService.removeFromUserList(userId, itemId);
  } catch (error) {
    console.error(`Error removing item ${itemId} from user ${userId}'s list:`, error);
    throw error;
  }
};

export const isInUserList = async (userId: string, itemId: string) => {
  try {
    return await userListService.isInUserList(userId, itemId);
  } catch (error) {
    console.error(`Error checking if item ${itemId} is in user ${userId}'s list:`, error);
    return false;
  }
};
