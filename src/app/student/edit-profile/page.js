"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const fileInputRef = useRef(null);

  const branchOptions = ["", "CSE", "ECE", "MECH", "EEE", "MME", "CIVIL"];
  const yearOptions = ["", "E1", "E2", "E3", "E4"];

  const [form, setForm] = useState({
    profilePic: "",
    name: "",
    email: "",
    role: "",
    phone: "",
    branch: "",
    year: "",
  });

  const [loading, setLoading] = useState({
    fetch: true,
    update: false,
    logout: false,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.email || !session?.user?.role) {
      toast.error("Session not found. Please log in again.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      email: session.user.email,
      role: session.user.role,
    }));

    const fetchProfile = async () => {
      setLoading((prev) => ({ ...prev, fetch: true }));
      try {
        const res = await fetch(
          `/api/student/get-profile?email=${session.user.email}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

        // Assuming data.profilePic is always valid image URL/base64
        setForm((prev) => ({
          ...prev,
          ...data,
          email: session.user.email,
          role: session.user.role,
        }));
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };

    fetchProfile();
  }, [session, status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading((prev) => ({ ...prev, update: true }));

    try {
      const res = await fetch("/api/student/edit-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          profilePic: reader.result, // Base64 string or data URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading((prev) => ({ ...prev, logout: true }));
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (err) {
      console.error("Logout error:", err);
      setLoading((prev) => ({ ...prev, logout: false }));
    }
  };

  if (loading.fetch) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        {/* Profile Image */}
        <div className="flex flex-col items-center relative">
          {form.profilePic ? (
            <img
              src={form.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                />
              </svg>
            </div>
          )}

          {/* Camera Icon Overlay */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-[calc(50%-3rem)] bg-gray-700 p-1 rounded-full hover:bg-gray-800 border-2 border-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h2l2-3h10l2 3h2a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Form Fields */}
        <div className="mt-4 mb-3">
          <label className="block font-semibold text-gray-800">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-gray-900"
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold text-gray-800">
            Email (read-only)
          </label>
          <input
            value={form.email}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-900"
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold text-gray-800">
            Role (read-only)
          </label>
          <input
            value={form.role}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-900"
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold text-gray-800">
            Phone Number
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-gray-900"
          />
        </div>

        <div className="mb-3">
          <label className="block font-semibold text-gray-800">Branch</label>
          <select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-gray-900"
          >
            {branchOptions.map((branch, idx) => (
              <option key={idx} value={branch}>
                {branch || "Select branch"}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block font-semibold text-gray-800">Year</label>
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-gray-900"
          >
            {yearOptions.map((year, idx) => (
              <option key={idx} value={year}>
                {year || "Select year"}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={handleUpdate}
            disabled={loading.update}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center disabled:opacity-70"
          >
            {loading.update ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Update Profile"
            )}
          </button>

          <button
            onClick={handleLogout}
            disabled={loading.logout}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center disabled:opacity-70"
          >
            {loading.logout ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
