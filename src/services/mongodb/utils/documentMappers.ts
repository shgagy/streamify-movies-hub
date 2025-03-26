
import { MovieDocument, TVShowDocument } from "../models/types";

/**
 * Ensures that MovieDocument objects have all the UI-required fields
 */
export function mapMovieDocument(doc: MovieDocument): MovieDocument {
  if (!doc) return doc;
  
  // Map fields and ensure all UI properties exist
  return {
    ...doc,
    description: doc.description || doc.overview,
    posterUrl: doc.posterUrl || doc.posterPath,
    backdropUrl: doc.backdropUrl || doc.backdropPath,
    releaseYear: doc.releaseYear || (doc.releaseDate ? new Date(doc.releaseDate).getFullYear() : 0),
    duration: doc.duration || (doc.runtime ? `${Math.floor(doc.runtime / 60)}h ${doc.runtime % 60}min` : "Unknown")
  };
}

/**
 * Maps a MongoDB TV show document to the UI model
 */
export function mapTVShowDocument(doc: TVShowDocument): TVShowDocument {
  if (!doc) return doc;
  
  return {
    ...doc,
    description: doc.description || doc.overview,
    posterUrl: doc.posterUrl || doc.posterPath,
    backdropUrl: doc.backdropUrl || doc.backdropPath,
    releaseYear: doc.releaseYear || (doc.firstAirDate ? new Date(doc.firstAirDate).getFullYear() : 0),
    duration: doc.duration || `${doc.episodeRuntime}min`,
    seasons: doc.seasons || doc.numberOfSeasons,
    episodes: doc.episodes || doc.numberOfEpisodes
  };
}

/**
 * Maps an array of movie documents to UI models
 */
export function mapMovieDocuments(docs: MovieDocument[]): MovieDocument[] {
  return docs.map(mapMovieDocument);
}

/**
 * Maps an array of TV show documents to UI models
 */
export function mapTVShowDocuments(docs: TVShowDocument[]): TVShowDocument[] {
  return docs.map(mapTVShowDocument);
}
