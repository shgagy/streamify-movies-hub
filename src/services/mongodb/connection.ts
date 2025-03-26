
import { MongoClient, ServerApiVersion } from 'mongodb';

// Connection URI
let uri = process.env.MONGODB_URI || '';
let dbName = process.env.MONGODB_DB_NAME || 'streamify';

// MongoDB client instance
let client: MongoClient | null = null;
let isConnected = false;

/**
 * Get MongoDB client instance
 */
export const getClient = async (): Promise<MongoClient> => {
  if (!uri) {
    throw new Error('MongoDB URI is not defined. Please set the MONGODB_URI environment variable.');
  }

  if (client && isConnected) {
    return client;
  }

  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    isConnected = true;
    console.log('Connected to MongoDB successfully');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

/**
 * Get database instance
 */
export const getDb = async () => {
  const client = await getClient();
  return client.db(dbName);
};

/**
 * Close MongoDB connection
 */
export const closeConnection = async (): Promise<void> => {
  if (client && isConnected) {
    await client.close();
    isConnected = false;
    client = null;
    console.log('MongoDB connection closed');
  }
};
