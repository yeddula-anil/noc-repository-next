import dbConnect from "../../../../../lib/dbConnect";
import Message from "../../../../../../models/Message";

export async function GET(req, { params }) {
  await dbConnect();

  const { messageId, index } =await params;
  const msg = await Message.findById(messageId);

  if (!msg || !msg.attachments[index]) {
    return new Response(JSON.stringify({ error: "Attachment not found" }), {
      status: 404,
    });
  }

  const attachment = msg.attachments[index];

  return new Response(attachment.data, {
    status: 200,
    headers: {
      "Content-Type": attachment.contentType,
      "Content-Disposition": `inline; filename="${attachment.filename}"`,
    },
  });
}
