import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Alert,
  Backdrop,
  AlertTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { red } from "@mui/material/colors";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `/api/auth/${isLogin ? "login" : "signup"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      router.push("/dashboard");

      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };


  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="auth-modal-title"
      BackdropComponent={Backdrop}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(3px)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400, md: 500, lg: 600 },
          bgcolor: "rgba(66, 66, 66, 0.95)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          p: 4,
          border: "1px solid",
          borderColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
              color: "white",
            },
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="auth-modal-title"
          variant="h6"
          gutterBottom
          sx={{
            color: "white",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {isLogin ? "Welcome back!" : "Create Account"}
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              backgroundColor: "transparent",
              color: red[500],
              "& .MuiAlert-icon": {
                color: red[500],
              },
            }}
          >
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "rgba(255, 255, 255, 0.9)",
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "rgba(255, 255, 255, 0.9)",
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                bgcolor: "rgba(66, 66, 66, 0.95)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  bgcolor: "rgba(80, 80, 80, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                textTransform: "none",
                py: 1.5,
                mt: 2,
              }}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              variant="text"
              fullWidth
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "white",
                },
                textTransform: "none",
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
