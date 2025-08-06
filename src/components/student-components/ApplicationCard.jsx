"use client";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function ApplicationCard({ app }) {
  // Decide chip color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "INPROGRESS":
         return "secondary"
      default:
        return "warning"; // Pending
    }
  };

  return (
    <Card className="shadow-md border rounded-lg p-0">
      <CardContent>
        {/* Header: Type & Status */}
        <div className="flex items-center justify-between mb-3">
          <Typography variant="h6" className="font-semibold text-indigo-700">
            {app.type} Application
          </Typography>
          <Chip
            label={app.status}
            color={getStatusColor(app.status)}
            size="small"
          />
        </div>

        {/* Applicant Name */}
        <Typography variant="body2" className="text-gray-700 mb-1">
          <span className="font-medium">Applicant:</span> {app.fullName}
        </Typography>

        {/* Reason */}
        <Typography variant="body2" className="text-gray-700 mb-1">
          <span className="font-medium">Reason:</span> {app.reason}
        </Typography>

        {/* Date */}
        <Typography variant="caption" className="text-gray-500 block mb-3">
          Submitted on: {new Date(app.createdAt).toLocaleString()}
        </Typography>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Link href={`/student/applications/${app._id}?type=${app.type}`}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className="w-full sm:w-auto"
            >
              View Details
            </Button>
          </Link>
          <Link href={`/student/applications/${app._id}/track?type=${app.type}`}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              className="w-full sm:w-auto"
            >
              Track Status
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
