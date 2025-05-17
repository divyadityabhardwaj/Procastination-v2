import { useState, useEffect } from "react";
import { Box, Typography, IconButton, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ToastProps {
  show: boolean;
  message: string;
  onClose?: () => void;
}

// In src/components/Toast.tsx
// In src/components/Toast.tsx
const StyledToast = styled(Box)({
  position: "fixed",
  top: 20,
  right: 20,
  bgcolor: "#e91e63", // Solid pink color
  color: "#fff",
  p: 2,
  borderRadius: 2,
  zIndex: 9999,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  transition: "opacity 0.2s ease-in-out",
  "&:hover": {
    opacity: 0.9,
  },
  display: "flex",
  alignItems: "center",
  gap: 1,
});

export const Toast = ({ show, message, onClose }: ToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <StyledToast
      sx={{
        bgcolor: "#e91e63", // Override background color
        opacity: 1, // Force full opacity
      }}
    >
      <Typography
        variant="body2"
        sx={{
          p:2,
          fontSize: "0.875rem",
          fontWeight: 500,
          flexGrow: 1,
          color: "#fff", // Ensure text color is white
        }}
      >
        {message}
      </Typography>
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          p: 0.5,
          color: "#fff", // Ensure close icon is white
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </StyledToast>
  );
};
