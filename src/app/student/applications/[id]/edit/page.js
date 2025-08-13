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
    async function fetchApplication() {
      setLoading(true);
      try {
        // First, try to fetch from both APIs to find which exists
        // But since you want to decide by type, we first try NOC then Outpass
        // Or alternatively, have a backend API that returns type or you pass type as param.
        // Here, I'll try to fetch both and pick whichever returns 200

        // Try NOC API
        let res = await fetch(`/api/noc/${id}`);
        if (res.ok) {
          const data = await res.json();
          setApplication({ ...data, type: "NOC" });
          setProofName(data.proof || "");
          setLoading(false);
          return;
        }

        // If no NOC, try Outpass API
        res = await fetch(`/api/outpass/${id}`);
        if (res.ok) {
          const data = await res.json();
          setApplication({ ...data, type: "Outpass" });
          setProofName(data.proof || "");
          setLoading(false);
          return;
        }

        // If neither API returned ok
        setApplication(null);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch application:", error);
        setApplication(null);
        setLoading(false);
      }
    }

    fetchApplication();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = "";
      if (application.type === "NOC") {
        url = `/api/noc/${id}`;
      } else if (application.type === "OUTPASS") {
        url = `/api/outpass/${id}`;
      } else {
        toast.error("Unknown application type");
        return;
      }

      const formData = new FormData();

      // Append all fields except proof if proof is file, else keep as string
      for (const key in application) {
        if (key === "proof") {
          if (application.proof instanceof File) {
            formData.append("proof", application.proof);
          } else if (typeof application.proof === "string") {
            // If proof is string (existing filename), optionally skip or send as is
            // Depends on backend, here we skip to avoid overwriting file with string
          }
        } else if (application[key] !== undefined && application[key] !== null) {
          formData.append(key, application[key]);
        }
      }

      const res = await fetch(url, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        toast.success("Application updated successfully!", {
          position: "top-center",
        });
        router.push(`/student/applications/${id}`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update application");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Error updating application");
    }
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
            <Typography variant="h5" className="font-semibold text-indigo-700">
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

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
