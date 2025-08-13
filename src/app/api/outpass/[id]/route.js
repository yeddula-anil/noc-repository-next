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

  try {
    const { id } = params;
    const data = await req.json();

    // Convert date strings to Date objects
    if (data.fromDate) data.fromDate = new Date(data.fromDate);
    if (data.toDate) data.toDate = new Date(data.toDate);

    // Update document with type "OUTPASS" only
    const updated = await Request.findOneAndUpdate(
      { _id: id, type: "OUTPASS" },
      data,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Outpass application not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ Error updating Outpass:", error);
    return NextResponse.json({ error: "Failed to update Outpass application" }, { status: 500 });
  }
}