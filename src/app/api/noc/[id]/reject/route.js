import dbConnect from "../../../../../../lib/dbConnect";
import Noc from "../../../../../../../models/Noc";
import Message from "../../../../../../../models/Message";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Nodemailer setup
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
    const { remarks } = body;

    const noc = await Noc.findById(id).select("-proof");
    if (!noc) {
      return NextResponse.json({ error: "NOC not found" }, { status: 404 });
    }

    const currentApproval = noc.approvals.find((a) => a.status === "PENDING");
    if (!currentApproval) {
      return NextResponse.json({ error: "No pending stage found" }, { status: 400 });
    }

    // ❌ Reject current stage
    currentApproval.status = "REJECTED";
    currentApproval.remarks = remarks || "No remarks provided";
    currentApproval.updatedAt = new Date();
    noc.status = "REJECTED";

    await noc.save();

    const subject = "NOC Rejected ❌";
    const content = `Dear ${noc.fullName},

Your NOC request has been rejected by ${currentApproval.stage}.
Reason: ${remarks || "No remarks provided"}.

Application Details:
- Student ID: ${noc.studentId}
- Branch: ${noc.branch}
- Year: ${noc.year}
- Reason: ${noc.reason}

Regards,
University Administration
`;

    // 📧 Send rejection email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: noc.collegeEmail,
      subject,
      text: content,
    });

    // 💾 Save rejection message in DB
    await Message.create({
      sender: currentApproval.stage,
      receiverEmail: noc.collegeEmail,
      subject,
      content,
      isRead: false,
    });

    return NextResponse.json(
      { message: "NOC rejected successfully", data: noc },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error rejecting NOC:", error);
    return NextResponse.json({ error: "Failed to reject NOC" }, { status: 500 });
  }
}
