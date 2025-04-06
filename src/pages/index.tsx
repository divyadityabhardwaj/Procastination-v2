import { useState } from "react";
import LoginModal from "../components/loginModal";
import { Box, Button, Container, Typography, Paper } from "@mui/material";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#121212",
        backgroundImage:
          "linear-gradient(rgba(66, 66, 66, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(66, 66, 66, 0.1) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            bgcolor: "rgba(66, 66, 66, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              color: "white",
              fontWeight: 500,
              mb: 4,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Welcome
          </Typography>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outlined"
            size="large"
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.2)",
              bgcolor: "rgba(0, 0, 0, 0.2)",
              py: 1.5,
              px: 4,
              "&:hover": {
                bgcolor: "rgba(80, 80, 80, 0.95)",
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Login / Sign Up
          </Button>
        </Paper>
      </Container>
      <LoginModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}
