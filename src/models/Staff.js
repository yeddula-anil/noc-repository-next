// models/Staff.js
import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["CARETAKER", "DSW", "HOD", "DEAN", "FO_OFFICE", "DIRECTOR"],
    required: true,
  },
  branch: {
    type: String,
    required: function () {
      return this.role === "HOD";
    },
  },
  year: {
    type: String,
    required: function () {
      return this.role === "CARETAKER";
    },
  },
  profilePic: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
