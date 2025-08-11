// app/caretaker/layout.js
"use client";
import CaretakerNavbar from "../../components/caretaker/CaretakerNavbar";
import { StaffProvider } from "../context/StaffContext";

export default function CaretakerLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <StaffProvider>
          <CaretakerNavbar />
          <main className="max-w-7xl mx-auto p-4">{children}</main>
      </StaffProvider>
      
    </div>
  );
}
