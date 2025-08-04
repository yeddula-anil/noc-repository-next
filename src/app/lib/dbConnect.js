// lib/dbConnect.js
import mongoose from "mongoose";

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI in .env.local");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Mongoose connected");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    throw error;
  }
}
