import mongoose from "mongoose";

const ApprovalSchema = new mongoose.Schema({
  stage: { type: String, required: true },
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
      message: "Remarks required when rejecting.",
    },
  },
  updatedAt: { type: Date, default: Date.now },
});

const NocSchema = new mongoose.Schema({
  type: { type: String, default: "NOC" },
  fullName: { type: String, required: true },
  studentId: { type: String, required: true },
  collegeEmail: { type: String, required: true },
  personalMobile: { type: String, required: true },
  branch: { type: String, required: true },
  year: {
    type: String,
    enum: ["E1", "E2", "E3", "E4"],
    required: true,
  },
  reason: { type: String, required: true },
  proof: {
    data: Buffer,
    contentType: String,
    filename:String
  },

  approvals: [ApprovalSchema],

  status: {
    type: String,
    enum: ["PENDING", "INPROGRESS", "APPROVED", "REJECTED"],
    default: "PENDING",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Noc || mongoose.model("Noc", NocSchema);
