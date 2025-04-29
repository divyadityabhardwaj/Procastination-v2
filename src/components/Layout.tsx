import Header from "./Header";
import Footer from "./Footer";
import { Box } from "@mui/material";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <Header />
    <Box sx={{ flex: 1 }}>{children}</Box>
    <Footer />
  </Box>
);

export default Layout;
