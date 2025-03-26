
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../dbService';
import { TVShowDocument } from '../models/types';

class TVShowService {
  private tvShowDb: DatabaseService<TVShowDocument>;

  constructor() {
    this.tvShowDb = new DatabaseService<TVShowDocument>('tvshows');
  }

  async getAllTVShows(): Promise<TVShowDocument[]> {
    return this.tvShowDb.find({});
  }

  async getTVShowById(id: string): Promise<TVShowDocument | null> {
    return this.tvShowDb.findOne({ id });
  }

  async getTVShowsByGenre(genreId: string): Promise<TVShowDocument[]> {
    return this.tvShowDb.find({ genres: genreId });
  }

  async searchTVShows(query: string): Promise<TVShowDocument[]> {
    const searchRegex = new RegExp(query, 'i');
    return this.tvShowDb.find({
      $or: [
        { title: { $regex: searchRegex } },
        { overview: { $regex: searchRegex } }
      ]
    });
  }

  async getTrendingTVShows(): Promise<TVShowDocument[]> {
    return this.tvShowDb.find({}, { sort: { rating: -1 }, limit: 10 });
  }

  async getPopularTVShows(): Promise<TVShowDocument[]> {
    return this.tvShowDb.find({}, { sort: { rating: -1 }, limit: 5 });
  }
}

export const tvShowService = new TVShowService();
