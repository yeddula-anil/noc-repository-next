"use client";
import { useState, useMemo, useEffect } from "react";
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

export default function CaretakerOutpassesPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [outpasses, setOutpasses] = useState([]);
  const [sortOrder] = useState("asc"); // oldest first
  const [openModal, setOpenModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  

  // Fetch outpasses from backend (default year = E3 for now)
  useEffect(() => {
    const fetchOutpasses = async () => {
      try {
        const res = await fetch(`/api/caretaker/outpass?year=E4`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOutpasses(
            data.data.map((o) => ({
              id: o._id,
              name: o.fullName,
              studentId: o.studentId,
              roomNo: o.roomNo,
              branch: o.branch || "N/A",
              year: o.year,
              hostel: o.hostel,
              reason: o.reason,
              fromDate: new Date(o.fromDate).toLocaleDateString(),
              toDate: new Date(o.toDate).toLocaleDateString(),
              status: o.status,
              rejectReason: o.remarks,
              timestamp: o.createdAt,
            }))
          );
        } else {
          toast.error(data.message || "Failed to load outpasses", {
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("Error fetching outpasses:", error);
        toast.error("Server error fetching outpasses", {
          position: "top-center",
        });
      }
    };

    fetchOutpasses();
  }, []);

  // Filter + sort
  const filteredOutpasses = useMemo(() => {
    let filtered = outpasses;
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    return filtered.sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [statusFilter, sortOrder, outpasses]);

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
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

  // Approve
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/caretaker/outpass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outpassId: id, action: "APPROVE" }),
      });
      const data = await res.json();

      if (res.ok) {
        setOutpasses((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: "APPROVED" } : o))
        );
        toast.success("Outpass approved successfully!", {
          position: "top-center",
        });
      } else {
        toast.error(data.error || "Approval failed", { position: "top-center" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during approval", { position: "top-center" });
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
      const res = await fetch(`/api/caretaker/outpass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outpassId: selectedId,
          action: "REJECT",
          rejectionReason: rejectReason,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setOutpasses((prev) =>
          prev.map((o) =>
            o.id === selectedId
              ? { ...o, status: "REJECTED", rejectReason }
              : o
          )
        );
        setOpenModal(false);
        setRejectReason("");
        setSelectedId(null);
        toast.error("Outpass rejected", { position: "top-center" });
      } else {
        toast.error(data.error || "Rejection failed", { position: "top-center" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during rejection", { position: "top-center" });
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-0 sm:p-0">
      <Toaster />

      {/* Hero Section */}
      <div className="text-center mb-8">
        <Typography variant="h4" className="font-bold text-indigo-700 mb-2">
          Outpass Requests from Students
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Review and take action on outpass applications.
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
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse hidden sm:table">
          <thead>
            <tr className="bg-indigo-200 text-indigo-900 font-semibold">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Student ID</th>
              <th className="p-3 border">Room No</th>
              <th className="p-3 border">Branch</th>
              <th className="p-3 border">Year</th>
              <th className="p-3 border">Hostel</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">From</th>
              <th className="p-3 border">To</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Timestamp</th>
              <th className="p-3 border">Rejection Reason</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOutpasses.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 text-gray-800">
                <td className="p-3 border">{o.id}</td>
                <td className="p-3 border">{o.name}</td>
                <td className="p-3 border">{o.studentId}</td>
                <td className="p-3 border">{o.roomNo}</td>
                <td className="p-3 border">{o.branch}</td>
                <td className="p-3 border">{o.year}</td>
                <td className="p-3 border">{o.hostel}</td>
                <td className="p-3 border">{o.reason}</td>
                <td className="p-3 border">{o.fromDate}</td>
                <td className="p-3 border">{o.toDate}</td>
                <td className="p-3 border">
                  <Chip label={o.status} color={getStatusColor(o.status)} />
                </td>
                <td className="p-3 border">
                  {new Date(o.timestamp).toLocaleString()}
                </td>
                <td className="p-3 border text-red-600">
                  {o.status === "REJECTED"
                    ? o.rejectReason || "No reason given"
                    : "-"}
                </td>
                <td className="p-3 border">
                  {o.status === "PENDING" && (
                    <div className="flex gap-3">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApprove(o.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleReject(o.id)}
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
          {filteredOutpasses.map((o) => (
            <div key={o.id} className="border rounded-lg p-4 shadow-md bg-white">
              <Typography className="font-semibold text-indigo-800">
                {o.name}
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                ID: {o.studentId} | Room: {o.roomNo} | Branch: {o.branch} | Year:{" "}
                {o.year}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Hostel: {o.hostel}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Reason: {o.reason}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                From: {o.fromDate} | To: {o.toDate}
              </Typography>
              {o.status === "REJECTED" && (
                <Typography variant="body2" className="text-red-600 mt-1">
                  Rejection Reason: {o.rejectReason || "No reason given"}
                </Typography>
              )}
              <div className="mt-2 flex justify-between items-center">
                <Chip label={o.status} color={getStatusColor(o.status)} />
                <Typography variant="caption" className="text-gray-500">
                  {new Date(o.timestamp).toLocaleString()}
                </Typography>
              </div>
              {o.status === "PENDING" && (
                <div className="mt-3 flex gap-3">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleApprove(o.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleReject(o.id)}
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
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectSubmit}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
