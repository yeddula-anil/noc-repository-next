import dbConnect from "../../../../lib/dbConnect";
import Noc from "../../../../../models/Noc";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    const { id } =await params;
    const { remarks } = await req.json();

    if (!remarks || remarks.trim() === "") {
      return NextResponse.json({ error: "Remarks are required" }, { status: 400 });
    }

    const noc = await Noc.findById(id);
    if (!noc) {
      return NextResponse.json({ error: "NOC not found" }, { status: 404 });
    }

    // Update status and approvals
    noc.status = "REJECTED";
    noc.approvals.push({
      stage: "CARETAKER",
      status: "REJECTED",
      remarks,
      updatedAt: new Date(),
    });

    await noc.save();

    return NextResponse.json({ message: "NOC rejected successfully", data: noc });
  } catch (error) {
    console.error("❌ Error rejecting NOC:", error);
    return NextResponse.json({ error: "Failed to reject NOC" }, { status: 500 });
  }
}
