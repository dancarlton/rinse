import mongoose from 'mongoose';
import { logger } from './logging.js';

// Connect to DB from env variable url, create instance
export async function initDB() {
  const MONGO_URI =
    process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;
  const db = MONGO_URI || 'mongodb://localhost:27017/test';
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Check if connection is established
    if (mongoose.connection.readyState === 1) {
      logger.info(`MongoDB connected: ${mongoose.connection.host}`);
    } else {
      throw new Error('Failed to connect to MongoDB.');
    }
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}
