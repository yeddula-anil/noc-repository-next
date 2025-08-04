"use client";
import React, { useState, useEffect } from "react";

export default function ApplyOutpassPage() {
  const [formData, setFormData] = useState({
    type:"",
    fullName: "",
    studentId: "",
    collegeEmail: "",
    roomNo: "",
    personalMobile: "",
    parentMobile: "",
    year: "",
    branch: "",
    hostel: "",
    reason: "",
    fromDate: "",
    toDate: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [outpassesLeft, setOutpassesLeft] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // simulate fetching student data & outpasses left
  useEffect(() => {
    setTimeout(() => {
      // dummy student
      const student = {
        type:"OUTPASS",
        fullName: "Vikas Yeddula",
        studentId: "R200907",
        collegeEmail: "vikasyeddula@gmail.com",
        roomNo: "s-113",
        personalMobile: "9876543210",
        parentMobile: "9123456780",
        year: "E4",
        branch: "CSE",
        hostel: "BH-1",
      };

      // dummy outpasses left
      const remaining = 6; // try setting 0 to test "no outpasses left" warning

      setFormData((prev) => ({
        ...prev,
        ...student,
      }));
      setOutpassesLeft(remaining);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true)
  if (outpassesLeft <= 0) return;

  try {
    const res = await fetch("/api/outpass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || "Failed to submit outpass");
      return;
    }

    console.log("Outpass submitted:", formData);

    setShowSnackbar(true);
    setOutpassesLeft((prev) => prev - 1);
    setTimeout(() => setShowSnackbar(false), 3000);

    // Clear reason and dates for next request
    setFormData((prev) => ({
      ...prev,
      reason: "",
      fromDate: "",
      toDate: "",
    }));
  } catch (err) {
    console.error("Error submitting outpass:", err);
    alert("Something went wrong. Please try again.");
  }
  finally{
    setSubmitting(false)
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading student data...
      </div>
    );
  }

  const noOutpassesLeft = outpassesLeft !== null && outpassesLeft <= 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-1">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Apply for Outpass
        </h1>

        {noOutpassesLeft && (
          <p className="text-red-600 text-center font-medium mb-4">
            You do not have any outpasses left for this academic year. <br />
            If emergency, please write a letter to the caretaker and take the
            outpass manually.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              readOnly
              className="w-full border text-gray-500 bg-gray-100 rounded-lg p-2"
            />
          </div>

          {/* ID Number */}
          <div>
            <label className="block font-medium text-gray-700">ID Number</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              readOnly
              className="w-full border text-gray-500 bg-gray-100 rounded-lg p-2"
            />
          </div>

          {/* College Mail */}
          <div>
            <label className="block font-medium text-gray-700">College Mail</label>
            <input
              type="email"
              name="collegeEmail"
              value={formData.collegeEmail}
              readOnly
              className="w-full border text-gray-500 bg-gray-100 rounded-lg p-2"
            />
          </div>

          {/* Room No */}
          <div>
            <label className="block font-medium text-gray-700">Room No</label>
            <input
              type="text"
              name="roomNo"
              value={formData.roomNo}
              readOnly
              className="w-full border text-gray-500 bg-gray-100 rounded-lg p-2"
            />
          </div>

          {/* Personal Mobile */}
          <div>
            <label className="block font-medium text-gray-700">Personal Mobile No</label>
            <input
              type="tel"
              name="personalMobile"
              value={formData.personalMobile}
              readOnly
              className="w-full border text-gray-500 bg-gray-100 rounded-lg p-2"
            />
          </div>

          {/* Parent Mobile */}
          <div>
            <label className="block font-medium text-gray-700">Parent Mobile No</label>
            <input
              type="tel"
              name="parentMobile"
              value={formData.parentMobile}
              readOnly
              className="w-full border text-gray-500 bg-gray-100 rounded-lg p-2"
            />
          </div>

          {/* Year & Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-gray-700">Year</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                readOnly
                className="w-full border text-gray-500 bg-gray-100 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                readOnly
                className="w-full border text-gray-500 bg-gray-100 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Hostel */}
          <div>
            <label className="block font-medium text-gray-700">Hostel</label>
            <select
              name="hostel"
              value={formData.hostel}
              onChange={handleChange}
              disabled={noOutpassesLeft}
              required
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select Hostel</option>
              <option value="BH-1">BH-1</option>
              <option value="BH1-backside">BH1-backside</option>
              <option value="BH2">BH2</option>
              <option value="BH2-backside">BH2-backside</option>
              <option value="GH-1">GH-1</option>
              <option value="GH-2">GH-2</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-medium text-gray-700">
              Reason for Outpass
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              disabled={noOutpassesLeft}
              required
              rows="3"
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
            ></textarea>
          </div>

          {/* From & To Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-gray-700">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                disabled={noOutpassesLeft}
                required
                className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">To Date</label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                disabled={noOutpassesLeft}
                required
                className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Submit */}
          {/* Submit */}
            <button
              type="submit"
              disabled={noOutpassesLeft || submitting}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-lg transition ${
                noOutpassesLeft || submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {submitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                "Submit Application"
              )}
            </button>

        </form>
      </div>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-bounce">
          Application submitted successfully!
        </div>
      )}
    </div>
  );
}
