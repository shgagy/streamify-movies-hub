
import { movies, tvShows } from "@/lib/mockData";
import { getDb } from "./connection";
import { MovieDocument, TVShowDocument } from "./models/types";

/**
 * Initialize the database with sample data
 */
export async function initializeDatabase() {
  const db = await getDb();
  
  // Check if collections exist and have data
  const moviesCount = await db.collection('movies').countDocuments();
  const tvShowsCount = await db.collection('tvshows').countDocuments();
  
  console.log(`Database check: Found ${moviesCount} movies and ${tvShowsCount} TV shows`);
  
  // Only initialize if collections are empty
  if (moviesCount === 0) {
    console.log('Initializing movies collection...');
    await insertMovies();
  }
  
  if (tvShowsCount === 0) {
    console.log('Initializing TV shows collection...');
    await insertTVShows();
  }
  
  console.log('Database initialization complete');
}

async function insertMovies() {
  const db = await getDb();
  
  // Convert mock movies to MovieDocument format
  const movieDocuments: MovieDocument[] = movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    overview: movie.description,
    posterPath: movie.posterUrl,
    backdropPath: movie.backdropUrl,
    releaseDate: `${movie.releaseYear}-01-01`, // Default to January 1st of the year
    runtime: parseInt(movie.duration.match(/\d+/g)?.[0] || '0') * 60 + parseInt(movie.duration.match(/\d+/g)?.[1] || '0'),
    rating: movie.rating,
    genres: movie.genres,
    director: movie.director,
    cast: movie.cast,
    trailerUrl: movie.trailerUrl,
    // UI-specific fields
    description: movie.description,
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    releaseYear: movie.releaseYear,
    duration: movie.duration,
    featured: movie.featured
  }));
  
  await db.collection('movies').insertMany(movieDocuments);
}

async function insertTVShows() {
  const db = await getDb();
  
  // Convert mock TV shows to TVShowDocument format
  const tvShowDocuments: TVShowDocument[] = tvShows.map(show => ({
    id: show.id,
    title: show.title,
    overview: show.description,
    posterPath: show.posterUrl,
    backdropPath: show.backdropUrl,
    firstAirDate: `${show.releaseYear}-01-01`, // Default to January 1st of the year
    lastAirDate: `${show.releaseYear + 1}-01-01`, // Default to a year later
    numberOfSeasons: show.seasons,
    numberOfEpisodes: show.episodes,
    episodeRuntime: parseInt(show.duration.match(/\d+/g)?.[0] || '0'),
    rating: show.rating,
    genres: show.genres,
    creator: show.creator,
    cast: show.cast,
    trailerUrl: show.trailerUrl,
    // UI-specific fields
    description: show.description,
    posterUrl: show.posterUrl,
    backdropUrl: show.backdropUrl,
    releaseYear: show.releaseYear,
    duration: show.duration,
    seasons: show.seasons,
    episodes: show.episodes,
    featured: show.featured
  }));
  
  await db.collection('tvshows').insertMany(tvShowDocuments);
}
