import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Switch,
  Button,
} from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import {
  type Calendar,
  useCalendar,
} from "../../setup/app-context-manager/CalendarContext";
import UnsyncCalendarModal from "../modals/UnsyncCalendarModal";
import { useUser } from "../../setup/app-context-manager/UserContext";

const CalendarSyncSettings = () => {
  const { session } = useUser();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Controls the visibility of the Sync Info Dialog
  const [isSyncInfoDialogOpen, setIsSyncInfoDialogOpen] =
    useState<boolean>(false);

  // calendars: Contains a list of calendars from the database
  // isLoadingCalendars: Used when fetching calendars from the database
  // updateSyncStatus: Updates the database when a user toggles a switch for a specified calendar
  const {
    calendars,
    setCalendars,
    isLoadingCalendars,
    handleToggleSync: updateSyncStatus,
  } = useCalendar();

  // Used when fetching calendars from Google Calendar
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [calendarToUnsync, setCalendarToUnSync] = useState<Calendar | null>(
    null
  );

  // Controls the visibility of the UnsyncCalendarModal
  const [isUnsyncCalendarModalOpen, setIsUnsyncCalendarModalOpen] =
    useState<boolean>(false);

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

  return (
    <>
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
        <UnsyncCalendarModal
          handleClose={() => {
            setIsUnsyncCalendarModalOpen(false);
            setCalendarToUnSync(null);
          }}
          calendar={calendarToUnsync}
        ></UnsyncCalendarModal>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={fetchGoogleCalendars}
      >
        Load Calendars
      </Button>
    </>
  );
};

export default CalendarSyncSettings;
