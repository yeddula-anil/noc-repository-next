// app/caretaker/layout.js
"use client";
import DirectorNavbar from "@/components/director/DirectorNavbar";

export default function DirectorLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DirectorNavbar />
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
