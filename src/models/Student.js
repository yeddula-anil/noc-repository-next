import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
      default: "",
    },
    profilePicBuffer: {
      type: Buffer, // Optional raw binary data
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
      
    },
    role: {
      type: String,
      enum: ["STUDENT"], // Only "STUDENT" allowed
      default: "STUDENT"
       // Cannot be changed after creation
    },
    phone: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      enum:["E1","E2","E3","E4"],
      default:""
    },
    noOfOutpasses: {
      type: Number,
      default: 8,
      min: 0,
    },
  },
  { timestamps: true }
);

// Export model
export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);
