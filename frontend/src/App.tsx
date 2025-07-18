import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import { Toolbar } from "@mui/material";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <>
      <Header></Header>
      <Toolbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
