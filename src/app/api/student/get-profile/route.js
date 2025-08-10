import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Student from "../../../../models/Student";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Convert profilePicBuffer to base64 string if it exists
    let profilePicBase64 = null;
    if (student.profilePicBuffer) {
      profilePicBase64 = `data:${student.profilePicMimeType || "image/jpeg"};base64,${student.profilePicBuffer.toString("base64")}`;
    }

    return NextResponse.json({
      name: student.name,
      email: student.email,
      phone: student.phone,
      role: student.role,
      branch: student.branch,
      year: student.year,
      profilePic: profilePicBase64,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
