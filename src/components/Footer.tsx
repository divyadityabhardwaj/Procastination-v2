import { Box, Typography } from "@mui/material";

const Footer = () => (
  <Box sx={{ py: 2, textAlign: "center", bgcolor: "#222", color: "#aaa", mt: 4 }}>
    <Typography variant="body2">
      &copy; {new Date().getFullYear()} Procastination App. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;