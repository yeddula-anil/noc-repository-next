"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", otp: "" });
  const [stage, setStage] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStage("otp");
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        const result = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        if (result?.ok) {
          router.refresh(); // updates session
          if (data.user.role === "CARETAKER") {
            router.push("/caretaker");
          } else if (data.user.role === "STUDENT") {
            router.push("/student");
          } else {
            router.push("/");
          }
        } else {
          setError("Login failed after signup.");
        }
      } else {
        setError(data.message || "OTP verification failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    signIn("google", { prompt: "select_account" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md sm:p-10">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">Sign Up</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        {stage === "form" && (
          <>
            <input
              name="fullName"
              placeholder="Full Name"
              className="w-full px-4 py-2 mb-3 border rounded-md text-gray-800"
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-3 border rounded-md text-gray-800"
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border rounded-md text-gray-800"
              onChange={handleChange}
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {stage === "otp" && (
          <>
            <input
              name="otp"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 mb-4 border rounded-md text-gray-800"
              onChange={handleChange}
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm sm:text-base"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
          </>
        )}

        <div className="my-6 text-center text-gray-700 font-medium">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border flex items-center justify-center gap-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-800 text-sm sm:text-base"
        >
          <img src="/google.svg" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
