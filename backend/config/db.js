import mongoose from "mongoose";
import winston from "winston";

// Connect to DB from env variable url, create instance
export async function initDB() {
  const db = process.env.MONGO_URI || "mongodb://localhost:27017/test";
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    });

    winston.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    winston.error("error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}
