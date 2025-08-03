// app/caretaker/layout.js
"use client";
import CaretakerNavbar from "@/components/caretaker/CaretakerNavbar";

export default function CaretakerLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <CaretakerNavbar />
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
