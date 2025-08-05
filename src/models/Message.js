import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // e.g. "noc_request.pdf"
  data: { type: Buffer, required: true },     // PDF file stored as buffer
  contentType: { type: String, default: "application/pdf" },
});

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true }, // e.g. caretaker@college.edu
    receiverEmail: { type: String, required: true }, // fetch messages by this
    subject: { type: String, required: true },
    content: { type: String, required: true },
    attachments: [AttachmentSchema],
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
