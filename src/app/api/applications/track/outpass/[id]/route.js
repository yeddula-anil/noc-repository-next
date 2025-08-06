import dbConnect from "../../../../../lib/dbConnect";
import Request from "../../../../../../models/Request";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const {id}=await params
    const outpass = await Request.findById(id).select("-proof").lean();
    if (!outpass) {
      return NextResponse.json({ error: "Outpass not found" }, { status: 404 });
    }
    return NextResponse.json(outpass);
  } catch (err) {
    console.error("Error fetching Outpass:", err);
    return NextResponse.json({ error: "Failed to fetch Outpass" }, { status: 500 });
  }
}
