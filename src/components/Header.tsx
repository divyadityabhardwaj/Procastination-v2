import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isAuth, setIsAuth] = useState(!!accessToken);

  React.useEffect(() => {
    setIsAuth(!!accessToken);
  }, [accessToken]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogin = () => {
    handleClose();
    router.push("/");
    window.dispatchEvent(new Event("openLoginModal"));
  };
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    handleClose();
    setIsAuth(false);
    window.dispatchEvent(new Event("authChanged"));
    router.push("/");
    window.location.reload();
  };

  return (
    <Box sx={{ position: "fixed", top: 16, right: 24, zIndex: 1300 }}>
      <Tooltip title="Account & Settings">
        <IconButton
          onClick={handleMenu}
          size="large"
          sx={{ color: "#ffd54f", bgcolor: "rgba(255,255,255,0.06)", p: 0.5 }}
        >
          <Avatar
            sx={{ bgcolor: "#232526", color: "#ffd54f", width: 36, height: 36 }}
          >
            <AccountCircleIcon fontSize="medium" />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 220,
            bgcolor: "rgba(40,40,40,0.98)",
            color: "#fff",
            borderRadius: 2,
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)",
            border: "1.5px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(10px)",
            p: 0.5,
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {isAuth ? (
          <MenuItem
            onClick={handleLogout}
            sx={{ color: "#ffd54f", fontWeight: 600 }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: "#ffd54f" }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        ) : (
          <MenuItem
            onClick={handleLogin}
            sx={{ color: "#ffd54f", fontWeight: 600 }}
          >
            <ListItemIcon>
              <LoginIcon fontSize="small" sx={{ color: "#ffd54f" }} />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default Header;
