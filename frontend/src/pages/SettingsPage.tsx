import {
  Typography,
  Divider,
  TextField,
  Box,
  Switch,
  Button,
  CircularProgress,
} from "@mui/material";
import { useUser } from "../setup/app-context-manager/UserContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useCalendar } from "../setup/app-context-manager/CalendarContext";

const SettingsPage = () => {
  const context = useUser();
  const { session } = context;

  // Used when fetching calendars from Google Calendar
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // calendars: Contains a list of calendars from the database
  // loading: Used when fetching calendars from the database
  // handleToggleSync: Updates the database when a user toggles a switch for
  // a specified calendar
  const { setCalendars, calendars, loading, handleToggleSync } = useCalendar();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetches Google Calendars through the Google Calendar API
  const fetchGoogleCalendars = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/calendars/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch calendars");
      }
      const updatedCalendars = await response.json();
      setCalendars(updatedCalendars);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSyncing(false);
    }
  };

  // If the user does not have a valid session, redirect to the home page
  if (!session?.auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ p: { xs: 1, lg: 3 } }}>
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Profile and Preferences
      </Typography>
      <Typography sx={{ my: 2 }}>Email: {session?.profile?.email}</Typography>
      <TextField
        label="Display Name"
        variant="outlined"
        defaultValue={session?.profile?.fullName}
        fullWidth
        sx={{
          maxWidth: { xs: "95%", lg: "20%" },
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 2,
        }}
      >
        <Typography>Dark Mode</Typography>
        <Switch />
      </Box>
      <Button variant="contained" color="primary">
        Save
      </Button>
      <Divider sx={{ my: 2 }} />
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Calendar Sync Settings
      </Typography>
      {(loading || isSyncing) && (
        <Box>
          <CircularProgress />
        </Box>
      )}
      {!loading && !isSyncing && (
        <Box>
          {calendars.map((calendar) => (
            <Box
              key={calendar.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>{calendar.name}</Typography>
              <Switch
                checked={calendar.isSynced ?? false}
                onChange={() =>
                  handleToggleSync(calendar.id, calendar.isSynced)
                }
              ></Switch>
            </Box>
          ))}
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={fetchGoogleCalendars}
      >
        Load Calendars
      </Button>
      <Divider sx={{ my: 2 }} />
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Tag Management
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Account Management
      </Typography>
    </Box>
  );
};

export default SettingsPage;
