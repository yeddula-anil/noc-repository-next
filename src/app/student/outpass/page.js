"use client";
import React, { useState } from "react";

export default function ApplyOutpassPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    collegeEmail: "",
    roomNo: "",
    personalMobile: "",
    parentMobile: "",
    year: "",
    branch: "",
    reason: "",
    fromDate: "",
    toDate: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000); // auto-hide after 3s
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-1">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Apply for Outpass
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ID Number */}
          <div>
            <label className="block font-medium text-gray-700">ID Number</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* College Mail */}
          <div>
            <label className="block font-medium text-gray-700">College Mail</label>
            <input
              type="email"
              name="collegeEmail"
              value={formData.collegeEmail}
              onChange={handleChange}
              required
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Room No */}
          <div>
            <label className="block font-medium text-gray-700">Room No</label>
            <input
              type="text"
              name="roomNo"
              value={formData.roomNo}
              onChange={handleChange}
              required
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Personal Mobile */}
          <div>
            <label className="block font-medium text-gray-700">Personal Mobile No</label>
            <input
              type="tel"
              name="personalMobile"
              pattern="[0-9]{10}"
              value={formData.personalMobile}
              onChange={handleChange}
              required
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Parent Mobile */}
          <div>
            <label className="block font-medium text-gray-700">Parent Mobile No</label>
            <input
              type="tel"
              name="parentMobile"
              pattern="[0-9]{10}"
              value={formData.parentMobile}
              onChange={handleChange}
              required
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block font-medium text-gray-700">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Year</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="E1">E1</option>
              <option value="E2">E2</option>
              <option value="E3">E3</option>
              <option value="E4">E4</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block font-medium text-gray-700">Branch (if B.Tech)</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="IT">IT</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-medium text-gray-700">Reason for Outpass</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* From Date & To Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-gray-700">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
                className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">To Date</label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
                className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Submit Application
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
