import mongoose from "mongoose";

// Approval subdocument schema
const ApprovalSchema = new mongoose.Schema({
  stage: { type: String, required: true }, // only caretaker for outpass
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  remarks: {
    type: String,
    validate: {
      validator: function (value) {
        return !(this.status === "REJECTED" && !value);
      },
      message: "Remarks are required when rejecting a request.",
    },
  },
  updatedAt: { type: Date, default: Date.now },
});

// Main Request schema
const RequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["OUTPASS"],
    required: true,
  },
  fullName: { type: String, required: true },
  studentId: { type: String, required: true },
  collegeEmail: { type: String, required: true },
  personalMobile: { type: String, required: true },
  year: {
    type: String,
    enum: ["E1", "E2", "E3", "E4"], // academic year
    required: true,
  },

  // Outpass specific fields
  roomNo: { type: String, required: true },
  parentMobile: { type: String, required: true },
  hostel: { type: String, required: true },
  branch:{type:String,required:true},
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING","INPROGRESS", "APPROVED","REJECTED"],
    default:"PENDING"
  },

  approvals: [ApprovalSchema], // caretaker approval

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
