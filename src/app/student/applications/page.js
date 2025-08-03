"use client";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Application from "@/components/student-components/ApplicationCard"; // import the Application component

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);

  // Example: get current user (replace with your auth logic or JWT)
  const currentUser = localStorage.getItem("username") || "Vikas Yeddula";

  useEffect(() => {
    // Example applications (replace with API fetch)
    const allApplications = [
      {
        id: 1,
        user: "Vikas Yeddula",
        type: "NOC",
        reason: "Applying for NOC",
        status: "Pending",
        timestamp: "2025-07-28T10:30:00",
      },
      {
        id: 2,
        user: "John Doe",
        type: "Outpass",
        reason: "Weekend Leave",
        status: "Approved",
        timestamp: "2025-07-30T14:45:00",
      },
      {
        id: 3,
        user: "Vikas Yeddula",
        type: "Outpass",
        reason: "Family Function",
        status: "Approved",
        timestamp: "2025-08-01T09:15:00",
      },
    ];

    // Filter for current user's NOC/Outpass applications
    const userApps = allApplications.filter(
      (app) =>
        app.user === currentUser &&
        (app.type === "NOC" || app.type === "Outpass")
    );

    // Sort recent first
    const sortedApps = [...userApps].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setApplications(sortedApps);
  }, [currentUser]);

  return (
    <div className="max-w-2xl mx-auto p-5">
      <Typography variant="h5" className="mb-4 font-bold text-indigo-700">
        My Applications
      </Typography>

      {applications.length === 0 ? (
        <Typography variant="body1" className="text-gray-500">
          No applications found for the user!!!
        </Typography>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Application key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
