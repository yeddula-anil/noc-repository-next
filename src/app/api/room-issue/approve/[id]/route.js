import { NextResponse } from "next/server";
import dbconnect from "../../../../lib/dbConnect";
import RoomIssue from "../../../../../models/RoomIssue";
import Message from "../../../../../models/Message";
import nodemailer from "nodemailer";

export async function POST(req, { params }) {
  const { id } = params;

  await dbconnect();

  try {
    const issue = await RoomIssue.findById(id);

    if (!issue) {
      return NextResponse.json({ error: "Room issue not found" }, { status: 404 });
    }

    if (issue.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending issues can be approved" }, { status: 400 });
    }

    issue.status = "APPROVED";
    await issue.save();

    // Setup nodemailer transporter using your env config
    const transporter = nodemailer.createTransport({
      host: process.env.GMAIL_SERVER,
      port: Number(process.env.GMAIL_PORT),
      secure: process.env.GMAIL_SECURE === "true",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_FROM,
      to: issue.email,
      subject: "Your room issue has been approved",
      text: `Dear ${issue.fullName},

Your reported room issue has been approved and will be resolved within 2 days.

Thank you for your patience.

Best regards,
Hostel Management Team`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Save message record in database
    await Message.create({
      sender: process.env.GMAIL_USER,
      receiverEmail: issue.email,
      subject: mailOptions.subject,
      content: mailOptions.text,
    });

    return NextResponse.json({ message: "Issue approved, email sent & logged successfully" });
  } catch (error) {
    console.error("Error approving issue:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
