"use client";
import { useState } from "react";

const RoomIssueForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    roomNo: "",
    hostel: "",
    mobileNo: "",
    year: "",
    issueType: "",
    description: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Room Issue Submitted:", formData);

    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);

    setFormData({
      fullName: "",
      studentId: "",
      roomNo: "",
      hostel: "",
      mobileNo: "",
      year: "",
      issueType: "",
      description: "",
    });
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">
        Report Room Issue
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Student ID */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Room Number */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Room Number</label>
          <input
            type="text"
            name="roomNo"
            value={formData.roomNo}
            onChange={handleChange}
            required
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Hostel */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Hostel</label>
          <input
            type="text"
            name="hostel"
            value={formData.hostel}
            onChange={handleChange}
            required
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Mobile Number</label>
          <input
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        {/* Issue Type */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">Issue Type</label>
          <select
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            required
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Issue</option>
            <option value="fan">Fan Repair</option>
            <option value="light">Light Repair</option>
            <option value="carpentry">Carpentry Work</option>
            <option value="plumbing">Plumbing Issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">
            Issue Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Describe your issue in detail..."
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Submit Request
        </button>
      </form>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-bounce">
          Room issue submitted successfully!
        </div>
      )}
    </div>
  );
};

export default RoomIssueForm;
