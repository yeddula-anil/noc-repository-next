"use client";

import { useState, useEffect, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import toast, { Toaster } from "react-hot-toast";

export default function DswNOCsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [queries, setQueries] = useState([]);
  const [yearFilter, setYearFilter] = useState("");
  const [sortOrder] = useState("asc");
  const [openModal, setOpenModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Fetch DSW NOCs
  useEffect(() => {
    const fetchNOCs = async () => {
      try {
        const queryString = yearFilter ? `?year=${yearFilter}&stage=DSW` : "?stage=DSW";
        const res = await fetch(`/api/dsw/nocs${queryString}`);
        if (!res.ok) throw new Error("Failed to fetch NOCs");

        const data = await res.json();

        if (!Array.isArray(data)) {
          setQueries([]);
          return;
        }

        const formatted = data.map((noc) => {
          const dswApproval = noc.approvals?.find((a) => a.stage === "DSW");
          return {
            id: noc._id,
            student: noc.fullName,
            studentId: noc.studentId,
            collegeEmail: noc.collegeEmail,
            branch: noc.branch,
            year: noc.year,
            reason: noc.reason,
            documentUrl: noc._id,
            status: dswApproval?.status || "PENDING",
            rejectReason: dswApproval?.status === "REJECTED" ? dswApproval?.remarks : null,
            timestamp: noc.createdAt,
          };
        });

        setQueries(formatted);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load NOC applications", { position: "top-center" });
      }
    };
    fetchNOCs();
  }, [yearFilter]);

  // Filter + sort
  const filteredQueries = useMemo(() => {
    let filtered = queries;
    if (statusFilter !== "All") {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }
    return filtered.sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [statusFilter, sortOrder, queries]);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  // Approve via backend
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/noc/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve");

      setQueries((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: "APPROVED" } : q))
      );

      toast.success("Application approved successfully!", { position: "top-center" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve", { position: "top-center" });
    }
  };

  // Reject modal open
  const handleReject = (id) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  // Submit rejection
  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason", { position: "top-center" });
      return;
    }
    try {
      const res = await fetch(`/api/dsw/nocs/${selectedId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks: rejectReason }),
      });

      if (!res.ok) throw new Error("Failed to reject application");

      setQueries((prev) =>
        prev.map((q) =>
          q.id === selectedId ? { ...q, status: "REJECTED", rejectReason } : q
        )
      );

      toast.error("Application rejected", { position: "top-center" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject", { position: "top-center" });
    }
    setOpenModal(false);
    setRejectReason("");
    setSelectedId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <Toaster />

      {/* Hero Section */}
      <div className="text-center mb-8">
        <Typography variant="h4" className="font-bold text-indigo-700 mb-2">
          NOC Requests for DSW Approval
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Review and take action on NOC applications.
        </Typography>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
        <FormControl className="w-full sm:w-1/3">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </Select>
        </FormControl>

        <FormControl className="w-full sm:w-1/3">
          <InputLabel>Year</InputLabel>
          <Select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <MenuItem value="">All Years</MenuItem>
            <MenuItem value="E1">1st Year</MenuItem>
            <MenuItem value="E2">2nd Year</MenuItem>
            <MenuItem value="E3">3rd Year</MenuItem>
            <MenuItem value="E4">4th Year</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-200 text-indigo-900 font-semibold">
              <th className="p-3 border">Student</th>
              <th className="p-3 border">Student ID</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Branch</th>
              <th className="p-3 border">Year</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">Document</th>
              <th className="p-3 border">DSW Status</th>
              <th className="p-3 border">Rejection Reason</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50 text-gray-800">
                <td className="p-3 border">{q.student}</td>
                <td className="p-3 border">{q.studentId}</td>
                <td className="p-3 border">{q.collegeEmail}</td>
                <td className="p-3 border">{q.branch}</td>
                <td className="p-3 border">{q.year}</td>
                <td className="p-3 border">{q.reason}</td>
                <td className="p-3 border">
                  {q.documentUrl ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        window.open(`/api/noc/${q.documentUrl}/proof`, "_blank")
                      }
                    >
                      View Document
                    </Button>
                  ) : (
                    <span className="text-gray-500">No document</span>
                  )}
                </td>
                <td className="p-3 border">
                  <Chip label={q.status} color={getStatusColor(q.status)} />
                </td>
                <td className="p-3 border text-red-600">
                  {q.status === "REJECTED" ? q.rejectReason || "No reason given" : "-"}
                </td>
                <td className="p-3 border">
                  {q.status === "PENDING" && (
                    <div className="flex gap-3">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApprove(q.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleReject(q.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejection Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="reject-modal"
      >
        <Box
          className="bg-white p-6 rounded-lg shadow-lg"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
          }}
        >
          <Typography variant="h6" className="mb-4 text-red-600">
            Enter Rejection Reason
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Type your reason here"
          />
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outlined" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleRejectSubmit}>
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
