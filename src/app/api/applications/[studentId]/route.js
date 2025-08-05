import dbConnect from "../../../lib/dbConnect";
import Noc from "../../../../models/Noc";
import Request from "../../../../models/Request";

export async function GET(req, { params }) {
  await dbConnect();

  const { studentId } = await params; // comes from [studentId]
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");

  if (!studentId) {
    return new Response(JSON.stringify({ error: "Student ID is required" }), {
      status: 400,
    });
  }

  const filter = { studentId };
  if (year) filter.year = year;

  const [nocApps, outpassApps] = await Promise.all([
    Noc.find(filter).lean(),
    Request.find(filter).lean(),
  ]);

  const combinedApps = [...nocApps, ...outpassApps];

  combinedApps.sort(
    (a, b) =>
      new Date(b.timestamp || b.createdAt) -
      new Date(a.timestamp || a.createdAt)
  );

  return new Response(JSON.stringify(combinedApps), { status: 200 });
}
