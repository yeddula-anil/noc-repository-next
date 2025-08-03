"use client";
import { useState, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function CaretakerHostelQueriesPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  // Dummy hostel queries
  const [queries, setQueries] = useState([
    {
      id: "H001",
      student: "Vikas Yeddula",
      roomNo: "B-101",
      issue: "Fan not working",
      description: "Ceiling fan not rotating properly",
      status: "Pending",
      timestamp: "2025-08-02T09:00:00",
    },
    {
      id: "H002",
      student: "Rahul Verma",
      roomNo: "C-202",
      issue: "Carpentry work",
      description: "Bed frame needs repair",
      status: "Resolved",
      timestamp: "2025-08-01T14:30:00",
    },
    {
      id: "H003",
      student: "Meena Gupta",
      roomNo: "A-105",
      issue: "Light not working",
      description: "Tube light fused in study area",
      status: "Approved",
      timestamp: "2025-08-01T10:15:00",
    },
  ]);

  // Apply filter + sort
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
      case "Resolved":
        return "success";
      case "Approved":
        return "primary";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Handle Approve
  const handleApprove = (id) => {
    setQueries((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: "Approved" } : q
      )
    );
  };

  // Export to Excel
  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hostel Queries");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Student", key: "student", width: 20 },
      { header: "Room No", key: "roomNo", width: 10 },
      { header: "Issue", key: "issue", width: 20 },
      { header: "Description", key: "description", width: 30 },
      { header: "Status", key: "status", width: 12 },
      { header: "Timestamp", key: "timestamp", width: 20 },
    ];

    filteredQueries.forEach((q) => {
      worksheet.addRow(q);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "hostel_queries.xlsx"
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="text-center sm:text-left">
          <Typography variant="h4" className="font-bold text-indigo-700 mb-2">
            Hostel Queries Dashboard
          </Typography>
          <Typography variant="body1" className="text-gray-700">
            Manage student hostel-related issues in real-time.
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadExcel}
          className="mt-4 sm:mt-0"
        >
          Download Excel
        </Button>
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
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="desc">Newest First</MenuItem>
            <MenuItem value="asc">Oldest First</MenuItem>
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
              <th className="p-3 border">Issue</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Timestamp</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50 text-gray-800">
                <td className="p-3 border">{q.id}</td>
                <td className="p-3 border">{q.student}</td>
                <td className="p-3 border">{q.roomNo}</td>
                <td className="p-3 border">{q.issue}</td>
                <td className="p-3 border">{q.description}</td>
                <td className="p-3 border">
                  <Chip label={q.status} color={getStatusColor(q.status)} />
                </td>
                <td className="p-3 border">
                  {new Date(q.timestamp).toLocaleString()}
                </td>
                <td className="p-3 border">
                  {q.status === "Pending" && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApprove(q.id)}
                    >
                      Approve
                    </Button>
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
                Room: {q.roomNo}
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                Issue: {q.issue}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {q.description}
              </Typography>
              <div className="mt-2 flex justify-between items-center">
                <Chip label={q.status} color={getStatusColor(q.status)} />
                <Typography variant="caption" className="text-gray-500">
                  {new Date(q.timestamp).toLocaleString()}
                </Typography>
              </div>
              {q.status === "Pending" && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  className="mt-5"
                  onClick={() => handleApprove(q.id)}
                >
                  Approve
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
