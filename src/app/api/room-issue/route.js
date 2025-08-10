import { NextResponse } from "next/server";
import dbConnect from "../../lib/dbConnect";
import RoomIssue from "../../../models/RoomIssue";

export async function POST(req) {
  try {
    dbConnect()

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

//get method
export async function GET(req) {
  try {
    dbConnect()

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "All";
    const year = searchParams.get("year") || "All";

    const filter = {};
    if (status !== "All") filter.status = status;
    if (year !== "All") filter.year = year; // keep as string

    // Fetch and sort by oldest first (ascending timestamp)
    const queries = await RoomIssue.find(filter).sort({ timestamp: 1 });

    return NextResponse.json(queries);
  } catch (error) {
    console.error("🔥 Error fetching hostel queries:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch hostel queries" },
      { status: 500 }
    );
  }
}
