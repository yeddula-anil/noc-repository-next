"use client";
import { useState, useMemo } from "react";
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

export default function CaretakerNOCsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [queries, setQueries] = useState([
    {
      id: "NOC001",
      student: "Vikas Yeddula",
      studentId: "20CS123",
      branch: "CSE",
      year: "4th",
      reason: "For higher studies application",
      documentUrl: "/docs/noc_higher_studies.pdf",
      status: "Pending",
      timestamp: "2025-08-02T10:00:00",
    },
    {
      id: "NOC002",
      student: "Rahul Verma",
      studentId: "20EC456",
      branch: "ECE",
      year: "3rd",
      reason: "For internship application",
      documentUrl: "/docs/noc_internship.pdf",
      status: "Approved",
      timestamp: "2025-08-01T12:30:00",
    },
    {
      id: "NOC003",
      student: "Meena Gupta",
      studentId: "20ME789",
      branch: "MECH",
      year: "2nd",
      reason: "For scholarship verification",
      documentUrl: null,
      status: "Rejected",
      rejectReason: "Incomplete documents",
      timestamp: "2025-07-31T09:45:00",
    },
  ]);

  const [sortOrder] = useState("asc"); // oldest first
  const [openModal, setOpenModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

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
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Approve
  const handleApprove = (id) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "Approved" } : q))
    );
    toast.success("Application approved successfully!", { position: "top-center" });
  };

  // Reject modal open
  const handleReject = (id) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  // Submit rejection
  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason", { position: "top-center" });
      return;
    }
    setQueries((prev) =>
      prev.map((q) =>
        q.id === selectedId ? { ...q, status: "Rejected", rejectReason } : q
      )
    );
    setOpenModal(false);
    setRejectReason("");
    setSelectedId(null);
    toast.error("Application rejected", { position: "top-center" });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <Toaster />

      {/* Hero Section */}
      <div className="text-center mb-8">
        <Typography variant="h4" className="font-bold text-indigo-700 mb-2">
          NOC Requests from Students
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
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse hidden sm:table">
          <thead>
            <tr className="bg-indigo-200 text-indigo-900 font-semibold">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Student</th>
              <th className="p-3 border">Student ID</th>
              <th className="p-3 border">Branch</th>
              <th className="p-3 border">Year</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">Document</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Timestamp</th>
              <th className="p-3 border">Rejection Reason</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50 text-gray-800">
                <td className="p-3 border">{q.id}</td>
                <td className="p-3 border">{q.student}</td>
                <td className="p-3 border">{q.studentId}</td>
                <td className="p-3 border">{q.branch}</td>
                <td className="p-3 border">{q.year}</td>
                <td className="p-3 border">{q.reason}</td>
                <td className="p-3 border">
                  {q.documentUrl ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => window.open(q.documentUrl, "_blank")}
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
                <td className="p-3 border">
                  {new Date(q.timestamp).toLocaleString()}
                </td>
                <td className="p-3 border text-red-600">
                  {q.status === "Rejected" ? q.rejectReason || "No reason given" : "-"}
                </td>
                <td className="p-3 border">
                  {q.status === "Pending" && (
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

        {/* Mobile Cards */}
        <div className="grid gap-5 sm:hidden">
          {filteredQueries.map((q) => (
            <div key={q.id} className="border rounded-lg p-4 shadow-md bg-white">
              <Typography className="font-semibold text-indigo-800">
                {q.student}
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                ID: {q.studentId} | Branch: {q.branch} | Year: {q.year}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Reason: {q.reason}
              </Typography>
              {q.documentUrl ? (
                <Button
                  className="mt-2"
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(q.documentUrl, "_blank")}
                >
                  View Document
                </Button>
              ) : (
                <Typography variant="body2" className="text-gray-500 mt-2">
                  No document submitted
                </Typography>
              )}
              {q.status === "Rejected" && (
                <Typography variant="body2" className="text-red-600 mt-1">
                  Rejection Reason: {q.rejectReason || "No reason given"}
                </Typography>
              )}
              <div className="mt-2 flex justify-between items-center">
                <Chip label={q.status} color={getStatusColor(q.status)} />
                <Typography variant="caption" className="text-gray-500">
                  {new Date(q.timestamp).toLocaleString()}
                </Typography>
              </div>
              {q.status === "Pending" && (
                <div className="mt-3 flex gap-3">
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
            </div>
          ))}
        </div>
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
