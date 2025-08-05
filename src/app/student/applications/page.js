"use client";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Application from "@/components/student-components/ApplicationCard"; // import the Application component

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);

  // Get current studentId (replace with JWT/auth logic if needed)
  const studentId =
    typeof window !== "undefined"
      ? localStorage.getItem("studentId") || "R200907"
      : "R200907";

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch(`/api/applications/${encodeURIComponent(studentId)}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch applications: ${res.status}`);
        }

        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    }

    fetchApplications();
  }, [studentId]);

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
            <Application key={app._id || app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
