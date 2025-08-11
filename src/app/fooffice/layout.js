// app/caretaker/layout.js
"use client";
import FoOfficeNavbar from "@/components/fo_office/FoOfficeNavbar";
import { StaffProvider } from "../context/StaffContext";

export default function FoOfficeLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <StaffProvider>
      <FoOfficeNavbar />
      </StaffProvider>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
