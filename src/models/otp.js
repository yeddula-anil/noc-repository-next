// src/models/Otp.js
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Prevent model overwrite in dev mode
export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
