"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function StaffProfilePage() {
  const { data: session } = useSession();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    profilePic: "",
    profilePicBuffer: null,
    name: "",
    email: "",
    role: "",
    phone: "",
    branch: "",
    year: "",
  });

  const [loading, setLoading] = useState({ update: false, logout: false });

  // Fetch profile data
  useEffect(() => {
    if (!session?.user?.email) return;

    setForm((prev) => ({
      ...prev,
      email: session.user.email,
      role: session.user.role || "",
    }));

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/staff/get-profile?email=${session.user.email}`);
        if (res.status === 404) {
          toast("No profile found — using defaults");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        let profilePicUrl = "";
        if (data.profilePic) {
          if (typeof data.profilePic === "string") {
            // Already a URL from DB
            profilePicUrl = data.profilePic;
          } else if (data.profilePic?.data) {
            // Binary buffer from MongoDB
            const blob = new Blob([new Uint8Array(data.profilePic.data)], { type: "image/jpeg" });
            profilePicUrl = URL.createObjectURL(blob);
          }
        }

        setForm((prev) => ({
          ...prev,
          profilePic: profilePicUrl || "",
          name: data.name || "",
          phone: data.phone || "",
          branch: data.branch || "",
          year: data.year || "",
        }));
      } catch (err) {
        console.error(err);
        toast.error("Could not load profile data");
      }
    };

    fetchProfile();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const buffer = new Uint8Array(reader.result);
        setForm((prev) => ({
          ...prev,
          profilePic: previewUrl,
          profilePicBuffer: buffer,
        }));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleUpdate = async () => {
    setLoading((prev) => ({ ...prev, update: true }));
    try {
      const res = await fetch("/api/staff/edit-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleLogout = async () => {
    setLoading((prev) => ({ ...prev, logout: true }));
    await signOut({ redirect: true, callbackUrl: "/" });
    setLoading((prev) => ({ ...prev, logout: false }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-0 px-0">
      <Toaster position="top-center" reverseOrder={false} />
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

        {/* Name */}
        <div className="mt-4 mb-3">
          <label className="block font-semibold text-gray-800">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-gray-900"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block font-semibold text-gray-800">Email</label>
          <input
            value={form.email}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-900"
          />
        </div>

        {/* Role */}
        <div className="mb-3">
          <label className="block font-semibold text-gray-800">Role</label>
          <input
            value={form.role}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-900"
          />
        </div>

        {/* Phone */}
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

        {/* Branch (HOD only) */}
        {form.role === "HOD" && (
          <div className="mb-3">
            <label className="block font-semibold text-gray-800">Branch</label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded text-gray-900"
            >
              <option value="">Select Branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>
        )}

        {/* Year (Caretaker only) */}
        {form.role === "CARETAKER" && (
          <div className="mb-3">
            <label className="block font-semibold text-gray-800">Year</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded text-gray-900"
            >
              <option value="">Select Year</option>
              <option value="E1">1st Year</option>
              <option value="E2">2nd Year</option>
              <option value="E3">3rd Year</option>
              <option value="E4">4th Year</option>
            </select>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex gap-3 flex-col sm:flex-row">
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
