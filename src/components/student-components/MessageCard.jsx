"use client";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function MessageCard({ msg }) {
  const [expanded, setExpanded] = useState(false);
  const [isRead, setIsRead] = useState(msg.isRead);

  const isLong = msg.content.length > 100;
  const displayText =
    expanded || !isLong ? msg.content : msg.content.slice(0, 100) + "...";

  const handleToggleExpand = async () => {
    // Expand/collapse text
    setExpanded(!expanded);

    // If message is not read, mark it as read
    if (!isRead) {
      try {
        const res = await fetch(`/api/messages/${msg._id}/read`, {
          method: "PATCH",
        });
        if (res.ok) {
          setIsRead(true); // update local state
        } else {
          console.error("Failed to mark message as read");
        }
      } catch (err) {
        console.error("Error marking message as read:", err);
      }
    }
  };

  return (
    <div className="mb-5 p-4 border rounded-lg shadow-md bg-white">
      {/* Sender Info */}
      <Typography variant="body2" className="font-semibold text-indigo-700">
        From: {msg.sender}
      </Typography>
      <Typography variant="caption" className="block text-gray-500 mb-2">
        {new Date(msg.createdAt).toLocaleString()}
      </Typography>

      {/* Message Text */}
      <Typography
        variant="body1"
        className={`text-gray-700 mb-3 ${!isRead ? "font-bold" : ""}`}
      >
        {displayText}
        {isLong && (
          <button
            onClick={handleToggleExpand}
            className="ml-1 text-blue-600 hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </Typography>

      {/* PDF Attachments */}
      {msg.attachments?.length > 0 &&
        msg.attachments.map((file, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg bg-gray-50 space-y-3 sm:space-y-0 mt-2"
          >
            <div className="flex items-center space-x-3">
              <PictureAsPdfIcon className="text-red-600" />
              <Typography
                variant="body2"
                className="font-medium text-gray-800 break-words"
              >
                {file.filename}
              </Typography>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="contained"
                size="small"
                color="primary"
                href={`/api/messages/${msg._id}/attachment/${index}`}
                download={file.filename}
                className="w-full sm:w-auto"
              >
                Download
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() =>
                  window.open(
                    `/api/messages/${msg._id}/attachment/${index}`,
                    "_blank"
                  )
                }
                className="w-full sm:w-auto"
              >
                Open
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
