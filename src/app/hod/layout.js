"use client";

import HodNavbar from "../../components/hod/HodNavbar";
import { StaffProvider } from "../context/StaffContext";

export default function HodLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <StaffProvider>
        <HodNavbar />
        <main className="max-w-7xl mx-auto p-4">{children}</main>
      </StaffProvider>
    </div>
  );
}
