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
import { useCalendar } from "../hooks/useCalendar";

const SettingsPage = () => {
  const context = useUser();
  const { session } = context;
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const { setCalendars, calendars, loading, fetchCalendars } = useCalendar();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetches Google Calendars through the Google Calendar API and calls
  // fetchCalendars to update the UI
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
      await fetchCalendars();
    } catch (error) {
      console.log(error);
      // do something
    } finally {
      setIsSyncing(false);
    }
  };

  // Updates the database when a user toggles a switch for a specified calendar
  const handleToggleSync = async (
    calendarId: string,
    currentStatus: boolean
  ) => {
    if (!session?.access_token) {
      return;
    }
    // Traverse through the list of calendars. Switch the sync status of the
    // calendar that is toggled. This takes place before the API call.
    setCalendars((currentCalendars) =>
      currentCalendars.map((calendar) =>
        calendar.id === calendarId
          ? { ...calendar, isSynced: !currentStatus }
          : calendar
      )
    );
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/calendars/${calendarId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ isSynced: !currentStatus }),
        }
      );
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
    } catch (err) {
      console.log(err);
      // Toggle failed, undo the optimistic UI toggle update.
      setCalendars((currentCalendars) =>
        currentCalendars.map((calendar) =>
          calendar.id === calendarId
            ? { ...calendar, isSynced: currentStatus }
            : calendar
        )
      );
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
