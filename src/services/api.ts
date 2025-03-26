
import { genres, movies as mockMovies, tvShows as mockTvShows } from '@/lib/mockData';
import { Movie, TVShow } from '@/lib/mockData';

// Movies API
export const fetchAllMovies = async () => {
  return mockMovies;
};

export const fetchMovieById = async (id: string) => {
  const movie = mockMovies.find(m => m.id === id);
  if (!movie) {
    throw new Error('Movie not found');
  }
  return movie;
};

export const fetchMoviesByGenre = async (genreId: string) => {
  return mockMovies.filter(movie => movie.genres.includes(genreId));
};

export const fetchTrendingMovies = async () => {
  // Sort by rating to simulate trending
  return [...mockMovies].sort((a, b) => b.rating - a.rating).slice(0, 10);
};

export const fetchPopularMovies = async () => {
  // Sort by rating to simulate popularity
  return [...mockMovies].sort((a, b) => b.rating - a.rating).slice(0, 5);
};

export const searchMovies = async (query: string) => {
  const searchRegex = new RegExp(query, 'i');
  return mockMovies.filter(movie => 
    searchRegex.test(movie.title) || 
    searchRegex.test(movie.description)
  );
};

// TV Shows API
export const fetchAllTVShows = async () => {
  return mockTvShows;
};

export const fetchTVShowById = async (id: string) => {
  const tvShow = mockTvShows.find(t => t.id === id);
  if (!tvShow) {
    throw new Error('TV Show not found');
  }
  return tvShow;
};

export const fetchTVShowsByGenre = async (genreId: string) => {
  return mockTvShows.filter(tvShow => tvShow.genres.includes(genreId));
};

export const fetchTrendingTVShows = async () => {
  // Sort by rating to simulate trending
  return [...mockTvShows].sort((a, b) => b.rating - a.rating).slice(0, 10);
};

export const fetchPopularTVShows = async () => {
  // Sort by rating to simulate popularity
  return [...mockTvShows].sort((a, b) => b.rating - a.rating).slice(0, 5);
};

export const searchTVShows = async (query: string) => {
  const searchRegex = new RegExp(query, 'i');
  return mockTvShows.filter(tvShow => 
    searchRegex.test(tvShow.title) || 
    searchRegex.test(tvShow.description)
  );
};

// Genres API
export const fetchAllGenres = async () => {
  return genres;
};

// User List API
export const fetchUserList = async (userId: string) => {
  const storageKey = `streamify-mylist-${userId}`;
  const savedList = localStorage.getItem(storageKey);
  return savedList ? JSON.parse(savedList) : [];
};

export const addToUserList = async (userId: string, itemId: string, itemType: 'movie' | 'tvshow') => {
  const storageKey = `streamify-mylist-${userId}`;
  const savedList = localStorage.getItem(storageKey);
  let myList: any[] = [];
  
  if (savedList) {
    myList = JSON.parse(savedList);
  }
  
  // Find the item to add
  let itemToAdd;
  if (itemType === 'movie') {
    itemToAdd = mockMovies.find(m => m.id === itemId);
  } else {
    itemToAdd = mockTvShows.find(t => t.id === itemId);
  }
  
  if (!itemToAdd) {
    throw new Error('Item not found');
  }
  
  // Check if already in list
  if (myList.some(item => item.id === itemId)) {
    return true; // Already in list
  }
  
  // Add to list
  myList.unshift(itemToAdd);
  localStorage.setItem(storageKey, JSON.stringify(myList));
  return true;
};

export const removeFromUserList = async (userId: string, itemId: string) => {
  const storageKey = `streamify-mylist-${userId}`;
  const savedList = localStorage.getItem(storageKey);
  
  if (!savedList) {
    return false;
  }
  
  const myList = JSON.parse(savedList);
  const updatedList = myList.filter((item: any) => item.id !== itemId);
  
  localStorage.setItem(storageKey, JSON.stringify(updatedList));
  return true;
};

export const isInUserList = async (userId: string, itemId: string) => {
  const storageKey = `streamify-mylist-${userId}`;
  const savedList = localStorage.getItem(storageKey);
  
  if (!savedList) {
    return false;
  }
  
  const myList = JSON.parse(savedList);
  return myList.some((item: any) => item.id === itemId);
};
