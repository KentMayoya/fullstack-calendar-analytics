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
import { useEffect, useState } from "react";

interface Calendar {
  id: string;
  name: string;
  isSynced: boolean;
}

const SettingsPage = () => {
  const context = useUser();
  const { session } = context;
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // If the session has no access token, return nothing
  useEffect(() => {
    if (!session?.access_token) {
      return;
    }
    fetchCalendars();
  }, [session?.access_token]);

  const fetchGoogleCalendars = async () => {
    setLoading(true);
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
    } catch (err: any) {
      // do something
    } finally {
      setLoading(false);
    }
  };

  // Calls /api/v1/calendars to fetch calendars
  const fetchCalendars = async () => {
    try {
      setLoading(true);
      if (!session?.access_token) {
        throw new Error("No access token available");
      }
      const response = await fetch(`${API_BASE_URL}/api/v1/calendars`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch calendars");
      }
      const data = await response.json();
      setCalendars(data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
      {loading && (
        <Box>
          <CircularProgress />
        </Box>
      )}
      {!loading && !error && (
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
