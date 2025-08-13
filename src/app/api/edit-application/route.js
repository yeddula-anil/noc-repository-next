import dbConnect from "../../lib/dbConnect";
import Noc from "../../../models/Noc";
import Request from "../../../models/Request";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("applicationId");
  const applicationType = searchParams.get("applicationType"); // "noc" or "outpass"

  if (!applicationId || !applicationType) {
    return new Response(
      JSON.stringify({ error: "applicationId and applicationType are required" }),
      { status: 400 }
    );
  }

  let application;

  try {
    if (applicationType.toLowerCase() === "noc") {
      application = await Noc.findById(applicationId).select("-proof").lean();
    } else if (applicationType.toLowerCase() === "outpass") {
      application = await Request.findById(applicationId).lean();
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid applicationType" }),
        { status: 400 }
      );
    }

    if (!application) {
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(application), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}



