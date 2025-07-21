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
} from "@mui/material";
import {
  useCalendar,
  toggleIdInSet,
} from "../setup/app-context-manager/CalendarContext";

type DisplaySettingsModalProps = {
  handleClose: () => void;
};

const DisplaySettingsModal = ({ handleClose }: DisplaySettingsModalProps) => {
  const {
    calendars,
    loading,
    selectedIds: savedSelectedIds,
    saveSelectedIds,
  } = useCalendar();

  // As the user is able to save or cancel their changes, this modal will have
  // a local copy
  const [draftSelectedIds, setDraftSelectedIds] = useState(savedSelectedIds);

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
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Displayed Calendars
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
            {calendars.length > 0 ? (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button variant="contained" color="primary">
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
