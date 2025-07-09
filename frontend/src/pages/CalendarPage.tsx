import { Toolbar } from "@mui/material";
import CalendarToolbar from "../components/CalendarToolbar";

const CalendarPage = () => {
  return (
    <>
      {/* An empty Toolbar to offset the main header. */}
      <Toolbar />
      <CalendarToolbar />
      <h1>This is some text</h1>
    </>
  );
};

export default CalendarPage;
