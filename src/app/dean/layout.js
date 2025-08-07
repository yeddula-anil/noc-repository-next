// app/caretaker/layout.js
"use client";
import DeanNavbar from "@/components/dean/DeanNavbar";

export default function DeanLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DeanNavbar />
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
