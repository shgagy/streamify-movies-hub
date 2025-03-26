
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../dbService';
import { UserDocument } from '../models/types';

class UserService {
  private userDb: DatabaseService<UserDocument>;

  constructor() {
    this.userDb = new DatabaseService<UserDocument>('users');
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userDb.findOne({ id });
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userDb.findOne({ email });
  }

  async createUser(user: Omit<UserDocument, '_id'>): Promise<string | null> {
    const now = new Date();
    
    // Make sure we have all required fields
    if (!user.id || !user.email) {
      throw new Error('User id and email are required');
    }
    
    // Ensure all required properties are present
    const newUser: UserDocument = {
      ...user,
      createdAt: now,
      updatedAt: now
    };
    
    return this.userDb.insertOne(newUser);
  }

  async updateUser(id: string, update: Partial<UserDocument>): Promise<boolean> {
    const updateData = {
      ...update,
      updatedAt: new Date()
    };
    
    return this.userDb.updateOne({ id }, { $set: updateData });
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userDb.deleteOne({ id });
  }
}

export const userService = new UserService();
