
import { Collection, Document, Filter, FindOptions, OptionalUnlessRequiredId, UpdateFilter } from 'mongodb';
import { getDb } from './connection';

export class DatabaseService<T extends Document> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Get collection
   */
  private async getCollection(): Promise<Collection<T>> {
    const db = await getDb();
    return db.collection<T>(this.collectionName);
  }

  /**
   * Insert a single document
   */
  async insertOne(document: OptionalUnlessRequiredId<T>): Promise<string | null> {
    try {
      const collection = await this.getCollection();
      const result = await collection.insertOne(document);
      return result.insertedId.toString();
    } catch (error) {
      console.error(`Error inserting document into ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Insert multiple documents
   */
  async insertMany(documents: OptionalUnlessRequiredId<T>[]): Promise<string[]> {
    try {
      const collection = await this.getCollection();
      const result = await collection.insertMany(documents);
      return Object.values(result.insertedIds).map(id => id.toString());
    } catch (error) {
      console.error(`Error inserting documents into ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Find a single document
   */
  async findOne(filter: Filter<T>, options?: FindOptions): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      return await collection.findOne(filter, options) as T | null;
    } catch (error) {
      console.error(`Error finding document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Find multiple documents
   */
  async find(filter: Filter<T>, options?: FindOptions): Promise<T[]> {
    try {
      const collection = await this.getCollection();
      return await collection.find(filter, options).toArray() as T[];
    } catch (error) {
      console.error(`Error finding documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a single document
   */
  async updateOne(filter: Filter<T>, update: UpdateFilter<T>): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const result = await collection.updateOne(filter, update);
      return result.modifiedCount > 0;
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update multiple documents
   */
  async updateMany(filter: Filter<T>, update: UpdateFilter<T>): Promise<number> {
    try {
      const collection = await this.getCollection();
      const result = await collection.updateMany(filter, update);
      return result.modifiedCount;
    } catch (error) {
      console.error(`Error updating documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a single document
   */
  async deleteOne(filter: Filter<T>): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne(filter);
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting document from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete multiple documents
   */
  async deleteMany(filter: Filter<T>): Promise<number> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteMany(filter);
      return result.deletedCount;
    } catch (error) {
      console.error(`Error deleting documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Count documents
   */
  async countDocuments(filter: Filter<T>): Promise<number> {
    try {
      const collection = await this.getCollection();
      return await collection.countDocuments(filter);
    } catch (error) {
      console.error(`Error counting documents in ${this.collectionName}:`, error);
      throw error;
    }
  }
}
