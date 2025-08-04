import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export async function GET() {
  try {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=test.pdf",
        },
      });
    });

    // ✅ Force Courier font to avoid Helvetica issue
    doc.font("Courier")
      .fontSize(20)
      .text("PDFKit Test", { align: "center" })
      .moveDown()
      .fontSize(14)
      .text("This is a test PDF generated from Next.js API route.");

    doc.end();
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
