"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    // Mock data (replace with API call)
    const allApplications = [
      {
        id: "1",
        type: "NOC",
        status: "Pending",
        timestamp: "2025-07-28T10:30:00",
        fullName: "Vikas Yeddula",
        studentId: "20CS123",
        collegeEmail: "vikas@college.edu",
        personalMobile: "9876543210",
        branch: "CSE",
        year: "4th",
        reason: "For higher studies application",
        proof: "/docs/noc-proof.pdf",
      },
      {
        id: "2",
        type: "Outpass",
        status: "Approved",
        timestamp: "2025-08-01T09:15:00",
        fullName: "Vikas Yeddula",
        studentId: "20CS123",
        collegeEmail: "vikas@college.edu",
        roomNo: "B-203",
        personalMobile: "9876543210",
        parentMobile: "9876501234",
        branch: "CSE",
        year: "4th",
        reason: "Family Function",
        fromDate: "2025-08-05",
        toDate: "2025-08-07",
        proof: "/docs/outpass-proof.pdf",
      },
    ];

    const found = allApplications.find((app) => app.id === id);
    setApplication(found);
  }, [id]);

  if (!application) {
    return (
      <div className="max-w-2xl mx-auto p-5">
        <Typography variant="h6" className="text-gray-600">
          Loading application details...
        </Typography>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <Card className="shadow-md border rounded-lg">
        <CardContent>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <Typography variant="h5" className="font-semibold text-indigo-700">
              {application.type} Application Details
            </Typography>
            <Chip
              label={application.status}
              color={getStatusColor(application.status)}
            />
          </div>

          {/* Common */}
          <Typography variant="body1" className="mb-2">
            <strong>Submitted On:</strong>{" "}
            {new Date(application.timestamp).toLocaleString()}
          </Typography>

          {/* Fields based on type */}
          {application.type === "NOC" && (
            <>
              <Typography variant="body1" className="mb-2">
                <strong>Full Name:</strong> {application.fullName}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Student ID:</strong> {application.studentId}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>College Email:</strong> {application.collegeEmail}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Mobile:</strong> {application.personalMobile}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Branch:</strong> {application.branch}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Year:</strong> {application.year}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Reason:</strong> {application.reason}
              </Typography>
              {application.proof && (
                <Typography variant="body1" className="mb-2">
                  <strong>Proof Document:</strong>{" "}
                  <a
                    href={application.proof}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Proof
                  </a>
                </Typography>
              )}
            </>
          )}

          {application.type === "Outpass" && (
            <>
              <Typography variant="body1" className="mb-2">
                <strong>Full Name:</strong> {application.fullName}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Student ID:</strong> {application.studentId}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>College Email:</strong> {application.collegeEmail}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Room No:</strong> {application.roomNo}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Personal Mobile:</strong> {application.personalMobile}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Parent Mobile:</strong> {application.parentMobile}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Branch:</strong> {application.branch}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Year:</strong> {application.year}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>Reason:</strong> {application.reason}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>From Date:</strong> {application.fromDate}
              </Typography>
              <Typography variant="body1" className="mb-2">
                <strong>To Date:</strong> {application.toDate}
              </Typography>
              {application.proof && (
                <Typography variant="body1" className="mb-2">
                  <strong>Proof Document:</strong>{" "}
                  <a
                    href={application.proof}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Proof
                  </a>
                </Typography>
              )}
            </>
          )}

          {/* Edit Button if Pending */}
          {application.status === "Pending" && (
            <div className="mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  router.push(`/student/applications/${id}/edit`)
                }
              >
                Edit Application
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
