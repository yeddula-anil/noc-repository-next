import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "student" },
  verified: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
