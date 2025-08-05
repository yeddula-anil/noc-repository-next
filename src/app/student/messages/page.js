"use client";
import { useEffect, useState } from "react";
import MessageCard from "@/components/student-components/MessageCard";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("collegeEmail") || "vikasyeddula@gmail.com"
      : "vikasyeddula@gmail.com";

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages/byEmail/${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [email]);

  // handler to update message state when marked as read
  const handleMarkAsRead = (id) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === id ? { ...msg, isRead: true } : msg
      )
    );
  };

  if (loading) return <p className="text-gray-500">Loading messages...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">My Messages</h1>
      {messages.length > 0 ? (
        messages.map((msg) => (
          <MessageCard
            key={msg._id}
            msg={msg}
            onMarkAsRead={handleMarkAsRead} // pass handler
          />
        ))
      ) : (
        <p className="text-gray-500">No messages found</p>
      )}
    </div>
  );
}
