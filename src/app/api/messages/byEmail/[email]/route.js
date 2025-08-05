import dbConnect from "../../../../lib/dbConnect";
import Message from "../../../../../models/Message";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { email } =await params;
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    // Fetch messages for the given email
    const messages = await Message.find({ receiverEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    // Count unread messages
    const unreadCount = messages.reduce(
      (count, msg) => count + (msg.isRead ? 0 : 1),
      0
    );

    return new Response(JSON.stringify({ messages, unreadCount }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}


