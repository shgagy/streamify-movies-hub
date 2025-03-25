
import { Movie } from "./mockData";

/**
 * Sorts movies by their rating in descending order
 */
export const sortMoviesByRating = (movies: Movie[]): Movie[] => {
  return [...movies].sort((a, b) => b.rating - a.rating);
};

/**
 * Filters movies by year range
 */
export const filterMoviesByYear = (movies: Movie[], startYear: number, endYear: number): Movie[] => {
  return movies.filter(movie => movie.releaseYear >= startYear && movie.releaseYear <= endYear);
};

/**
 * Filters movies by minimum rating
 */
export const filterMoviesByMinRating = (movies: Movie[], minRating: number): Movie[] => {
  return movies.filter(movie => movie.rating >= minRating);
};

/**
 * Get a random selection of movies (for recommendations)
 */
export const getRandomMovies = (movies: Movie[], count: number): Movie[] => {
  const shuffled = [...movies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Find similar movies based on genres
 */
export const getSimilarMovies = (movie: Movie, allMovies: Movie[], limit = 5): Movie[] => {
  // Don't include the same movie
  const otherMovies = allMovies.filter(m => m.id !== movie.id);
  
  // Score each movie by how many matching genres it has
  const moviesWithScore = otherMovies.map(m => {
    const matchingGenres = m.genres.filter(genre => movie.genres.includes(genre));
    return {
      movie: m,
      score: matchingGenres.length
    };
  });
  
  // Sort by score (highest first) and take the top 'limit' movies
  return moviesWithScore
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie);
};
