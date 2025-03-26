
import { Document, ObjectId } from 'mongodb';

export interface MovieDocument extends Document {
  _id?: ObjectId;
  id: string;
  title: string;
  overview: string;  // Maps to description in UI
  posterPath: string;  // Maps to posterUrl in UI
  backdropPath: string;  // Maps to backdropUrl in UI
  releaseDate: string;  // Used to derive releaseYear
  runtime: number;  // Maps to duration in UI
  rating: number;
  genres: string[];
  director: string;
  cast: string[];
  trailerUrl?: string;
  
  // UI-specific fields
  description?: string;  // Same as overview
  posterUrl?: string;  // Same as posterPath
  backdropUrl?: string;  // Same as backdropPath
  releaseYear?: number;  // Derived from releaseDate
  duration?: string;  // Formatted runtime
  featured?: boolean;
}

export interface TVShowDocument extends Document {
  _id?: ObjectId;
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  firstAirDate: string;
  lastAirDate: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRuntime: number;
  rating: number;
  genres: string[];
  creator: string;
  director: string; // Required field to match TVShow interface
  cast: string[];
  trailerUrl?: string;
  
  // UI-specific fields
  description?: string;  // Same as overview
  posterUrl?: string;  // Same as posterPath
  backdropUrl?: string;  // Same as backdropPath
  releaseYear?: number;  // Derived from firstAirDate
  duration?: string;  // Formatted episodeRuntime
  seasons?: number;  // Same as numberOfSeasons
  episodes?: number;  // Same as numberOfEpisodes
  featured?: boolean;
}

export interface UserListItem {
  id: string;
  type: 'movie' | 'tvshow';
  addedAt: Date;
}

export interface UserListDocument extends Document {
  _id?: ObjectId;
  userId: string;
  items: UserListItem[];  // This explicitly defines items as an array of UserListItem objects
}

export interface UserDocument extends Document {
  _id?: ObjectId;
  id: string;
  email: string;
  name?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
