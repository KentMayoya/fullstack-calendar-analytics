import ReusableModal from "./ReusableModal";
import {
  Box,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  useCalendar,
  type Calendar,
} from "../../setup/app-context-manager/CalendarContext";

type UnsyncCalendarProps = {
  handleClose: () => void;
  calendar: Calendar;
};

const UnsyncCalendarModal = ({
  handleClose,
  calendar,
}: UnsyncCalendarProps) => {
  const { handleToggleSync, isUnsyncingEvents } = useCalendar();

  // Calls the endpoint to delete events related to calendarToUnsync
  const handleUnsyncConfirm = async () => {
    await handleToggleSync(calendar.id, calendar.isSynced);
    handleClose();
  };

  return (
    <ReusableModal
      isOpen={true}
      // Do not allow the user to close the Modal until syncing finishes
      handleClose={isUnsyncingEvents ? () => {} : handleClose}
    >
      <Backdrop
        sx={{ color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isUnsyncingEvents}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            Unsyncing your events. Hang tight!
          </Typography>
        </Box>
      </Backdrop>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: "bold",
          color: "error.main",
        }}
      >
        Are you Sure?
      </Typography>
      <Typography gutterBottom>
        Are you sure you want to unsync the calendar "{calendar.name}"? This
        will delete all of its associated events from the application.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 0.5,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUnsyncConfirm}
        >
          Confirm
        </Button>
      </Box>
    </ReusableModal>
  );
};

export default UnsyncCalendarModal;
