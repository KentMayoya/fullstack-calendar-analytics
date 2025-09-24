import { Box, Typography, Divider, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer">
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Google Calendar™ is a trademark of Google LLC. This application is not
        affiliated with or endorsed by Google LLC.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {" "}
        <Link href="/privacy" rel="noopener">
          Privacy
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
