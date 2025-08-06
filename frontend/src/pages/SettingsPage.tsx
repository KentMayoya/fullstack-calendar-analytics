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
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { useUser } from "../setup/app-context-manager/UserContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import {
  useCalendar,
  type Calendar,
} from "../setup/app-context-manager/CalendarContext";
import { useTags } from "../hooks/useTags";
import UnsyncCalendar from "../components/UnsyncCalendarModal";

const SettingsPage = () => {
  const { session, supabase } = useUser();
  const { tags, fetchTags, isLoadingTags } = useTags();

  // Used when fetching calendars from Google Calendar
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [calendarToUnsync, setCalendarToUnSync] = useState<Calendar | null>(
    null
  );

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
  // isLoadingCalendars: Used when fetching calendars from the database
  // updateSyncStatus: Updates the database when a user toggles a switch for
  // a specified calendar
  const {
    setCalendars,
    calendars,
    isLoadingCalendars,
    handleToggleSync: updateSyncStatus,
  } = useCalendar();

  // Controls the visibility of the Sync Info Dialog
  const [isSyncInfoDialogOpen, setIsSyncInfoDialogOpen] =
    useState<boolean>(false);

  // Controls the visibility of the Tag Info Dialog
  const [isTagInfoDialogOpen, setIsTagInfoDialogOpen] =
    useState<boolean>(false);

  // Controls the visibility of the UnsyncCalendarModal
  const [isUnsyncCalendarModalOpen, setIsUnsyncCalendarModalOpen] =
    useState<boolean>(false);

  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState<boolean>(false);

  const [confirmInput, setConfirmInput] = useState<string>("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // If the user does not have a valid session, redirect to the home page
  if (!session?.auth) {
    return <Navigate to="/" replace />;
  }

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

  // If the calendar is to be unsynced, displays the Confirmation modal to
  // unsync an event and updates the calendar's sync status in the database
  const handleToggleSync = (calendar: Calendar) => {
    const { id, isSynced } = calendar;
    if (!isSynced) {
      // If turning ON, start the sync.
      updateSyncStatus(id, isSynced);
    } else {
      // If turning OFF, store the calendar and open the confirmation modal.
      setCalendarToUnSync(calendar);
      setIsUnsyncCalendarModalOpen(true);
    }
  };

  // Calls the endpoint to delete events related to calendarToUnsync
  const handleUnsyncConfirm = () => {
    if (calendarToUnsync) {
      updateSyncStatus(calendarToUnsync.id, calendarToUnsync.isSynced);
    }
    setIsUnsyncCalendarModalOpen(false);
    setCalendarToUnSync(null);
  };

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

  // Deletes the selected tag from the database.
  const handleDeleteClick = async (id: string) => {
    if (!session?.access_token) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tags/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      fetchTags();
    } catch (error: any) {
      console.error(error);
    }
  };

  // Deletes the user account, including all related calendars, events, and
  // tags and ends the user's session.
  const handleDeleteAccount = async () => {
    if (confirmInput.toLowerCase() !== "confirm") {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error deleting user account");
      }
      // This produces an error because the user was deleted. However, this
      // clears session data from the user's local device
      await supabase.auth.signOut();
      // Closing the modal and clearing the useState is handled by the log out
      // redirect
    } catch (error: any) {
      console.error(error);
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
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          component="h2"
          variant="h6"
          sx={{
            fontWeight: "bold",
          }}
        >
          Calendar Sync Settings
        </Typography>
        <IconButton
          onClick={() => setIsSyncInfoDialogOpen(true)}
          aria-label="info"
        >
          <InfoOutlineIcon />
        </IconButton>
      </Box>
      <Dialog
        open={isSyncInfoDialogOpen}
        onClose={() => setIsSyncInfoDialogOpen(false)}
      >
        <DialogTitle>Managing Calendar Sync</DialogTitle>
        <DialogContent>
          <Typography>
            The "Load Calendars" buttons loads your calendars from Google
            Calendar. Click on the toggle to change the calendar's sync status.
            Marking a calendar as syncable schedules an hourly job to sync your
            events. However, this does not trigger an immediate sync. To
            manually trigger a sync, view "Sync Settings" on the calendar page.
          </Typography>
        </DialogContent>
      </Dialog>
      {(isLoadingCalendars || isSyncing) && (
        <Box>
          <CircularProgress />
        </Box>
      )}
      {!isLoadingCalendars && !isSyncing && (
        <List>
          {calendars.map((calendar) => (
            <ListItem key={calendar.id} sx={{ py: 0 }}>
              <ListItemText primary={calendar.name} />
              <Switch
                edge="end"
                checked={calendar.isSynced ?? false}
                onChange={() => handleToggleSync(calendar)}
              />
            </ListItem>
          ))}
        </List>
      )}
      {isUnsyncCalendarModalOpen && calendarToUnsync && (
        <UnsyncCalendar
          handleClose={() => setIsUnsyncCalendarModalOpen(false)}
          calendarName={calendarToUnsync.name}
          handleConfirm={handleUnsyncConfirm}
        ></UnsyncCalendar>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={fetchGoogleCalendars}
      >
        Load Calendars
      </Button>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          component="h2"
          variant="h6"
          sx={{
            fontWeight: "bold",
          }}
        >
          Tag Management
        </Typography>
        <IconButton
          onClick={() => setIsTagInfoDialogOpen(true)}
          aria-label="info"
        >
          <InfoOutlineIcon />
        </IconButton>
      </Box>
      <Dialog
        open={isTagInfoDialogOpen}
        onClose={() => setIsTagInfoDialogOpen(false)}
      >
        <DialogTitle>Managing Tags</DialogTitle>
        <DialogContent>
          <Typography>
            Tags allow you to categorize your events. By adding tags to your
            events, you can view your calendar and tag analytics on the
            Dashboard page.
          </Typography>
        </DialogContent>
      </Dialog>
      {isLoadingTags && (
        <Box>
          <CircularProgress />
        </Box>
      )}
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
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(tag.id)}
                    >
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
        gutterBottom
      >
        Account Management
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={() => setIsDeleteAccountDialogOpen(true)}
      >
        Delete Account
      </Button>
      <Dialog
        open={isDeleteAccountDialogOpen}
        onClose={() => {
          setIsDeleteAccountDialogOpen(false);
          setConfirmInput("");
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "error.main",
          }}
        >
          Are you Sure?
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Deleting your account will delete all your calendars, events, tags,
            and all analytics. This action cannot be reversed. Type confirm
            below to delete your account.
          </Typography>
          <TextField
            onChange={(e) => {
              setConfirmInput(e.target.value);
            }}
            label="Type Confirm"
            variant="standard"
            size="small"
            autoFocus
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsDeleteAccountDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
            >
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
