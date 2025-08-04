import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Request from "../../../models/Request";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      "fullName",
      "studentId",
      "collegeEmail",
      "roomNo",
      "personalMobile",
      "parentMobile",
      "year",
      "branch",
      "hostel",
      "reason",
      "fromDate",
      "toDate",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const newOutpass = await Request.create({
      type: "OUTPASS",
      ...data,
      approvals: [{ stage: "caretaker", status: "PENDING" }],
    });

    return NextResponse.json({
      message: "Outpass submitted successfully!",
      id: newOutpass._id,
    });
  } catch (error) {
    console.error("Error submitting outpass:", error);
    return NextResponse.json(
      { error: "Failed to submit outpass" },
      { status: 500 }
    );
  }
}
