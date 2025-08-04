import mongoose from "mongoose";

const RoomIssueSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  roomNo: { type: String, required: true },
  hostel: { type: String, required: true },
  mobileNo: { type: String, required: true },
  year: { type: String, required: true },
  issueType: {
    type: String,
    enum: ["Fan Repair", "Light Repair", "Carpentry","Plumbing","Others"],
    required: true,
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING","APPROVED","RESOLVED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.RoomIssue || mongoose.model("RoomIssue", RoomIssueSchema);
