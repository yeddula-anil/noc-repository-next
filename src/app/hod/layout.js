// app/caretaker/layout.js
"use client";
import HodNavbar from "@/components/hod/HodNavbar";

export default function CaretakerLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <HodNavbar />
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
