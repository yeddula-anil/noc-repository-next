"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    if (res.ok) setStep(2);
    else alert("Failed to send OTP");
  };

 const verifyOtp = async () => {
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, otp }),
  });

  const data = await res.json();

  if (res.ok) {
    // Auto login
    const loginRes = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (!loginRes.error) {
      // Redirect based on role
      if (data.user.role === "student") window.location.href = "/student";
      else if (data.user.role === "faculty") window.location.href = "/faculty";
      else if (data.user.role === "admin") window.location.href = "/admin";
    }
  } else {
    alert(data.error || "Invalid OTP");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        {step === 1 && (
          <>
            <input name="fullName" placeholder="Full Name" onChange={handleChange}
              className="w-full border p-2 rounded mb-4" />
            <input name="email" type="email" placeholder="Email" onChange={handleChange}
              className="w-full border p-2 rounded mb-4" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange}
              className="w-full border p-2 rounded mb-4" />
            <button onClick={sendOtp} className="w-full bg-blue-600 text-white py-2 rounded-lg mb-2">Send OTP</button>
            <button onClick={() => signIn("google", { prompt: "select_account" })} className="w-full bg-red-600 text-white py-2 rounded-lg">
              Continue with Google
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input placeholder="Enter OTP" value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-2 rounded mb-4" />
            <button onClick={verifyOtp} className="w-full bg-green-600 text-white py-2 rounded-lg">
              Verify OTP & Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
