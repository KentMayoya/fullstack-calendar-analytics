import { Toolbar } from "@mui/material";
import CalendarToolbar from "../components/CalendarToolbar";
import { useState } from "react";

const CalendarPage = () => {
  const [calendarTitle, setCalendarTitle] = useState<string>("");

  const handlePrevClick = () => {
    // TODO
    console.log("handlePrevClick called");
  };

  const handleTodayClick = () => {
    // TODO
    console.log("handleTodayClick called");
  };

  const handleNextClick = () => {
    // TODO
    console.log("handleNextClick called");
  };

  return (
    <>
      {/* An empty Toolbar to offset the main header. */}
      <Toolbar />
      <CalendarToolbar
        title={calendarTitle}
        onPrevClick={handlePrevClick}
        onTodayClick={handleTodayClick}
        onNextClick={handleNextClick}
      />
      <h1>This is some text</h1>
    </>
  );
};

export default CalendarPage;
