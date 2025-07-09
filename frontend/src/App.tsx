import BackendMessage from "./components/BackendMessage";
import AuthStatus from "./pages/AuthStatus";
import { Typography } from "@mui/material";
import "./App.css";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header></Header>
      <Typography>Full-Stack Calendar Analytics</Typography>
      <AuthStatus />
      <BackendMessage />
    </>
  );
}

export default App;
