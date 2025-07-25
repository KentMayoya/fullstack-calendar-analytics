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
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../setup/app-context-manager/UserContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useCalendar } from "../setup/app-context-manager/CalendarContext";
import { useTags } from "../hooks/useTags";

const SettingsPage = () => {
  const { session } = useUser();
  const {
    tags,
    fetchTags,
    isLoading: isLoadingTags,
    error: tagError,
  } = useTags();

  // Used when fetching calendars from Google Calendar
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Boolean flag to display textbox
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false);

  // Value used to send to endpoints
  const [newTagName, setNewTagName] = useState<string>("");

  // The message that is displayed upon tag creation error
  const [tagUpsertError, setTagUpsertError] = useState<string>("");

  // Stores the id of the tag being edited.
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  // Temporarily stores the edited tags name before saving.
  const [editedTagName, setEditedTagName] = useState<string>("");

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

  // Calls /api/v1/tags endpoint to create a tag
  const handleCreateTag = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ name: newTagName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      fetchTags();
      setNewTagName("");
      setIsAddingTag(false);
    } catch (error: any) {
      setTagUpsertError(error.message);
    }
  };

  // Sets useState to display editing view
  const handleEditClick = (tag: { id: string; name: string }) => {
    setEditingTagId(tag.id);
    setEditedTagName(tag.name);
  };

  // Sets useState to display normal view
  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditedTagName("");
  };

  // Updates the selected tag's name in the database.
  const handleUpdateTag = async () => {
    if (!session?.access_token || !editingTagId) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tags/${editingTagId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name: editedTagName }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      fetchTags();
      handleCancelEdit();
    } catch (error: any) {
      console.error(error);
      setTagUpsertError(error.message);
    }
  };

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
                editingTagId === tag.id ? (
                  // Icons for the editing view
                  <>
                    <IconButton
                      onClick={handleUpdateTag}
                      color="primary"
                      edge="end"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} edge="end">
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  // Icons for the normal view
                  <>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditClick(tag)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }
            >
              {editingTagId === tag.id ? (
                // TextField for the editing view
                <TextField
                  value={editedTagName}
                  onChange={(e) => {
                    setEditedTagName(e.target.value);
                    setTagUpsertError("");
                  }}
                  variant="standard"
                  size="small"
                  autoFocus
                  slotProps={{
                    input: {
                      inputProps: {
                        maxLength: 50,
                      },
                    },
                  }}
                  error={!!tagUpsertError}
                  helperText={tagUpsertError || `${editedTagName.length} / 50`}
                />
              ) : (
                // Regular display text for normal view
                <ListItemText primary={tag.name} />
              )}
            </ListItem>
          ))}
          {isAddingTag && (
            <ListItem
              secondaryAction={
                <>
                  <IconButton
                    color="primary"
                    edge="end"
                    aria-label="save"
                    onClick={handleCreateTag}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="cancel"
                    onClick={() => {
                      setIsAddingTag(false);
                      setNewTagName("");
                      setTagUpsertError("");
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              }
            >
              <TextField
                value={newTagName}
                onChange={(e) => {
                  setNewTagName(e.target.value);
                  setTagUpsertError("");
                }}
                label="New Tag Name"
                variant="standard"
                size="small"
                autoFocus
                slotProps={{
                  input: {
                    inputProps: {
                      maxLength: 50,
                    },
                  },
                }}
                error={!!tagUpsertError}
                helperText={tagUpsertError || `${newTagName.length} / 50`}
              ></TextField>
            </ListItem>
          )}
        </List>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsAddingTag(true)}
        disabled={isAddingTag}
      >
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
