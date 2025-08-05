import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Readable } from "stream";
import Message from "../../../../models/Message";
import dbConnect from "../../../lib/dbConnect"; 
import Request from "../../../../models/Request"; // Your mongoose model

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Function to generate PDF
const generateOutpassPDF = (outpass) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // ✅ Set Courier immediately to avoid Helvetica lookup
      doc.font("Courier");

      doc.fontSize(20).text("College Outpass", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Name: ${outpass.fullName}`);
      doc.text(`ID: ${outpass.studentId}`);
      doc.text(`Branch: ${outpass.branch || "N/A"}`);
      doc.text(`Year: ${outpass.year}`);
      doc.text(`Reason: ${outpass.reason}`);
      doc.text(`Status: APPROVED`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};



export async function POST(req) {
  try {
    await dbConnect();
    const { outpassId, action, rejectionReason } = await req.json();

    const outpass = await Request.findById(outpassId);
    if (!outpass) {
      return NextResponse.json({ error: "Outpass not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      outpass.status = "APPROVED";
      await outpass.save();

      // Generate PDF
    //   const pdfBuffer = await generateOutpassPDF(outpass);

      // Send approval mail with PDF
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: outpass.collegeEmail,
        subject: "Outpass Approved ✅",
        text: `Dear ${outpass.fullName}, your outpass has been approved.`,
        // attachments: [
        //   {
        //     filename: "Outpass.pdf",
        //     content: pdfBuffer,
        //   },
        // ],
      });

      await Message.create({
        sender: "Caretaker",
        receiverEmail: outpass.collegeEmail,
        subject: "Outpass Approved ✅",
        content: `Dear ${outpass.fullName}, your outpass has been approved.`,
      //   attachments: [
      //     {
      //       filename: "Outpass.pdf",
      //       data: pdfBuffer,
      //       contentType: "application/pdf",
      //     },
      //   ],
        });
      console.log("email successfully sent")

      return NextResponse.json({ message: "Outpass approved and email sent" });
    }

    if (action === "REJECT") {
      outpass.status = "REJECTED";
      await outpass.save();

      // Send rejection mail
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: outpass.collegeEmail,
        subject: "Outpass Rejected ❌",
        text: `Dear ${outpass.fullName}, your outpass request has been rejected.\n\n due to this Reason: ${rejectionReason}`,
      });

      await Message.create({
        sender: "Caretaker",
        receiverEmail: outpass.collegeEmail,
        subject: "Outpass Rejected ❌",
        content: `Dear ${outpass.fullName}, your outpass request has been rejected.\n\nReason: ${rejectionReason}`,
      });

      return NextResponse.json({ message: "Outpass rejected and email sent" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}





// Fetch outpasses by year (oldest first)
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");

    if (!year || !["E1", "E2", "E3", "E4"].includes(year)) {
      return NextResponse.json(
        { success: false, message: "Year must be one of E1, E2, E3, E4" },
        { status: 400 }
      );
    }

    const outpasses = await Request.find({ type: "OUTPASS", year })
      .sort({ createdAt: 1 }); // oldest first

    return NextResponse.json(
      { success: true, count: outpasses.length, data: outpasses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching outpasses:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}



