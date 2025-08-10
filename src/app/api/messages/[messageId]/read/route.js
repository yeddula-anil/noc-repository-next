import Message from "../../../../../models/Message";
import dbConnect from "../../../../lib/dbConnect"
export async function PATCH(req, { params }) {
  await dbConnect();
  const { messageId } =await params;
  const updatedMsg = await Message.findByIdAndUpdate(
    messageId,
    { isRead: true },
    { new: true }
  );
  return new Response(JSON.stringify(updatedMsg), { status: 200 });
}