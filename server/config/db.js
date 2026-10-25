import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (uri && uri !== 'your_mongodb_connection_string') {
    try {
      console.log('Connecting to MongoDB at specified MONGODB_URI...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('Successfully connected to MongoDB!');
      return;
    } catch (err) {
      console.warn('Failed to connect to remote MongoDB URI:', err.message);
      console.log('Falling back to local in-memory MongoDB server...');
    }
  } else {
    console.log('No MONGODB_URI provided in .env. Initializing local in-memory MongoDB...');
  }

  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const inMemoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(inMemoryUri);
    console.log(`Connected to in-memory MongoDB instance: ${inMemoryUri}`);
  } catch (err) {
    console.error('Fatal error initializing in-memory MongoDB:', err);
    throw err;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
