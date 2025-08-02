import { useState } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  useCalendar,
  toggleIdInSet,
} from "../setup/app-context-manager/CalendarContext";
import { useUser } from "../setup/app-context-manager/UserContext";
import ReusableModal from "./ReusableModal";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

type SyncSettingsModalProps = {
  handleClose: () => void;
  handleGoToSettings: () => void;
};

const SyncSettingsModal = ({
  handleClose,
  handleGoToSettings,
}: SyncSettingsModalProps) => {
  const { session } = useUser();

  // calendars contains a list of Calendars' id, name, and isSynced
  // loading is true if the calendars are still being fetched. Otherwise, false
  const { syncedCalendars, loading } = useCalendar();

  // A local copy of selectedIds that contain the ids of the calendars
  // the user wishes to sync.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Controls the visibility of the Info Dialog
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState<boolean>(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetches Google Calendar events from the selected calendar checkboxes
  const handleSyncEvents = async () => {
    if (!session?.access_token) {
      console.log("no access token. returning");
      return;
    }
    const calendarIdsToSync = Array.from(selectedIds);
    for (const calendarId of calendarIdsToSync) {
      console.log(`starting calendar sync for ${calendarId}`);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/calendars/${calendarId}/sync`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Sync failed for calendar ${calendarId} with status ${response.status}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
    console.log("All selected syncs have been initiated.");
    handleClose();
  };

  // Function is triggered when a user checks or unchecks the calendar
  // checkboxes. Syncs the ids in selectedIds.
  const handleSelectionChange = (calendarId: string) => {
    setSelectedIds((prev) => toggleIdInSet(prev, calendarId));
  };

  return (
    <ReusableModal isOpen={true} handleClose={handleClose}>
      {!loading && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: "bold",
              }}
            >
              My Calendars
            </Typography>
            <IconButton
              onClick={() => setIsInfoDialogOpen(true)}
              aria-label="info"
            >
              <InfoOutlineIcon />
            </IconButton>
          </Box>
          <Dialog
            open={isInfoDialogOpen}
            onClose={() => setIsInfoDialogOpen(false)}
          >
            <DialogTitle>Syncing Calendars</DialogTitle>
            <DialogContent>
              <Typography>
                You can select which calendars to sync here. Only the calendars
                marked as syncable under "Calendar Sync Settings" on the
                Settings page are displayed. Calendar events that were created,
                modified, or deleted within the last 30 days are synced. Syncing
                a calendar does not automatically display the calendar event's
                visibility. To modify visibility, see "Display Settings".
              </Typography>
            </DialogContent>
          </Dialog>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              maxHeight: 200,
            }}
          >
            {loading && <CircularProgress />}
            {!loading &&
              (syncedCalendars.length === 0 ? (
                <Typography
                  sx={{ color: "text.secondary", textAlign: "center" }}
                >
                  No calendars found.
                </Typography>
              ) : (
                // If not empty, map over the array as before
                syncedCalendars.map((calendar) => (
                  <FormControlLabel
                    key={calendar.id}
                    control={
                      <Checkbox
                        checked={selectedIds.has(calendar.id)}
                        onChange={() => handleSelectionChange(calendar.id)}
                      />
                    }
                    label={calendar.name}
                  />
                ))
              ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button variant="contained" color="primary" onClick={handleClose}>
              Cancel
            </Button>
            {syncedCalendars.length > 0 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSyncEvents}
              >
                Sync Events
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleGoToSettings}
              >
                Settings
              </Button>
            )}
          </Box>
        </Box>
      )}
    </ReusableModal>
  );
};

export default SyncSettingsModal;
