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

      if (!data.error) {
        if (data.session && data.session.access_token) {
          localStorage.setItem("access_token", data.session.access_token);
          // Dispatch event after token is stored
          window.dispatchEvent(new Event("authChanged"));
        }
      }

      // Add a small delay to ensure the auth state is updated
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);

      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLogin(true); // Reset to login state
    setEmail("");
    setPassword("");
    setError("");
    handleClose();
    router.push("/");
    window.location.reload();
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
          bgcolor: "rgba(40, 40, 40, 0.85)",
          color: "white",
          borderRadius: 3,
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.35)",
          p: 4,
          border: "1.5px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(16px)",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: 3,
            zIndex: 0,
            background:
              "linear-gradient(120deg, rgba(255,213,79,0.08) 0%, rgba(144,202,249,0.08) 100%)",
            pointerEvents: "none",
          },
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "rgba(255, 255, 255, 0.7)",
            zIndex: 1,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
              color: "#ffd54f",
            },
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="auth-modal-title"
          variant="h5"
          gutterBottom
          sx={{
            color: "#ffd54f",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: 1,
            zIndex: 1,
          }}
        >
          {isLogin ? "Welcome back!" : "Create Account"}
        </Typography>

        {isLogin && (
          <Box
            sx={{
              bgcolor: "rgba(255, 213, 79, 0.1)",
              border: "1px solid rgba(255, 213, 79, 0.3)",
              borderRadius: 2,
              p: 2,
              mb: 2,
              zIndex: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#ffd54f",
                fontWeight: 500,
                mb: 1,
                textAlign: "center",
              }}
            >
              Demo Account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.875rem",
                textAlign: "center",
                mb: 1,
              }}
            >
              Email: demo@example.com
              <br />
              Password: 123456
            </Typography>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => {
                setEmail("demo@example.com");
                setPassword("123456");
              }}
              sx={{
                borderColor: "#ffd54f",
                color: "#ffd54f",
                fontSize: "0.75rem",
                py: 0.5,
                "&:hover": {
                  borderColor: "#ffe082",
                  color: "#ffe082",
                  bgcolor: "rgba(255, 213, 79, 0.1)",
                },
              }}
            >
              Use Demo Account
            </Button>
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: red[500],
              border: "1px solid rgba(255, 87, 34, 0.15)",
              zIndex: 1,
              "& .MuiAlert-icon": {
                color: red[500],
              },
            }}
          >
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ position: "relative", zIndex: 1 }}
        >
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
                input: {
                  color: "#fff",
                  fontWeight: 500,
                  letterSpacing: 0.5,
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.18)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffd54f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffd54f",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 400,
                  letterSpacing: 0.5,
                  "&.Mui-focused": {
                    color: "#ffd54f",
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
                input: {
                  color: "#fff",
                  fontWeight: 500,
                  letterSpacing: 0.5,
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.18)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffd54f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffd54f",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 400,
                  letterSpacing: 0.5,
                  "&.Mui-focused": {
                    color: "#ffd54f",
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
                bgcolor: "#ffd54f",
                color: "#232526",
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: 2,
                border: "none",
                textTransform: "none",
                py: 1.5,
                mt: 2,
                fontSize: "1.1rem",
                letterSpacing: 0.5,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "#ffe082",
                  color: "#232526",
                },
              }}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              variant="text"
              fullWidth
              sx={{
                color: "#ffd54f",
                fontWeight: 500,
                letterSpacing: 0.5,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#fff",
                  textDecoration: "underline",
                },
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
