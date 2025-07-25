import {
  Typography,
  Divider,
  TextField,
  Box,
  Switch,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUser } from "../setup/app-context-manager/UserContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useCalendar } from "../setup/app-context-manager/CalendarContext";
import { useTags } from "../hooks/useTags";

const SettingsPage = () => {
  const { session } = useUser();
  const { tags, isLoading: isLoadingTags, error: tagError } = useTags();

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
        <List>
          {calendars.map((calendar) => (
            <ListItem key={calendar.id} sx={{ py: 0 }}>
              <ListItemText primary={calendar.name} />
              <Switch
                edge="end"
                checked={calendar.isSynced ?? false}
                onChange={() =>
                  handleToggleSync(calendar.id, calendar.isSynced)
                }
              />
            </ListItem>
          ))}
        </List>
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
      {isLoadingTags && <CircularProgress />}
      {!isLoadingTags && (
        <List>
          {tags.map((tag) => (
            <ListItem
              key={tag.id}
              sx={{ py: 0 }}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={tag.name} />
            </ListItem>
          ))}
        </List>
      )}

      <Button variant="contained" color="primary">
        Add New Tag
      </Button>
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
