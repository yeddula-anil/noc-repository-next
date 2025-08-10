// models/Staff.js
import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    role: { type: String, enum: ["HOD", "CARETAKER","DEAN","FO_OFFICE","DSW","DIRECTOR"], required: true },
    branch: { type: String }, // Only applicable for HOD
    year: { type: String },   // Only applicable for Caretaker
    profilePic: { type: String }, // URL or base64
    profilePicBuffer: { type: Buffer },
  },
  { timestamps: true }
);

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
