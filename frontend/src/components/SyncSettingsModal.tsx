import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material";
import { useCalendar } from "../hooks/useCalendar";
import { useNavigate } from "react-router-dom";

type SyncSettingsModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "60%",
    lg: "30%",
  },
  minHeight: 100,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SyncSettingsModal = ({ isOpen, handleClose }: SyncSettingsModalProps) => {
  const { calendars, loading } = useCalendar();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

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

  const handleSyncEvents = () => {
    const calendarIdsToSync = Array.from(selectedIds);
    calendarIdsToSync.forEach((calendarId) => {});
    handleClose();
  };

  const handleGoToSettings = () => {
    handleClose();
    navigate("/settings");
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        {!loading && (
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
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
      </Box>
    </Modal>
  );
};

export default SyncSettingsModal;
