import { useState } from "react";
import ReusableModal from "./ReusableModal";
import {
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  useCalendar,
  toggleIdInSet,
} from "../setup/app-context-manager/CalendarContext";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

type DisplaySettingsModalProps = {
  handleClose: () => void;
  handleGoToSettings: () => void;
};

const DisplaySettingsModal = ({
  handleClose,
  handleGoToSettings,
}: DisplaySettingsModalProps) => {
  const {
    syncedCalendars,
    loading,
    selectedIds: savedSelectedIds,
    saveSelectedIds,
  } = useCalendar();

  // As the user is able to save or cancel their changes, this modal will have
  // a local copy
  const [draftSelectedIds, setDraftSelectedIds] = useState(savedSelectedIds);

  // Controls the visibility of the Info Dialog
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState<boolean>(false);

  // Saves the selectedIds managed by CalendarContext using the selected Ids
  // in draftSelectedIds
  const handleSave = () => {
    saveSelectedIds(draftSelectedIds);
    handleClose();
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
            }}
          >
            Calendar View
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <ToggleButtonGroup exclusive>
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="list">List</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: "bold",
              }}
            >
              Displayed Calendars
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
            <DialogTitle>Managing Displayed Calendars</DialogTitle>
            <DialogContent>
              <Typography>
                You can modify the visiblity of your calendars here. Only the
                calendars marked as syncable under "Calendar Sync Settings" on
                the Settings page are displayed. Displaying a calendar does not
                trigger a sync for your calendar events. To sync events, see
                "Sync Settings".
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
                        checked={draftSelectedIds.has(calendar.id)}
                        onChange={() =>
                          setDraftSelectedIds((prev) =>
                            toggleIdInSet(prev, calendar.id)
                          )
                        }
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
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
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

export default DisplaySettingsModal;
