import dbConnect from "../../../../lib/dbConnect";
import Noc from "../../../../../models/Noc";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;  // ❌ no await here
    const body = await req.json().catch(() => ({}));
    const { action, remarks } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const noc = await Noc.findById(id);
    if (!noc) {
      return NextResponse.json({ error: "NOC not found" }, { status: 404 });
    }

    const currentApproval = noc.approvals.find((a) => a.status === "PENDING");

    if (!currentApproval) {
      return NextResponse.json({ error: "No pending stage found" }, { status: 400 });
    }

    // ✅ Update current stage
    currentApproval.status = action === "APPROVE" ? "APPROVED" : "REJECTED";
    currentApproval.remarks = remarks || "";
    currentApproval.updatedAt = new Date();

    if (action === "APPROVE") {
      const stageOrder = ["CARETAKER", "DSW", "FO_OFFICER", "DEAN", "DIRECTOR"];
      const nextStageIndex = stageOrder.indexOf(currentApproval.stage) + 1;

      if (nextStageIndex < stageOrder.length) {
        // Add next stage for review
        noc.approvals.push({
          stage: stageOrder[nextStageIndex],
          status: "PENDING",
          updatedAt: new Date(),
        });
        noc.status = "INPROGRESS";
      } else {
        // Final approval
        noc.status = "APPROVED";
      }
    } else {
      noc.status = "REJECTED";
    }

    await noc.save();

    return NextResponse.json(
      { message: `NOC ${action === "APPROVE" ? "approved" : "rejected"}`, data: noc },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating NOC:", error);
    return NextResponse.json({ error: "Failed to update NOC" }, { status: 500 });
  }
}
