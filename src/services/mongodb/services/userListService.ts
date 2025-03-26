
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../dbService';
import { UserListDocument, MovieDocument, TVShowDocument, UserListItem } from '../models/types';
import { movieService } from './movieService';
import { tvShowService } from './tvShowService';

class UserListService {
  private userListDb: DatabaseService<UserListDocument>;

  constructor() {
    this.userListDb = new DatabaseService<UserListDocument>('userLists');
  }

  async getUserList(userId: string): Promise<UserListDocument | null> {
    return this.userListDb.findOne({ userId });
  }

  async addToUserList(userId: string, itemId: string, itemType: 'movie' | 'tvshow'): Promise<boolean> {
    const userList = await this.getUserList(userId);
    
    if (userList) {
      // Check if item already exists in the list
      const itemExists = userList.items.some(item => item.id === itemId && item.type === itemType);
      
      if (itemExists) {
        return true; // Item already in list
      }
      
      // Add to existing list
      const newItem: UserListItem = { 
        id: itemId, 
        type: itemType, 
        addedAt: new Date() 
      };
      
      return this.userListDb.updateOne(
        { userId },
        { $push: { items: newItem } }
      );
    } else {
      // Create new list
      const newList: UserListDocument = {
        userId,
        items: [{ 
          id: itemId, 
          type: itemType, 
          addedAt: new Date() 
        }]
      };
      
      const insertId = await this.userListDb.insertOne(newList);
      return !!insertId;
    }
  }

  async removeFromUserList(userId: string, itemId: string): Promise<boolean> {
    return this.userListDb.updateOne(
      { userId },
      { $pull: { items: { id: itemId } as Partial<UserListItem> } }
    );
  }

  async isInUserList(userId: string, itemId: string): Promise<boolean> {
    const userList = await this.getUserList(userId);
    if (!userList) return false;
    
    return userList.items.some(item => item.id === itemId);
  }

  async getUserListItems(userId: string): Promise<(MovieDocument | TVShowDocument)[]> {
    const userList = await this.getUserList(userId);
    if (!userList || userList.items.length === 0) {
      return [];
    }
    
    const items: (MovieDocument | TVShowDocument)[] = [];
    
    for (const item of userList.items) {
      if (item.type === 'movie') {
        const movie = await movieService.getMovieById(item.id);
        if (movie) items.push(movie);
      } else {
        const tvShow = await tvShowService.getTVShowById(item.id);
        if (tvShow) items.push(tvShow);
      }
    }
    
    return items;
  }

  async clearUserList(userId: string): Promise<boolean> {
    return this.userListDb.updateOne({ userId }, { $set: { items: [] } });
  }
}

export const userListService = new UserListService();
