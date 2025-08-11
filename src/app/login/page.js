"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast message state
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const router = useRouter();

  // Automatically hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res || res.error) {
      showToast(res?.error || "Invalid email or password", "error");
    } else {
      showToast("Login successful!", "success");
      // Delay redirect a bit so user sees toast
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { prompt: "select_account" });
  };

  return (
    <>
      {/* Toast container */}
      {toast.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold
            ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}
            animate-fadeInDown`}
          role="alert"
        >
          {toast.message}
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">
            Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-6 text-center text-gray-600">OR</div>

          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-400 flex items-center justify-center gap-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-900"
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-700">
            Don’t have an account?{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.3s ease forwards;
        }
      `}</style>
    </>
  );
}
