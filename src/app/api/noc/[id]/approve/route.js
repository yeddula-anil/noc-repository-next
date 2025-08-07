import dbConnect from "../../../../lib/dbConnect";
import Noc from "../../../../../models/Noc";
import Message from "../../../../../models/Message";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    const { id } =await params;
    const body = await req.json().catch(() => ({}));
    const { action, remarks } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const noc = await Noc.findById(id).select("-proof");
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

    let subject, content;

    if (action === "APPROVE") {
      const stageOrder = ["CARETAKER", "DSW","HOD","DEAN","FO_OFFICE", "DIRECTOR"];
      const nextStageIndex = stageOrder.indexOf(currentApproval.stage) + 1;

      if (nextStageIndex < stageOrder.length) {
        
        noc.approvals.push({
          stage: stageOrder[nextStageIndex],
          status: "PENDING",
          updatedAt: new Date(),
        });
        noc.status = "INPROGRESS";
        subject = `NOC moved to ${stageOrder[nextStageIndex]} for review`;
        content = `Dear ${noc.fullName}, your NOC request has been approved by ${currentApproval.stage} and is now under review by ${stageOrder[nextStageIndex]}.`;
      } else {
        // Final approval
        noc.status = "APPROVED";
        subject = "NOC Approved ✅";
        content = `Dear ${noc.fullName}, your NOC has been approved successfully.`;
      }
    } else {
      noc.status = "REJECTED";
      subject = "NOC Rejected ❌";
      content = `Dear ${noc.fullName}, your NOC request has been rejected by ${currentApproval.stage}. Reason: ${remarks || "No remarks provided"}.`;
    }

    await noc.save();

    // 📩 Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: noc.collegeEmail,
      subject,
      text: content,
    });

    // 💾 Save message in DB
    await Message.create({
      sender: currentApproval.stage,
      receiverEmail: noc.collegeEmail,
      subject,
      content,
      isRead: false,
    });

    return NextResponse.json(
      { message: `NOC ${action === "APPROVE" ? "approved" : "rejected"}`, data: noc },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating NOC:", error);
    return NextResponse.json({ error: "Failed to update NOC" }, { status: 500 });
  }
}
