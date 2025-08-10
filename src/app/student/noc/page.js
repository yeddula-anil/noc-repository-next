"use client";
import { useState } from "react";

const ApplyNocPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    collegeEmail: "",
    personalMobile: "",
    branch: "",
    year: "",
    reason: "",
    proof: null,
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ added loading state

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "proof") {
      const file = files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        // 5 MB limit
        alert("File size should be less than 5MB");
        e.target.value = ""; // reset file input
        return;
      }
      setFormData({ ...formData, proof: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoading(true); // ✅ show loader

    const formDataToSend = new FormData();
    formDataToSend.append("type", "NOC");
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("studentId", formData.studentId);
    formDataToSend.append("collegeEmail", formData.collegeEmail);
    formDataToSend.append("personalMobile", formData.personalMobile);
    formDataToSend.append("branch", formData.branch);
    formDataToSend.append("year", formData.year);
    formDataToSend.append("reason", formData.reason);
    if (formData.proof) {
      formDataToSend.append("proof", formData.proof);
    }

    try {
      const res = await fetch("/api/noc", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to submit NOC");
        return;
      }

      // Success
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);

      // Reset form
      setFormData({
        fullName: "",
        studentId: "",
        collegeEmail: "",
        personalMobile: "",
        branch: "",
        year: "",
        reason: "",
        proof: null,
      });
    } catch (err) {
      console.error("Error submitting NOC:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setLoading(false); // ✅ hide loader
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">Apply for NOC</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">
            Full Name
          </label>
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
          <label className="block font-semibold text-gray-800 mb-1">
            Student ID
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* College Email */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">
            College Email
          </label>
          <input
            type="email"
            name="collegeEmail"
            value={formData.collegeEmail}
            onChange={handleChange}
            required
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Personal Mobile */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">
            Personal Mobile Number
          </label>
          <input
            type="tel"
            name="personalMobile"
            value={formData.personalMobile}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Branch */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">
            Branch
          </label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Branch</option>
            <option value="CSE">Computer Science</option>
            <option value="ECE">Electronics & Communication</option>
            <option value="EEE">Electrical & Electronics</option>
            <option value="MECH">Mechanical</option>
            <option value="CIVIL">Civil</option>
          </select>
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
            <option value="E1">1st Year</option>
            <option value="E2">2nd Year</option>
            <option value="E3">3rd Year</option>
            <option value="E4">4th Year</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">
            Reason for Applying NOC
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows="3"
            className="w-full border text-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Proof */}
        <div>
          <label className="block font-semibold text-gray-800 mb-1">
            Upload Proof Document (pdf sizeshould be less than 5mb)
          </label>
          <input
            type="file"
            name="proof"
            onChange={handleChange}
            accept=".pdf"
            required
            className="w-full border rounded-lg p-2 file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 text-gray-800"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || submitting}
          className={`w-full flex items-center justify-center py-2 px-4 rounded-lg transition ${
            loading || submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {loading ? (
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
          ) : submitting ? (
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

      {/* Snackbar */}
      {showSnackbar && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-bounce">
          Application submitted successfully!
        </div>
      )}
    </div>
  );
};

export default ApplyNocPage;
