
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../dbService';
import { MovieDocument } from '../models/types';

class MovieService {
  private movieDb: DatabaseService<MovieDocument>;

  constructor() {
    this.movieDb = new DatabaseService<MovieDocument>('movies');
  }

  async getAllMovies(): Promise<MovieDocument[]> {
    return this.movieDb.find({});
  }

  async getMovieById(id: string): Promise<MovieDocument | null> {
    return this.movieDb.findOne({ id });
  }

  async getMoviesByGenre(genreId: string): Promise<MovieDocument[]> {
    return this.movieDb.find({ genres: genreId });
  }

  async searchMovies(query: string): Promise<MovieDocument[]> {
    const searchRegex = new RegExp(query, 'i');
    return this.movieDb.find({
      $or: [
        { title: { $regex: searchRegex } },
        { overview: { $regex: searchRegex } }
      ]
    });
  }

  async getTrendingMovies(): Promise<MovieDocument[]> {
    // In a real implementation, this might use data like view counts or ratings
    return this.movieDb.find({}, { sort: { rating: -1 }, limit: 10 });
  }

  async getPopularMovies(): Promise<MovieDocument[]> {
    return this.movieDb.find({}, { sort: { rating: -1 }, limit: 5 });
  }
}

export const movieService = new MovieService();
