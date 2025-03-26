
import { getClient, getDb, closeConnection } from './connection';
import { movies, tvShows } from '@/lib/mockData';
import { MovieDocument, TVShowDocument } from './models/types';

/**
 * Initialize database with mock data
 */
export const initDatabase = async () => {
  try {
    console.log('Initializing database with mock data...');
    const db = await getDb();
    
    // Check if collections already exist and have data
    const movieCount = await db.collection('movies').countDocuments();
    const tvShowCount = await db.collection('tvshows').countDocuments();
    
    if (movieCount > 0 && tvShowCount > 0) {
      console.log('Database already initialized.');
      return;
    }
    
    // Drop existing collections if they exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (collectionNames.includes('movies')) {
      await db.collection('movies').drop();
    }
    if (collectionNames.includes('tvshows')) {
      await db.collection('tvshows').drop();
    }
    
    // Insert mock data
    if (movies.length > 0) {
      const moviesCollection = db.collection<MovieDocument>('movies');
      await moviesCollection.insertMany(movies as MovieDocument[]);
      console.log(`Inserted ${movies.length} movies`);
    }
    
    if (tvShows.length > 0) {
      const tvShowsCollection = db.collection<TVShowDocument>('tvshows');
      await tvShowsCollection.insertMany(tvShows as TVShowDocument[]);
      console.log(`Inserted ${tvShows.length} TV shows`);
    }
    
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await closeConnection();
  }
};

// Uncomment and run this function to initialize the database
// initDatabase();
