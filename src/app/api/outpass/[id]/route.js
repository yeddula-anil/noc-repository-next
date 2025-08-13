import dbConnect from "../../../lib/dbConnect";
import Request from "../../../../models/Request";
import { NextResponse } from "next/server";
export async function GET(req,{params}) {
  await dbConnect();

  try {
    const {id}=await params;
    

    const outpass = await Request.findById(id); 
    // don't fetch proof to avoid big payloads

    return NextResponse.json(outpass);
  } catch (error) {
    console.error("❌ Error fetching NOC with that id:", error);
    return NextResponse.json({ error: "Failed to fetch NOC" }, { status: 500 });
  }
}



export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const formData = await req.formData();

    // Only pick the fields that are shown in the form
    const updateData = {};
    for (const [key, value] of formData.entries()) {
      if (key === "proof" || key === "approvals") continue; // skip approvals
      if (key === "fromDate" || key === "toDate") {
        updateData[key] = value ? new Date(value) : undefined;
      } else {
        updateData[key] = value;
      }
    }

    // Update only the allowed fields
    const updatedOutpass = await Request.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedOutpass) {
      return NextResponse.json({ error: "Outpass application not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Outpass updated successfully",
      data: updatedOutpass,
    });
  } catch (error) {
    console.error("Error updating Outpass:", error);
    return NextResponse.json({ error: "Failed to update Outpass" }, { status: 500 });
  }
}