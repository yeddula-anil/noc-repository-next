"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const StudentNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [student, setStudent] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;

    async function fetchUnread() {
      try {
        const res = await fetch(
          `/api/messages/byEmail/${encodeURIComponent(email)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setUnreadCount(data?.unreadCount || 0);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUnread();
  }, [email]);

  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await fetch(
          `/api/student/get-profile?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [email]);

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  const handleProfileClick = () => {
    if (window.innerWidth < 768) {
      router.push("/student/edit-profile");
    } else {
      setProfileOpen(true);
    }
  };

  return (
    <>
      <nav className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side: Profile / Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleProfileClick}
            >
              {student?.profilePic ? (
                <img
                  src={student.profilePic}
                  alt="Profile"
                  className="rounded-full border-2 border-white object-cover"
                  style={{
                    width: window.innerWidth >= 768 ? 60 : 45, // larger on desktop
                    height: window.innerWidth >= 768 ? 60 : 45,
                  }}
                />
              ) : (
                <AccountCircleIcon
                  sx={{
                    fontSize: window.innerWidth >= 768 ? 60 : 45,
                    color: "white",
                  }}
                />
              )}
              <span className="font-bold text-lg hidden sm:block">
                my-Profile
              </span>
            </div>

            {/* Right Side: Menu (Desktop) */}
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

      {/* Profile Modal */}
      <Modal open={profileOpen} onClose={() => setProfileOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
            width: 380,
            minHeight: 450,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#333",
          }}
        >
          {loadingProfile ? (
            <Typography variant="body1">Loading profile...</Typography>
          ) : (
            <>
              {student?.profilePic ? (
                <img
                  src={student.profilePic}
                  alt="Profile"
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: 16,
                  }}
                />
              ) : (
                <AccountCircleIcon
                  sx={{ fontSize: 110, color: "#3f51b5", mb: 2 }}
                />
              )}

              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, color: "#222" }}
              >
                {student?.name || "Unknown Student"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: "#444" }}>
                {student?.email || "No email"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: "#444" }}>
                📞 {student?.phone || "N/A"}
              </Typography>

              <Box sx={{ width: "100%", mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1, color: "#444" }}>
                  <strong>Role:</strong> {student?.role || "N/A"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#444" }}>
                  <strong>Course:</strong> {student?.branch || "N/A"}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", gap: 2, width: "100%", mt: "auto" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/student/edit-profile");
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                  fullWidth
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default StudentNavbar;
