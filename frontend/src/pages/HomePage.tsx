import AuthStatus from "./AuthStatus";
import BackendMessage from "../components/BackendMessage";
import { Typography } from "@mui/material";

const HomePage = () => {
  return (
    <>
      <Typography>Full-Stack Calendar Analytics</Typography>
      <AuthStatus />
      <BackendMessage />
    </>
  );
};

export default HomePage;
