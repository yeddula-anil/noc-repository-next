"use client";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Application from "@/components/student-components/ApplicationCard"; // import the Application component

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading,setLoading]=useState(true);

 

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
      finally{
        setLoading(false);
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
          {loading ? "Loading Applications":"No Applications found for the user"}
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
