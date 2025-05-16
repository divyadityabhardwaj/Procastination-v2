import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import LoginModal from "./loginModal";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const user = useAuth();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (user && user.user?.id) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [user]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = () => {
    setIsModalOpen(true);
    router.push("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
    setIsAuth(false);
    // window.location.reload();
  };

  return (
    <AppBar position="static" color="primary" elevation={2} sx={{ height: 35 }}>
      <Toolbar sx={{ minHeight: "auto" }}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            mb: 4,
            minWidth: 0,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              cursor: "pointer",
              transition: "box-shadow 0.2s",
              "&:hover": {
                boxShadow: 2,
                opacity: 0.85,
              },
              py: 0.5,
              px: 1,
              borderRadius: 2,
            }}
            onClick={() => {
              router.push("/");
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 18 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: 1,
                fontSize: { xs: "1.1rem", sm: "1.2rem" },
                color: "inherit",
                userSelect: "none",
              }}
            >
              Procastination
            </Typography>
          </Stack>
        </Box>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ContactMailIcon />}
          onClick={() => router.push("/contact")}
          sx={{
            height: "24px",
            mx: 0.5,
            mb: 4,
            borderRadius: 2,
            fontWeight: 600,
            letterSpacing: 1,
            fontSize: "1rem",
            transition: "all 0.2s",
            "&:hover": {
              background: "#fff",
              color: "#1976d2",
              borderColor: "#1976d2",
              boxShadow: "0 2px 8px rgba(25,118,210,0.1)",
            },
          }}
        >
          Contact
        </Button>
        {!isAuth ? (
          <Button
            variant="contained"
            color="success"
            endIcon={<LoginIcon />}
            onClick={handleLogin}
            sx={{
              mx: 0.5,
              mb: 4,
              borderRadius: 2,
              fontWeight: 600,
              letterSpacing: 1,
              fontSize: "0.8rem",
              px: 1,
              height: "24px",
              boxShadow: "0 2px 4px rgba(46,125,50,0.15)",
              transition: "all 0.2s",
              "&:hover": {
                background: "#fff",
                color: "#388e3c",
                borderColor: "#388e3c",
              },
            }}
          >
            Login
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            endIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              mx: 0.5,
              mb: 4,
              borderRadius: 2,
              fontWeight: 600,
              letterSpacing: 1,
              fontSize: "0.8rem",
              px: 1,
              height: "24px",
              boxShadow: "0 2px 4px rgba(233,30,99,0.15)",
              transition: "all 0.2s",
              "&:hover": {
                background: "#fff",
                color: "#d32f2f",
                borderColor: "#d32f2f",
              },
            }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
      <LoginModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppBar>
  );
};

export default Header;
