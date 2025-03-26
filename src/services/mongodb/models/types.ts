
import { Document, ObjectId } from 'mongodb';

export interface MovieDocument extends Document {
  _id?: ObjectId;
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  runtime: number;
  rating: number;
  genres: string[];
  director: string;
  cast: string[];
  trailerUrl?: string;
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
  cast: string[];
  trailerUrl?: string;
}

export interface UserListDocument extends Document {
  _id?: ObjectId;
  userId: string;
  items: {
    id: string;
    type: 'movie' | 'tvshow';
    addedAt: Date;
  }[];
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
