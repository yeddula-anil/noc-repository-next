"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Modal,
  Box,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { signOut, useSession } from "next-auth/react";

export default function CaretakerNavbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [staff, setStaff] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: session, status } = useSession();

  const email = session?.user?.email;

  // Fetch staff profile based on email
  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await fetch(
          `/api/staff/get-profile?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
        setStaff(data);
      } catch (err) {
        console.error("Failed to fetch staff profile:", err);
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
    if (isSmallScreen) {
      router.push("/caretaker/profile");
    } else {
      setOpen(true);
    }
  };

  const navItems = [
    { label: "NOCs", path: "/caretaker/nocs" },
    { label: "Outpasses", path: "/caretaker/outpasses" },
    { label: "Hostel Queries", path: "/caretaker/hostel-queries" },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          {/* Profile Icon and "my-profile" label */}
          <Box
            onClick={handleProfileClick}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mr: 2,
              gap: 1,
            }}
          >
            {staff?.profilePic ? (
              <img
                src={staff.profilePic}
                alt="Profile"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 56, flexShrink: 0 }} />
            )}
            <Typography
              variant="subtitle1"
              sx={{ color: "white", fontWeight: "bold", userSelect: "none" }}
            >
              my-profile
            </Typography>
          </Box>

          {/* Spacer */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Caretaker Dashboard
          </Typography>

          {/* Navbar Options */}
          {isSmallScreen ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="toggle menu"
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </Button>
            ))
          )}
        </Toolbar>
      </AppBar>

      {/* Collapsible menu below navbar for mobile */}
      {isSmallScreen && (
        <Collapse in={menuOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              bgcolor: "black",
              display: "flex",
              flexDirection: "column",
              px: 2,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                sx={{ justifyContent: "flex-start", py: 1 }}
                onClick={() => {
                  router.push(item.path);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Collapse>
      )}

      {/* Profile Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
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
            textAlign: "center", // center align all text
          }}
        >
          {loadingProfile ? (
            <Typography variant="body1">Loading profile...</Typography>
          ) : (
            <>
              {/* Profile Image or Icon */}
              <label htmlFor="profile-pic-upload">
                <IconButton
                  component="span"
                  sx={{
                    bgcolor: "#e8eaf6",
                    mb: 2,
                    "&:hover": { bgcolor: "#c5cae9" },
                    width: 130,
                    height: 130,
                    overflow: "hidden",
                    mx: "auto",
                  }}
                >
                  {staff?.profilePic ? (
                    <img
                      src={staff.profilePic}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <AccountCircleIcon
                      sx={{ fontSize: 80, color: "#3f51b5" }}
                    />
                  )}
                </IconButton>
              </label>
              <input
                type="file"
                id="profile-pic-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("Profile pic uploaded:", file.name);
                    // TODO: handle upload & update profile pic
                  }
                }}
              />

              {/* User Info */}
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, color: "#212121" }}
              >
                {staff?.name || "Unknown User"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: "#212121" }}>
                {staff?.email || "No email"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: "#212121" }}>
                📞 {staff?.phone || "N/A"}
              </Typography>

              <Box sx={{ width: "100%", mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1, color: "#212121" }}>
                  <strong>Role:</strong> {staff?.role || "N/A"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#212121" }}>
                  <strong>Hostel:</strong> {staff?.hostel || "N/A"}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{ display: "flex", gap: 2, width: "100%", mt: "auto" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setOpen(false);
                    router.push("/caretaker/edit-profile");
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
}
