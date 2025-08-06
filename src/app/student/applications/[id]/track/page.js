"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { green, red, orange } from "@mui/material/colors";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function TrackApplicationPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [application, setApplication] = useState(null);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSmallScreen = useMediaQuery("(max-width:640px)");

  // 🔹 Define master stages
  const masterStages = {
    NOC: ["Student Submitted", "Caretaker", "Dean of Students Welfare", "HOD", "Dean","Fo_Officer","Director"],
    Outpass: ["Student Submitted", "Caretaker"],
  };

  useEffect(() => {
  async function fetchApplication() {
    try {
      const endpoint =
        type === "NOC"
          ? `/api/applications/track/noc/${id}`
          : `/api/applications/track/outpass/${id}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setApplication(data);

      let approvalSteps = [];

      if (type === "NOC") {
        const approvalMap = {};
        data.approvals.forEach((a) => {
          approvalMap[a.stage] = a.status;
        });

        approvalSteps = masterStages.NOC.map((stage) => {
          if (stage === "Student Submitted") {
            return { label: stage, status: "APPROVED" };
          }
          return {
            label: stage,
            status: approvalMap[stage] || "PENDING",
          };
        });
      } else if (type === "OUTPASS") {
        approvalSteps = [
          { label: "Student Submitted", status: "APPROVED" },
          { label: "Caretaker", status: data.status },
        ];
      }

      setSteps(approvalSteps);
    } catch (err) {
      console.error("Error fetching application:", err);
    } finally {
      setLoading(false);
    }
  }

  if (id && type) fetchApplication();
}, [id, type]);


  const getStepIcon = (status) => {
    if (status === "APPROVED") {
      return <CheckCircleIcon style={{ color: green[500] }} />;
    } else if (status === "REJECTED") {
      return <CancelIcon style={{ color: red[500] }} />;
    } else {
      return <HourglassEmptyIcon style={{ color: orange[500] }} />;
    }
  };

  const isFinalApproved =
    steps.length > 0 && steps.every((step) => step.status === "APPROVED");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Typography variant="h6">Loading application...</Typography>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex justify-center items-center h-40">
        <Typography variant="h6" color="error">
          Application not found
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-6">
      <Card className="shadow-lg border rounded-xl">
        <CardContent>
          <Typography
            variant="h5"
            className="font-semibold text-indigo-700 mb-8 text-center"
          >
            Track {type} Application Status
          </Typography>

          {/* Application Info */}
          <div className="mb-6">
            <Typography><b>Full Name:</b> {application.fullName}</Typography>
            <Typography><b>Student ID:</b> {application.studentId}</Typography>
            <Typography><b>Email:</b> {application.collegeEmail}</Typography>
            <Typography><b>Branch:</b> {application.branch}</Typography>
            <Typography><b>Year:</b> {application.year}</Typography>
            <Typography><b>Reason:</b> {application.reason}</Typography>
          </div>

          {/* Stepper */}
          <Stepper
            activeStep={steps.findIndex(
              (s) => s.status === "PENDING" || s.status === "INPROGRESS"
            )}
            orientation={isSmallScreen ? "vertical" : "horizontal"}
            alternativeLabel={!isSmallScreen}
          >
            {steps.map((step, index) => (
              <Step key={index} completed={step.status === "APPROVED"}>
                <StepLabel icon={getStepIcon(step.status)}>
                  <Typography
                    variant="body1"
                    style={{
                      color:
                        step.status === "APPROVED"
                          ? green[700]
                          : step.status === "REJECTED"
                          ? red[700]
                          : orange[700],
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{
                      color:
                        step.status === "APPROVED"
                          ? green[500]
                          : step.status === "REJECTED"
                          ? red[500]
                          : orange[500],
                    }}
                  >
                    {step.status}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Final Approval Messages */}
          {isFinalApproved && type === "NOC" && (
            <div className="mt-6 text-center">
              <Typography variant="h6" className="text-green-700">
                🎉 Your NOC has been fully approved.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className="mt-4"
                onClick={() => alert("NOC PDF downloaded (dummy)!")}
              >
                Download NOC PDF
              </Button>
            </div>
          )}

          {isFinalApproved && type === "Outpass" && (
            <div className="mt-6 text-center">
              <Typography variant="h6" className="text-green-700">
                ✅ Your Outpass has been approved by Caretaker.
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
