import dbConnect from "../../lib/dbConnect"
import Noc from "../../../models/Noc";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const proofFile = formData.get("proof");

    let proofBuffer = null;
    let proofType = null;

    if (proofFile) {
      // Validate file type
      if (proofFile.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
      }

      // Validate file size (5 MB limit)
      if (proofFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
      }

      // Convert file to Buffer
      const arrayBuffer = await proofFile.arrayBuffer();
      proofBuffer = Buffer.from(arrayBuffer);
      proofType = proofFile.type;
    }

    const newNoc = new Noc({
      fullName: formData.get("fullName"),
      studentId: formData.get("studentId"),
      collegeEmail: formData.get("collegeEmail"),
      personalMobile: formData.get("personalMobile"),
      branch: formData.get("branch"),
      year: formData.get("year"),
      reason: formData.get("reason"),
      proof: proofBuffer ? { data: proofBuffer, contentType: proofType } : undefined,
      approvals: [{ stage: "CARETAKER" }],
    });

    await newNoc.save();

    return NextResponse.json({ message: "NOC application submitted", data: newNoc._id }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating NOC:", error);
    return NextResponse.json({ error: "Failed to create NOC" }, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");

    const filter = year ? { year } : {};
    const nocs = await Noc.find(filter).select("-proof").sort({ createdAt: -1 }); 
    // don't fetch proof to avoid big payloads

    return NextResponse.json(nocs);
  } catch (error) {
    console.error("❌ Error fetching NOCs:", error);
    return NextResponse.json({ error: "Failed to fetch NOCs" }, { status: 500 });
  }
}
