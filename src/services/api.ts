
import { genres, movies as mockMovies, tvShows as mockTvShows } from '@/lib/mockData';
import { Movie, TVShow } from '@/lib/mockData';

// Check if we're running in the browser
const isBrowser = typeof window !== 'undefined';

// Movies API
export const fetchAllMovies = async () => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      console.log('Using mock movie data for browser environment');
      return mockMovies;
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error('Error fetching all movies:', error);
    // Fallback to mock data
    return mockMovies;
  }
};

export const fetchMovieById = async (id: string) => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      const movie = mockMovies.find(m => m.id === id);
      if (!movie) {
        throw new Error('Movie not found');
      }
      return movie;
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error fetching movie with id ${id}:`, error);
    // Fallback to mock data
    const movie = mockMovies.find(m => m.id === id);
    if (!movie) {
      throw new Error('Movie not found');
    }
    return movie;
  }
};

export const fetchMoviesByGenre = async (genreId: string) => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      return mockMovies.filter(movie => movie.genres.includes(genreId));
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error fetching movies by genre ${genreId}:`, error);
    // Fallback to mock data
    return mockMovies.filter(movie => movie.genres.includes(genreId));
  }
};

export const fetchTrendingMovies = async () => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      // Sort by rating to simulate trending
      return [...mockMovies].sort((a, b) => b.rating - a.rating).slice(0, 10);
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    // Fallback to mock data
    return [...mockMovies].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }
};

export const fetchPopularMovies = async () => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      // Sort by rating to simulate popularity
      return [...mockMovies].sort((a, b) => b.rating - a.rating).slice(0, 5);
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    // Fallback to mock data
    return [...mockMovies].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }
};

export const searchMovies = async (query: string) => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      const searchRegex = new RegExp(query, 'i');
      return mockMovies.filter(movie => 
        searchRegex.test(movie.title) || 
        searchRegex.test(movie.description)
      );
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error searching movies with query "${query}":`, error);
    // Fallback to mock data
    const searchRegex = new RegExp(query, 'i');
    return mockMovies.filter(movie => 
      searchRegex.test(movie.title) || 
      searchRegex.test(movie.description)
    );
  }
};

// TV Shows API
export const fetchAllTVShows = async () => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      return mockTvShows;
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error('Error fetching all TV shows:', error);
    // Fallback to mock data
    return mockTvShows;
  }
};

export const fetchTVShowById = async (id: string) => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      const tvShow = mockTvShows.find(t => t.id === id);
      if (!tvShow) {
        throw new Error('TV Show not found');
      }
      return tvShow;
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error fetching TV show with id ${id}:`, error);
    // Fallback to mock data
    const tvShow = mockTvShows.find(t => t.id === id);
    if (!tvShow) {
      throw new Error('TV Show not found');
    }
    return tvShow;
  }
};

export const fetchTVShowsByGenre = async (genreId: string) => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      return mockTvShows.filter(tvShow => tvShow.genres.includes(genreId));
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error fetching TV shows by genre ${genreId}:`, error);
    // Fallback to mock data
    return mockTvShows.filter(tvShow => tvShow.genres.includes(genreId));
  }
};

export const fetchTrendingTVShows = async () => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      // Sort by rating to simulate trending
      return [...mockTvShows].sort((a, b) => b.rating - a.rating).slice(0, 10);
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    // Fallback to mock data
    return [...mockTvShows].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }
};

export const fetchPopularTVShows = async () => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      // Sort by rating to simulate popularity
      return [...mockTvShows].sort((a, b) => b.rating - a.rating).slice(0, 5);
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    // Fallback to mock data
    return [...mockTvShows].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }
};

export const searchTVShows = async (query: string) => {
  try {
    // In browser, use mock data
    if (isBrowser) {
      const searchRegex = new RegExp(query, 'i');
      return mockTvShows.filter(tvShow => 
        searchRegex.test(tvShow.title) || 
        searchRegex.test(tvShow.description)
      );
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error searching TV shows with query "${query}":`, error);
    // Fallback to mock data
    const searchRegex = new RegExp(query, 'i');
    return mockTvShows.filter(tvShow => 
      searchRegex.test(tvShow.title) || 
      searchRegex.test(tvShow.description)
    );
  }
};

// Genres API
export const fetchAllGenres = async () => {
  return genres;
};

// User List API
export const fetchUserList = async (userId: string) => {
  try {
    // In browser, use local storage for user lists
    if (isBrowser) {
      const storageKey = `streamify-mylist-${userId}`;
      const savedList = localStorage.getItem(storageKey);
      return savedList ? JSON.parse(savedList) : [];
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error fetching user list for user ${userId}:`, error);
    return [];
  }
};

export const addToUserList = async (userId: string, itemId: string, itemType: 'movie' | 'tvshow') => {
  try {
    // In browser, use local storage for user lists
    if (isBrowser) {
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
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error adding item ${itemId} to user ${userId}'s list:`, error);
    return false;
  }
};

export const removeFromUserList = async (userId: string, itemId: string) => {
  try {
    // In browser, use local storage for user lists
    if (isBrowser) {
      const storageKey = `streamify-mylist-${userId}`;
      const savedList = localStorage.getItem(storageKey);
      
      if (!savedList) {
        return false;
      }
      
      const myList = JSON.parse(savedList);
      const updatedList = myList.filter((item: any) => item.id !== itemId);
      
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
      return true;
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error removing item ${itemId} from user ${userId}'s list:`, error);
    return false;
  }
};

export const isInUserList = async (userId: string, itemId: string) => {
  try {
    // In browser, use local storage for user lists
    if (isBrowser) {
      const storageKey = `streamify-mylist-${userId}`;
      const savedList = localStorage.getItem(storageKey);
      
      if (!savedList) {
        return false;
      }
      
      const myList = JSON.parse(savedList);
      return myList.some((item: any) => item.id === itemId);
    }
    
    // Server-side code would go here (not used in browser)
    throw new Error('Direct MongoDB access not available in browser');
  } catch (error) {
    console.error(`Error checking if item ${itemId} is in user ${userId}'s list:`, error);
    return false;
  }
};
