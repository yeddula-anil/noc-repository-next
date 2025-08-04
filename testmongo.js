// testMongo.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

(async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ MongoDB Connected Successfully!");
    await client.close();
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
})();
