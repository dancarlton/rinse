import mongoose from 'mongoose';
import { logger } from './logging.js';

// Connect to DB from env variable url, create instance
export async function initDB() {
  const MONGO_URI =
    process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;
  const db = MONGO_URI || 'mongodb://localhost:27017/test';
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}
