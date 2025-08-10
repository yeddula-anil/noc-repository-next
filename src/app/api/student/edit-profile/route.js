import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Student from "../../../../models/Student";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { email, name, phone, branch, year, profilePicBuffer } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let student = await Student.findOne({ email });

    if (!student) {
      // Create new student (role defaults to "STUDENT")
      student = new Student({
        email,
        name,
        phone,
        branch,
        year,
        profilePicBuffer: profilePicBuffer
          ? Buffer.from(Object.values(profilePicBuffer))
          : undefined,
      });
    } else {
      // Update existing student
      if (name !== undefined) student.name = name;
      if (phone !== undefined) student.phone = phone;
      if (branch !== undefined) student.branch = branch;
      if (year !== undefined) student.year = year;
      if (profilePicBuffer) {
        student.profilePicBuffer = Buffer.from(Object.values(profilePicBuffer));
      }
    }

    await student.save();

    return NextResponse.json({
      message: student.isNew
        ? "Student created successfully"
        : "Profile updated successfully",
    });
  } catch (err) {
    console.error("Error updating/creating student profile:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
