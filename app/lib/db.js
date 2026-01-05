import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO;

if (!MONGODB_URI) {
  throw new Error("اتصال پیدا نشد: متغیر محیطی MONGODB_URI یا MONGO تعریف نشده است.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
