import dbConnect from "../../../../lib/dbConnect";
import Noc from "../../../../../models/Noc";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  await dbConnect();

  try {
    const { params } = context; // ✅ destructure context
    const { id } = await params; // ✅ await params

    const noc = await Noc.findById(id);
    if (!noc || !noc.proof || !noc.proof.data) {
      return NextResponse.json({ error: "No proof found" }, { status: 404 });
    }

    return new NextResponse(noc.proof.data.buffer, {
      headers: {
        "Content-Type": noc.proof.contentType || "application/pdf",
        "Content-Disposition": `inline; filename="proof.pdf"`,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching proof:", error);
    return NextResponse.json({ error: "Failed to fetch proof" }, { status: 500 });
  }
}
