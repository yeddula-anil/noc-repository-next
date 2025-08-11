// app/caretaker/layout.js
"use client";
import DeanNavbar from "@/components/dean/DeanNavbar";
import { StaffProvider } from "../context/StaffContext";

export default function DeanLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <StaffProvider>
          <DeanNavbar />
      </StaffProvider>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
