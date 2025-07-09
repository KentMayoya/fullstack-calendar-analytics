import AuthStatus from "./AuthStatus";
import BackendMessage from "../components/BackendMessage";
import { Box, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      flex="1"
    >
      <Typography>Full-Stack Calendar Analytics</Typography>
      <AuthStatus />
      <BackendMessage />
    </Box>
  );
};

export default HomePage;
