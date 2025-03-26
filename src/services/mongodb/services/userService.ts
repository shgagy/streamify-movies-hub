
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

  async createUser(userData: { id: string; email: string; name?: string; imageUrl?: string }): Promise<string | null> {
    // Validate required fields
    if (!userData.id || !userData.email) {
      throw new Error("User id and email are required");
    }
    
    const now = new Date();
    const newUser: UserDocument = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      imageUrl: userData.imageUrl,
      createdAt: now,
      updatedAt: now
    };
    
    return this.userDb.insertOne(newUser);
  }

  async updateUser(id: string, updateData: Partial<UserDocument>): Promise<boolean> {
    const now = new Date();
    return this.userDb.updateOne(
      { id },
      { 
        $set: { 
          ...updateData,
          updatedAt: now 
        } 
      }
    );
  }
}

export const userService = new UserService();
