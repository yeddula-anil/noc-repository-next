"use client";
import { useState, useEffect } from "react";
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
  // 🔹 Dummy application type (you can replace with actual data)
  const [applicationType, setApplicationType] = useState("NOC"); // change to "Outpass" to test
  const [status, setStatus] = useState({
    caretaker: "Approved",
    dosw: "Approved",
    hod: "Pending",
    dean: "Pending",
    director: "Pending",
  });

  // 🔹 Define steps based on application type
  const steps =
    applicationType === "NOC"
      ? [
          { label: "Student Submitted", status: "Approved" },
          { label: "Caretaker", status: status.caretaker },
          { label: "Dean of Students Welfare", status: status.dosw },
          { label: "HOD", status: status.hod },
          { label: "Dean", status: status.dean },
          { label: "Director", status: status.director },
        ]
      : [
          { label: "Student Submitted", status: "Approved" },
          { label: "Caretaker", status: status.caretaker },
        ];

  const getStepIcon = (stepStatus) => {
    if (stepStatus === "Approved") {
      return <CheckCircleIcon style={{ color: green[500] }} />;
    } else if (stepStatus === "Rejected") {
      return <CancelIcon style={{ color: red[500] }} />;
    } else {
      return <HourglassEmptyIcon style={{ color: orange[500] }} />;
    }
  };

  const isFinalApproved = steps.every((step) => step.status === "Approved");

  // Responsive layout
  const isSmallScreen = useMediaQuery("(max-width:640px)");

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-6">
      <Card className="shadow-lg border rounded-xl">
        <CardContent>
          <Typography
            variant="h5"
            className="font-semibold text-indigo-700 mb-8 text-center"
          >
            Track {applicationType} Application Status
          </Typography>

          <Stepper
            activeStep={
              steps.findIndex((s) => s.status === "Pending" || s.status === "Rejected")
            }
            orientation={isSmallScreen ? "vertical" : "horizontal"}
            alternativeLabel={!isSmallScreen}
          >
            {steps.map((step, index) => (
              <Step key={index} completed={step.status === "Approved"}>
                <StepLabel icon={getStepIcon(step.status)}>
                  <Typography
                    variant="body1"
                    style={{
                      color:
                        step.status === "Approved"
                          ? green[700]
                          : step.status === "Rejected"
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
                        step.status === "Approved"
                          ? green[500]
                          : step.status === "Rejected"
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

          {isFinalApproved && applicationType === "NOC" && (
            <div className="mt-6 text-center">
              <Typography variant="h6" className="text-green-700">
                🎉 Your NOC has been approved by Director.
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

          {isFinalApproved && applicationType === "Outpass" && (
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
