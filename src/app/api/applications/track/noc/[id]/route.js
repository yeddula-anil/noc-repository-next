import dbConnect from "../../../../../lib/dbConnect";
import Noc from "../../../../../../models/Noc";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const {id}=await params;
    const noc = await Noc.findById(id).select("-proof").lean();
    if (!noc) {
      return NextResponse.json({ error: "NOC not found" }, { status: 404 });
    }
    return NextResponse.json(noc);
  } catch (err) {
    console.error("Error fetching NOC:", err);
    return NextResponse.json({ error: "Failed to fetch NOC" }, { status: 500 });
  }
}
