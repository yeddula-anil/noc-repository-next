import { NextResponse } from "next/server";
import mongoose from "mongoose";
import RoomIssue from "../../../models/RoomIssue";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const data = await req.json();
    console.log("📌 Received data:", data);

    // Validation check
    if (
      !data.studentId ||
      !data.fullName ||
      !data.email ||
      !data.year ||
      !data.mobileNo ||
      !data.roomNo ||
      !data.hostel ||
      !data.issueType ||
      !data.description
    ) {
      console.log("❌ Missing fields:", data);
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newIssue = await RoomIssue.create(data);
    console.log("✅ Saved issue:", newIssue);

    return NextResponse.json({
      message: "Room issue submitted successfully",
      id: newIssue._id,
    });
  } catch (error) {
    console.error("🔥 Error saving room issue:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to submit room issue" },
      { status: 500 }
    );
  }
}
