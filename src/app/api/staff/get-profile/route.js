import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Staff from "../../../../models/Staff";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const staff = await Staff.findOne({ email });

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    // Convert buffer to base64 string if it exists
    let profilePicBase64 = null;
    if (staff.profilePicBuffer) {
      profilePicBase64 = `data:${staff.profilePicMimeType || "image/jpeg"};base64,${staff.profilePicBuffer.toString("base64")}`;
    }

    return NextResponse.json({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      branch: staff.branch,
      year: staff.year,
      profilePic: profilePicBase64,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
