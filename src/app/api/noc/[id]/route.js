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