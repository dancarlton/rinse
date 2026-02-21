import mongoose from 'mongoose';
import { logger } from './logging.js';

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

// Connect to DB from env variable url, create instance
export async function initDB() {
  if (cached.conn) return cached.conn;

  const MONGO_URI =
    process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;
  const db = MONGO_URI || 'mongodb://localhost:27017/test';

  if (!cached.promise) {
    cached.promise = mongoose.connect(db).then((m) => {
      logger.info(`MongoDB connected: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }

  return cached.conn;
}
