// app/caretaker/layout.js
"use client";
import DswNavbar from "@/components/dsw/DswNavbar";

export default function CaretakerLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DswNavbar />
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
