import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import DashboardPage from "./pages/DashboardPage";
import { Toolbar } from "@mui/material";
import SettingsPage from "./pages/SettingsPage";
import { CalendarContextProvider } from "./setup/app-context-manager/CalendarContext";

function App() {
  return (
    <>
      <Header></Header>
      <Toolbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/calendar"
            element={
              <CalendarContextProvider>
                <CalendarPage />
              </CalendarContextProvider>
            }
          />
          <Route
            path="/settings"
            element={
              <CalendarContextProvider>
                <SettingsPage />
              </CalendarContextProvider>
            }
          />
          <Route
            path="/dashboard"
            element={
              <CalendarContextProvider>
                <DashboardPage />
              </CalendarContextProvider>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
