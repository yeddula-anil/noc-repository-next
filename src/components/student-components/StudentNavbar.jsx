"use client";
import { useState } from "react";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

export const StudentNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount] = useState(3); // Example count, can be dynamic

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Profile / Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/profile.png"
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-white"
            />
            <span className="font-bold text-lg hidden sm:block">my-Profile</span>
          </div>

          {/* Right Side: Menu (Desktop) + Message Icon */}
          <div className="hidden md:flex items-center space-x-4">
            {[
              { href: "/student", label: "Dashboard" },
              { href: "/student/noc", label: "Apply NOC" },
              { href: "/student/outpass", label: "Apply Outpass" },
              { href: "/student/applications", label: "My Applications" },
              { href: "/student/profile", label: "Profile" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 border border-white rounded-md bg-indigo-500 hover:bg-indigo-700 transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Message Icon */}
            <Link href="/student/messages">
              <IconButton color="inherit">
                <Badge badgeContent={unreadCount} color="error">
                  <MailIcon className="text-white" />
                </Badge>
              </IconButton>
            </Link>
          </div>

          {/* Mobile Hamburger + Message Icon */}
          <div className="flex items-center space-x-3 md:hidden">
            <IconButton color="inherit">
              <Badge badgeContent={unreadCount} color="error">
                <MailIcon className="text-white" />
              </Badge>
            </IconButton>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white text-indigo-600 px-4 pb-3 space-y-2 shadow-lg">
          {[
            { href: "/student", label: "Dashboard" },
            { href: "/student/noc", label: "Apply NOC" },
            { href: "/student/outpass", label: "Apply Outpass" },
            { href: "/student/applications", label: "My Applications" },
            { href: "/student/profile", label: "Profile" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 border border-indigo-600 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default StudentNavbar;
