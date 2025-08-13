"use client";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import toast from "react-hot-toast";

export default function EditApplicationPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const router = useRouter();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proofName, setProofName] = useState("");

  const branchOptions = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
  const yearOptions = ["E1", "E2", "E3", "E4"];

  useEffect(() => {
    async function fetchApplication() {
      if (!id || !typeParam) {
        toast.error("Application ID or type missing in URL");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url =
          typeParam.toLowerCase() === "noc"
            ? `/api/noc/${id}`
            : `/api/outpass/${id}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch application");

        const data = await res.json();
        setApplication({ ...data, type: typeParam });

        if (typeParam.toLowerCase() === "noc" && data.proof) {
          setProofName(data.proof.filename || "Uploaded file");
          console.log(proofName);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch application");
        setApplication(null);
        setLoading(false);
      }
    }

    fetchApplication();
  }, [id, typeParam]);

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
    if (!application) return;

    try {
      const url =
        application.type.toLowerCase() === "noc"
          ? `/api/noc/${id}`
          : `/api/outpass/${id}`;

      const formData = new FormData();
      for (const key in application) {
        if (key === "proof") {
          if (application.proof instanceof File) {
            formData.append("proof", application.proof);
          }
        } else if (application[key] !== undefined && application[key] !== null) {
          formData.append(key, application[key]);
        }
      }

      const res = await fetch(url, { method: "PUT", body: formData });

      if (res.ok) {
        toast.success("Application updated successfully!", { position: "top-center" });
        router.push(`/student/applications/${id}?type=${application.type}`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update application");
      }
    } catch (error) {
      console.error(error);
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <Card className="shadow-lg border rounded-xl">
        <CardContent>
          <Typography
            variant="h5"
            className="font-semibold text-indigo-700 mb-6 text-center sm:text-left"
          >
            Edit {application.type} Application
          </Typography>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            </div>

            {/* Reason */}
            <TextField
              label="Reason"
              name="reason"
              fullWidth
              multiline
              minRows={3}
              value={application.reason || ""}
              onChange={handleChange}
            />

            {/* NOC only */}
            {application.type.toLowerCase() === "noc" && (
              <>
                <TextField
                  label="Personal Mobile"
                  name="personalMobile"
                  fullWidth
                  value={application.personalMobile || ""}
                  onChange={handleChange}
                />
                <div>
                  <Typography variant="body2" className="mb-2 text-gray-700">
                    Upload Proof Document
                  </Typography>
                  <TextField
                    value={proofName || "No file chosen"}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    onClick={() => document.getElementById("proofInput").click()}
                  />
                  <input
                    type="file"
                    id="proofInput"
                    accept=".pdf,.jpg,.png"
                    hidden
                    onChange={handleFileChange}
                  />
                </div>
              </>
            )}

            {/* Outpass only */}
            {application.type.toLowerCase() === "outpass" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              </div>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
