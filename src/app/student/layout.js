import StudentNavbar from "@/components/StudentNavbar";
import "@/app/globals.css";

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
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </section>
  );
}
