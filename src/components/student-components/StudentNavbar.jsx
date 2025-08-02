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
              src="/profile.png" // replace with actual profile picture or logo
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-white"
            />
            <span className="font-bold text-lg hidden sm:block">my-Profile</span>
          </div>

          {/* Right Side: Menu (Desktop) + Message Icon */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/student" className="hover:text-gray-200">
              Dashboard
            </Link>
            <Link href="/student/noc" className="hover:text-gray-200">
              Apply NOC
            </Link>
            <Link href="/student/outpass" className="hover:text-gray-200">
              Apply Outpass
            </Link>
            <Link href="/student/applications" className="hover:text-gray-200">
              My Applications
            </Link>
            <Link href="/student/profile" className="hover:text-gray-200">
              Profile
            </Link>

            {/* Message Icon */}
            <Link href='/student/messages'>
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
          <Link href="/student" className="block hover:text-indigo-800">
            Dashboard
          </Link>
          <Link href="/student/noc" className="block hover:text-indigo-800">
            Apply NOC
          </Link>
          <Link href="/student/outpass" className="block hover:text-indigo-800">
            Apply Outpass
          </Link>
          <Link href="/student/applications" className="block hover:text-indigo-800">
            My Applications
          </Link>
          <Link href="/student/profile" className="block hover:text-indigo-800">
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default StudentNavbar;
