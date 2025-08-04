import ReusableModal from "./ReusableModal";
import { Box, Typography, Button } from "@mui/material";

type UnsyncCalendarProps = {
  handleClose: () => void;
  calendarName: string;
  handleConfirm: () => void;
};

const UnsyncCalendar = ({
  handleClose,
  calendarName,
  handleConfirm,
}: UnsyncCalendarProps) => {
  return (
    <ReusableModal isOpen={true} handleClose={handleClose}>
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
        Are you sure you want to unsync the calendar "{calendarName}"? This will
        delete all of its associated events from the application.
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
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Box>
    </ReusableModal>
  );
};

export default UnsyncCalendar;
