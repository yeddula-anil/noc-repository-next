// app/caretaker/layout.js
"use client";
import FoOfficeNavbar from "@/components/fo_office/FoOfficeNavbar";

export default function FoOfficeLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <FoOfficeNavbar />
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
