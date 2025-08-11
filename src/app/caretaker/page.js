"use client";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast"; // react-hot-toast for notifications
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

export default function CaretakerHostelQueriesPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approveLoadingId, setApproveLoadingId] = useState(null);

  useEffect(() => {
    async function fetchQueries() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "All") params.append("status", statusFilter);
        if (yearFilter !== "All") params.append("year", yearFilter);

        const res = await fetch("/api/room-issue?" + params.toString());
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setQueries(data);
      } catch (err) {
        console.error("Error fetching queries:", err);
        setQueries([]);
      } finally {
        setLoading(false);
      }
    }
    fetchQueries();
  }, [statusFilter, yearFilter]);

  const filteredSortedQueries = useMemo(() => {
    return [...queries].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [queries]);

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "success";
      case "APPROVED":
        return "primary";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const handleApprove = async (id) => {
    setApproveLoadingId(id);
    try {
      const res = await fetch(`/api/room-issue/approve/${id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to approve");

      // Update the query status immediately in local state
      setQueries((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: "APPROVED" } : q))
      );

      toast.success("Issue approved successfully!");
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Failed to approve issue.");
    } finally {
      setApproveLoadingId(null);
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto p-4 sm:p-8 relative"
      style={{ position: "relative" }}
    >
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="text-center sm:text-left">
          <Typography variant="h4" className="font-bold text-indigo-700 mb-2">
            Hostel reolated problems
          </Typography>
          <Typography variant="body1" className="text-gray-700">
            Manage student hostel-related issues in real-time.
          </Typography>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <FormControl className="w-full sm:w-1/3">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>

        <FormControl className="w-full sm:w-1/3">
          <InputLabel>Year</InputLabel>
          <Select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="E1">1st Year</MenuItem>
            <MenuItem value="E2">2nd Year</MenuItem>
            <MenuItem value="E3">3rd Year</MenuItem>
            <MenuItem value="E4">4th Year</MenuItem>
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
              <th className="p-3 border">Room No</th>
              <th className="p-3 border">Mobile No</th>
              <th className="p-3 border">Issue</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Timestamp</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : filteredSortedQueries.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-6">
                  No queries found.
                </td>
              </tr>
            ) : (
              filteredSortedQueries.map((q) => (
                <tr key={q._id} className="hover:bg-gray-50 text-gray-800">
                  <td className="p-3 border">{q.studentId}</td>
                  <td className="p-3 border">{q.fullName}</td>
                  <td className="p-3 border">{q.roomNo}</td>
                  <td className="p-3 border">{q.mobileNo}</td>
                  <td className="p-3 border">{q.issueType}</td>
                  <td className="p-3 border">{q.description}</td>
                  <td className="p-3 border">
                    <Chip label={q.status} color={getStatusColor(q.status)} />
                  </td>
                  <td className="p-3 border">
                    {new Date(q.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border">
                    {q.status === "PENDING" && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={approveLoadingId === q._id}
                        onClick={() => handleApprove(q._id)}
                      >
                        {approveLoadingId === q._id ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Approve"
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="grid gap-5 sm:hidden">
          {loading ? (
            <div className="text-center p-6">Loading...</div>
          ) : filteredSortedQueries.length === 0 ? (
            <div className="text-center p-6">No queries found.</div>
          ) : (
            filteredSortedQueries.map((q) => (
              <div
                key={q._id}
                className="relative border rounded-lg p-4 shadow-md bg-white flex flex-col"
              >
                {/* Status chip top-right */}
                <div className="absolute top-3 right-3">
                  <Chip label={q.status} color={getStatusColor(q.status)} />
                </div>

                <Typography className="font-semibold text-indigo-800">
                  {q.fullName}
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  Room: {q.roomNo}
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  Mobile: {q.mobileNo}
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  Issue: {q.issueType}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {q.description}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-gray-500 mt-2 self-end"
                >
                  {new Date(q.createdAt).toLocaleString()}
                </Typography>

                {q.status === "PENDING" && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    className="mt-4 self-start px-3 py-1 text-sm"
                    disabled={approveLoadingId === q._id}
                    onClick={() => handleApprove(q._id)}
                  >
                    {approveLoadingId === q._id ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
