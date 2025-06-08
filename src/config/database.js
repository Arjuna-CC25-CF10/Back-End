// src/config/database.js

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Variabel process.env.MONGO_URI sudah tersedia dari server.js
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

export default connectDB;
