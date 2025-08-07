import Staff from "@/models/Staff";
import { connectDB } from "@/lib/mongodb"; // your DB connector
import { NextResponse } from "next/server";
import multer from "multer";
import { Readable } from "stream";

export async function GET(req) {
  await connectDB();

  // Replace with session/email-based fetch
  const email = "vikasyeddula@gmail.com";
  const staff = await Staff.findOne({ email });

  if (!staff) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(staff);
}

// For file upload
export const config = { api: { bodyParser: false } };

export async function PUT(req) {
  await connectDB();

  const data = await req.formData();
  const email = data.get("email");

  const updateFields = {
    name: data.get("name"),
    role: data.get("role"),
  };

  if (data.get("branch")) updateFields.branch = data.get("branch");
  if (data.get("year")) updateFields.year = data.get("year");

  const file = data.get("profilePic");
  if (file && typeof file.arrayBuffer === "function") {
    const buffer = Buffer.from(await file.arrayBuffer());
    updateFields.profilePic = {
      data: buffer,
      contentType: file.type,
    };
  }

  await Staff.updateOne({ email }, { $set: updateFields });

  return NextResponse.json({ message: "Updated" });
}
