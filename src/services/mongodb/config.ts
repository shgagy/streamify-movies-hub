
/**
 * MongoDB configuration
 * 
 * This file manages the MongoDB connection configuration.
 * In a production environment, you would typically load these values from environment variables.
 */

export const mongoConfig = {
  /**
   * The MongoDB connection URI
   * Format: mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
   */
  uri: process.env.MONGODB_URI || '',
  
  /**
   * Database name
   */
  dbName: process.env.MONGODB_DB_NAME || 'streamify',
  
  /**
   * Connection options
   */
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 30000,
  }
};

/**
 * Set the MongoDB URI
 * This method is for development purposes only.
 * In production, always use environment variables.
 */
export const setMongoUri = (uri: string): void => {
  if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = uri;
  }
};

/**
 * Set the MongoDB database name
 */
export const setMongoDbName = (dbName: string): void => {
  if (!process.env.MONGODB_DB_NAME) {
    process.env.MONGODB_DB_NAME = dbName;
  }
};
