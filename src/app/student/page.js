"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function StudentLandingPage() {
  const [userName] = useState("Vikas");
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v1/inject.js";
    script.async = true;
    document.body.appendChild(script);

    window.botpressWebChat = {
      botId: "your-bot-id",
      clientId: "your-client-id",
      hostUrl: "https://cdn.botpress.cloud/webchat/v1",
      messagingUrl: "https://messaging.botpress.cloud",
      botName: "University Assistant",
      avatarUrl: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
      showPoweredBy: false,
      enableConversationDeletion: true,
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        m: 0,
        p: 0,
        width: "100%",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#0A2A66",
          color: "white",
          py: 10,
          px: { xs: 2, sm: 4, md: 6 },
          width: "100%",
          display: "flex",
          justifyContent: "center", // horizontally center content
          textAlign: "center", // text centered for all screens
        }}
      >
        <Box sx={{ maxWidth: 800 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Welcome, to NOC APPLICATION!
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: "700px", mx: "auto", opacity: 0.85, mb: 4 }}
          >
            Access all your student services in one place — from hostel queries to
            applying for NOC, out passes, and getting your bonafide certificates.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#2ECC71",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#27AE60" },
              }}
              onClick={() => router.push("/student")}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Cards Section */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4, md: 6 }, width: "100%", m: 0 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: "Hostel Queries",
              desc: "Submit and track your hostel-related requests easily.",
              action: "issue",
            },
            {
              title: "Apply NOC",
              desc: "Request and manage your No Objection Certificates online.",
              action: "noc",
            },
            {
              title: "Apply for Out Pass",
              desc: "Apply for out passes quickly and get approvals faster.",
              action: "outpass",
            },
            {
              title: "Get Your Bonafide Certificate",
              desc: "Download your verified bonafide certificates anytime.",
              action: "bonafide",
            },
          ].map((card, index) => (
            <Grid key={index} item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 4, height: "100%" }}>
                <CardActionArea
                  onClick={() => router.push(`/student/${card.action}`)}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minHeight: "50px" }}
                    >
                      {card.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#0A2A66",
          color: "white",
          py: 3,
          textAlign: "center",
          mt: "auto",
          width: "100%",
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Your University. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
