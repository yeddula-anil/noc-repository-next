"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function StaffProfilePage() {
  const [profile, setProfile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get("/api/staff/profile");
      setProfile(res.data);

      if (res.data.profilePic?.data) {
        const blob = new Blob([new Uint8Array(res.data.profilePic.data.data)], {
          type: res.data.profilePic.contentType,
        });
        setPreview(URL.createObjectURL(blob));
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("email", profile.email);
    formData.append("name", profile.name);
    formData.append("role", profile.role);
    if (profile.role === "HOD") formData.append("branch", profile.branch);
    if (profile.role === "CARETAKER") formData.append("year", profile.year);
    if (selectedImage) formData.append("profilePic", selectedImage);

    setLoading(true);
    try {
      await axios.put("/api/staff/profile", formData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
    setLoading(false);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <h2>My Profile</h2>

      <div style={{ marginBottom: "1rem" }}>
        <img
          src={preview || "/default-profile.png"}
          alt="Profile"
          style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div>
        <label>Name</label>
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div>
        <label>Email</label>
        <input
          name="email"
          value={profile.email}
          onChange={handleChange}
          disabled
          className="form-input"
        />
      </div>

      <div>
        <label>Role</label>
        <input name="role" value={profile.role} disabled className="form-input" />
      </div>

      {profile.role === "HOD" && (
        <div>
          <label>Branch</label>
          <select
            name="branch"
            value={profile.branch || ""}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>
        </div>
      )}

      {profile.role === "CARETAKER" && (
        <div>
          <label>Year</label>
          <select
            name="year"
            value={profile.year || ""}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select Year</option>
            <option value="E1">E1</option>
            <option value="E2">E2</option>
            <option value="E3">E3</option>
            <option value="E4">E4</option>
          </select>
        </div>
      )}

      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
}
