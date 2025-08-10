// src/app/api/staff/edit-profile/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Staff from "../../../../models/Staff";

function setProfilePic(staffDoc, pic) {
  let bufferData;

  if (typeof pic === "string") {
    // Base64 string
    bufferData = Buffer.from(pic, "base64");
  } 
  else if (pic && typeof pic === "object" && !Buffer.isBuffer(pic)) {
    // Numeric-key object from JSON.stringify(Buffer)
    bufferData = Buffer.from(Object.values(pic));
  } 
  else if (Buffer.isBuffer(pic)) {
    bufferData = pic;
  } 
  else {
    console.error("DEBUG: Unexpected profilePicBuffer format received:", pic);
    throw new Error("Invalid profilePicBuffer format");
  }

  staffDoc.profilePicBuffer = bufferData;
  staffDoc.profilePicMimeType = "image/jpeg"; // or detect dynamically if needed
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, name, phone, role, branch, year, profilePicBuffer } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let staff = await Staff.findOne({ email });

    if (!staff) {
      // Create new staff record
      staff = new Staff({
        email,
        name: name || "",
        phone: phone || "",
        role: role || "",
        branch: branch || "",
        year: year || "",
      });

      if (profilePicBuffer) {
        setProfilePic(staff, profilePicBuffer);
      }

      await staff.save();
      return NextResponse.json({ message: "New staff created successfully" });
    }

    // Update existing staff
    staff.name = name ?? staff.name;
    staff.phone = phone ?? staff.phone;
    staff.role = role ?? staff.role;
    staff.branch = branch ?? staff.branch;
    staff.year = year ?? staff.year;

    if (profilePicBuffer) {
      setProfilePic(staff, profilePicBuffer);
    }

    await staff.save();

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
