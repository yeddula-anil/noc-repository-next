import dbConnect from "../../../lib/dbConnect";
import Noc from "../../../../models/Noc";
import { NextResponse } from "next/server";
export async function GET(req,{params}) {
  await dbConnect();

  try {
    const {id}=await params;
    

    const noc = await Noc.findById(id); 
    // don't fetch proof to avoid big payloads

    return NextResponse.json(noc);
  } catch (error) {
    console.error("❌ Error fetching NOC with that id:", error);
    return NextResponse.json({ error: "Failed to fetch NOC" }, { status: 500 });
  }
}


//put request
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } =await params;

  try {
    const formData = await req.formData();

    const updateData = {};
    for (const [key, value] of formData.entries()) {
      // Skip fields we don't want to update from form
      if (key === "approvals") continue;

      if (key === "proof") {
        // Handle file upload separately
        const file = value;
        if (file && file.size > 0) {
          const arrayBuffer = await file.arrayBuffer();
          updateData.proof = { data: Buffer.from(arrayBuffer), contentType: file.type };
        }
      } else {
        updateData[key] = value;
      }
    }

    const updatedApp = await Noc.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedApp) {
      return NextResponse.json({ error: "NOC application not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "NOC updated successfully", data: updatedApp });
  } catch (error) {
    console.error("Error updating NOC:", error);
    return NextResponse.json({ error: "Failed to update NOC" }, { status: 500 });
  }
}