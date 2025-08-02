"use client";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function MessageCard({ msg }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = msg.text.length > 100;
  const displayText =
    expanded || !isLong ? msg.text : msg.text.slice(0, 100) + "...";

  return (
    <div className="mb-5 p-4 border rounded-lg shadow-md bg-white">
      {/* Sender Info */}
      <Typography variant="body2" className="font-semibold text-indigo-700">
        From: {msg.sender}
      </Typography>
      <Typography variant="caption" className="block text-gray-500 mb-2">
        {msg.timestamp}
      </Typography>

      {/* Message Text */}
      <Typography variant="body1" className="text-gray-700 mb-3">
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-blue-600 hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </Typography>

      {/* PDF Attachment (like Gmail) */}
      {msg.pdf && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg bg-gray-50 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <PictureAsPdfIcon className="text-red-600" />
            <Typography variant="body2" className="font-medium text-gray-800 break-words">
              {msg.pdf.split("/").pop()}
            </Typography>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="contained"
              size="small"
              color="primary"
              href={msg.pdf}
              download
              className="w-full sm:w-auto"
            >
              Download
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => window.open(msg.pdf, "_blank")}
              className="w-full sm:w-auto"
            >
              Open
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
