import { useState } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material";
import { useCalendar } from "../hooks/useCalendar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../setup/app-context-manager/UserContext";
import ReusableModal from "./ReusableModal";

type SyncSettingsModalProps = {
  handleClose: () => void;
};

const SyncSettingsModal = ({ handleClose }: SyncSettingsModalProps) => {
  const { calendars, loading } = useCalendar();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { session } = useUser();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // This method is triggered every time a checkbox is clicked. If the triggering
  // calendarId is already in the set, remove it. Otherwise, add it.
  const handleSelectionChange = (calendarId: string) => {
    setSelectedIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(calendarId)) {
        newSelectedIds.delete(calendarId);
      } else {
        newSelectedIds.add(calendarId);
      }
      return newSelectedIds;
    });
  };

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
              (calendars.length === 0 ? (
                <Typography
                  sx={{ color: "text.secondary", textAlign: "center" }}
                >
                  No calendars found.
                </Typography>
              ) : (
                // If not empty, map over the array as before
                calendars.map((calendar) => (
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
            {calendars.length > 0 ? (
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
