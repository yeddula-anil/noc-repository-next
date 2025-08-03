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
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

export default function CaretakerNavbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Dummy user data
  const user = {
    name: "Vikas Yeddula",
    email: "vikas@college.edu",
    phone: "9876543210",
    role: "Caretaker",
    hostel: "BH-1",
  };

  const handleLogout = () => {
    console.log("Logged out");
    router.push("/login");
  };

  const handleProfileClick = () => {
    if (isSmallScreen) {
      router.push("/caretaker/profile");
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          {/* Profile Icon on Left */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="profile"
            sx={{ mr: 2 }}
            onClick={handleProfileClick}
          >
            <AccountCircleIcon />
          </IconButton>

          {/* Spacer */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            DSW Dashboard
          </Typography>

          {/* Navbar Options */}
          <Button color="inherit" onClick={() => router.push("/caretaker/nocs")}>
            NOCs
          </Button>
          <Button
            color="inherit"
            onClick={() => router.push("/caretaker/outpasses")}
          >
            Outpasses
          </Button>
          <Button
            color="inherit"
            onClick={() => router.push("/caretaker/hostel-queries")}
          >
            Hostel Queries
          </Button>
        </Toolbar>
      </AppBar>

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
            }}
        >
          {/* Profile Icon at Top Center */}
          <label htmlFor="profile-pic-upload">
            <IconButton
              component="span"
              sx={{
                bgcolor: "#e8eaf6",
                mb: 2,
                "&:hover": { bgcolor: "#c5cae9" },
                width: 110,
                height: 110,
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 80, color: "#3f51b5" }} />
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
              }
            }}
          />

          {/* User Info */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 1, color: "#212121" }}
          >
            {user.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: "#212121" }}>
            {user.email}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "#212121" }}>
            📞 {user.phone}
          </Typography>

          <Box sx={{ width: "100%", mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1, color: "#212121" }}>
              <strong>Role:</strong> {user.role}
            </Typography>
            <Typography variant="body1" sx={{ color: "#212121" }}>
              <strong>Hostel:</strong> {user.hostel}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, width: "100%", mt: "auto" }}>
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
        </Box>
      </Modal>
    </>
  );
}
