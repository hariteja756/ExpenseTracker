import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    // Set a 5-second timeout for Atlas connection
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Atlas connection failed: ${error.message}`);
    console.log('Attempting to spin up a local MongoDB fallback...');
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      
      const dbPath = path.resolve('./.local_db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      // Configure a persistent local MongoDB instance using the WiredTiger engine
      const mongoServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dbPath,
          storageEngine: 'wiredTiger',
        },
      });

      const localUri = mongoServer.getUri();
      console.log(`Local MongoDB started. Saving data to: ${dbPath}`);
      
      const conn = await mongoose.connect(localUri);
      console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
      
      global.__MONGO_SERVER__ = mongoServer;
    } catch (localError) {
      console.error(`Failed to start local MongoDB: ${localError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
