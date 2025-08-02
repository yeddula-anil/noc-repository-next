"use client";
import MessageCard from "@/components/student-components/MessageCard";

export default function MessagesPage() {
  // Example messages
  const messages = [
    {
      id: 1,
      sender: "Admin",
      text: "Your NOC request has been approved. Please collect your document from the office. The PDF is attached below.",
      pdf: "/pdfs/noc_approval.pdf",
      timestamp: "2025-08-01 18:30",
    },
    {
      id: 2,
      sender: "Warden",
      text: "Please collect your outpass tomorrow from the hostel office.",
      pdf: null,
      timestamp: "2025-08-01 14:10",
    },
    {
      id: 3,
      sender: "Faculty",
      text: "A meeting has been scheduled at 4 PM today in Room 204. Attendance is compulsory for all students.",
      pdf: "/pdfs/meeting_schedule.pdf",
      timestamp: "2025-07-31 20:45",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">My Messages</h1>
      {messages.length > 0 ? (
        messages.map((msg) => <MessageCard key={msg.id} msg={msg} />)
      ) : (
        <p className="text-gray-500">No messages found</p>
      )}
    </div>
  );
}
