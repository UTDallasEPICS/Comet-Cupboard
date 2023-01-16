import mongoose from "mongoose";

// setup database
const DATABASE_NAME = process.env.DATABASE_NAME || "db";
const DATABASE_URL = process.env.MONGODB_ORIGIN
  ? `${process.env.MONGODB_ORIGIN}/${DATABASE_NAME}?retryWrites=true&w=majority`
  : `mongodb://localhost:27017/${DATABASE_NAME}`;

// connect to mongoose
export const db = mongoose.connection;
mongoose
  .connect(DATABASE_URL, { autoCreate: true })
  .then(async () => {
    // perform one-time database init here
    console.log(`[db] Connected on ${DATABASE_URL}`);
  })
  .catch((err) => {
    console.error(`[db] Failed to connect to ${DATABASE_URL}`, err);
    process.exit(1);
  });