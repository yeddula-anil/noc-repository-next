import StudentNavbar from "@/components/student-components/StudentNavbar";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Student Portal | NOC App",
  description: "Student Dashboard for NOC and Outpass Management",
};

export default function StudentLayout({ children }) {
  return (
    <section className="bg-gray-100 min-h-screen">
      {/* Navbar always visible */}
      <StudentNavbar />

      {/* Main Content */}
      <main className="w-full m-0 p-0">
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </main>
    </section>
  );
}
