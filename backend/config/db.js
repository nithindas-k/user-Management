import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log(" MongoDB Connected to userData ✅");

  } catch (error) {

    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
