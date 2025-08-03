"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";

export default function EditApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proofName, setProofName] = useState("");

  const branchOptions = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
  const yearOptions = ["1st", "2nd", "3rd", "4th"];

  useEffect(() => {
    const dummyApplications = [
      {
        id: "1",
        type: "NOC",
        fullName: "Vikas Yeddula",
        studentId: "20CS123",
        collegeEmail: "vikas@college.edu",
        personalMobile: "9876543210",
        branch: "CSE",
        year: "4th",
        reason: "For higher studies application",
        proof: "noc-proof.pdf",
      },
      {
        id: "2",
        type: "Outpass",
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
        proof: "outpass-proof.pdf",
      },
    ];
    const found = dummyApplications.find((app) => app.id === id);
    if (found) {
      setApplication(found);
      setProofName(found.proof);
    }
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofName(file.name);
      setApplication((prev) => ({ ...prev, proof: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Application updated successfully!", {
      position: "top-center",
    });
    router.push(`/student/applications/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!application) {
    return <p className="p-5 text-red-600">Application not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-1 sm:p-1">
      <Card className="shadow-lg border rounded-xl">
        <CardContent>
          {/* Heading with proper margin */}
          <div className="mb-10">
            <Typography
              variant="h5"
              className="font-semibold text-indigo-700"
            >
              Edit {application.type} Application
            </Typography>
          </div>

          {/* Form starts here */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Common fields */}
              <TextField
                label="Full Name"
                name="fullName"
                fullWidth
                value={application.fullName || ""}
                onChange={handleChange}
              />
              <TextField
                label="Student ID"
                name="studentId"
                fullWidth
                value={application.studentId || ""}
                onChange={handleChange}
              />
              <TextField
                label="College Email"
                name="collegeEmail"
                fullWidth
                value={application.collegeEmail || ""}
                onChange={handleChange}
              />

              {/* Dropdown for Branch */}
              <TextField
                select
                label="Branch"
                name="branch"
                fullWidth
                value={application.branch || ""}
                onChange={handleChange}
              >
                {branchOptions.map((branch) => (
                  <MenuItem key={branch} value={branch}>
                    {branch}
                  </MenuItem>
                ))}
              </TextField>

              {/* Dropdown for Year */}
              <TextField
                select
                label="Year"
                name="year"
                fullWidth
                value={application.year || ""}
                onChange={handleChange}
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Reason"
                name="reason"
                fullWidth
                multiline
                minRows={3}
                value={application.reason || ""}
                onChange={handleChange}
              />

              {/* NOC-specific */}
              {application.type === "NOC" && (
                <TextField
                  label="Personal Mobile"
                  name="personalMobile"
                  fullWidth
                  value={application.personalMobile || ""}
                  onChange={handleChange}
                />
              )}

              {/* Outpass-specific */}
              {application.type === "Outpass" && (
                <>
                  <TextField
                    label="Room No"
                    name="roomNo"
                    fullWidth
                    value={application.roomNo || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Personal Mobile"
                    name="personalMobile"
                    fullWidth
                    value={application.personalMobile || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Parent Mobile"
                    name="parentMobile"
                    fullWidth
                    value={application.parentMobile || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    label="From Date"
                    type="date"
                    name="fromDate"
                    fullWidth
                    value={application.fromDate || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="To Date"
                    type="date"
                    name="toDate"
                    fullWidth
                    value={application.toDate || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}

              {/* Proof Upload */}
              <div>
                <Typography variant="body2" className="mb-2 text-gray-700">
                  Upload Proof Document
                </Typography>
                <div className="flex gap-3 items-center">
                  <TextField
                    value={proofName || "No file chosen"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <Button variant="outlined" component="label">
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
