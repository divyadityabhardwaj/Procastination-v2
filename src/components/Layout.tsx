import { Box } from "@mui/material";
import Header from "./Header";
import LoginModal from "./loginModal";

interface LayoutProps {
  children: React.ReactNode;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
}

const Layout = ({
  children,
  loginModalOpen,
  setLoginModalOpen,
}: LayoutProps) => (
  <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <Header />
    <LoginModal
      open={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
    />
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Box>
);

export default Layout;
