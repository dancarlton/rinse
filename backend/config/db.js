import mongoose from "mongoose";

// Connect to DB from env variable url, create instance
export async function initDB() {
  const db = process.env.MONGO_URI || "mongodb://localhost:27017/test";
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
