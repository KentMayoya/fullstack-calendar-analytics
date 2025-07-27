import { useState } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  useCalendar,
  toggleIdInSet,
} from "../setup/app-context-manager/CalendarContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../setup/app-context-manager/UserContext";
import ReusableModal from "./ReusableModal";

type SyncSettingsModalProps = {
  handleClose: () => void;
};

const SyncSettingsModal = ({ handleClose }: SyncSettingsModalProps) => {
  const { session } = useUser();

  // calendars contains a list of Calendars' id, name, and isSynced
  // loading is true if the calendars are still being fetched. Otherwise, false
  const { syncedCalendars, loading } = useCalendar();

  const navigate = useNavigate();

  // A local copy of selectedIds that contain the ids of the calendars
  // the user wishes to sync.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  // Closes the Modal and redirects the user to /settings
  const handleGoToSettings = () => {
    handleClose();
    navigate("/settings");
  };

  return (
    <ReusableModal isOpen={true} handleClose={handleClose}>
      {!loading && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            My Calendars
          </Typography>
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
