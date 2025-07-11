import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import { Toolbar } from "@mui/material";

function App() {
  return (
    <>
      <Header></Header>
      <Toolbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
