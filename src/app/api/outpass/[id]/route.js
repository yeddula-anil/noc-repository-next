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