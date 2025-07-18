import { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { DatesSetArg } from "@fullcalendar/core";
import CalendarToolbar from "../components/CalendarToolbar";
import { useUser } from "../setup/app-context-manager/UserContext";

const CalendarPage = () => {
  // Stores the title to display on the Calendar header
  const [calendarTitle, setCalendarTitle] = useState<string>("");

  // A ref to get direct access to the FullCalendar component's API
  const calendarRef = useRef<FullCalendar>(null);

  const { session } = useUser();

  // If the user does not have a valid session, redirect to the home page
  if (!session?.auth) {
    return <Navigate to="/" replace />;
  }

  // Prompts FullCalendar to move the date back a period
  const handlePrevClick = () => {
    calendarRef.current?.getApi().prev();
  };

  // Prompts FullCalendar to set the date back to today
  const handleTodayClick = () => {
    calendarRef.current?.getApi().today();
  };

  // Prompts FullCalendar to move the date forward a period
  const handleNextClick = () => {
    calendarRef.current?.getApi().next();
  };

  // Sets the title whenever the date range changes.
  const handleDatesSet = (dateInfo: DatesSetArg) => {
    const title = dateInfo.view.title;
    setCalendarTitle(title);
  };

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
      })}
    >
      <CalendarToolbar
        title={calendarTitle}
        onPrevClick={handlePrevClick}
        onTodayClick={handleTodayClick}
        onNextClick={handleNextClick}
      />
      {/* An empty Toolbar so other components do not overlap with the 
      CalendarToolbar */}
      <Toolbar />
      <Box sx={{ flexGrow: 1, p: 2, overflow: "hidden" }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          datesSet={handleDatesSet}
          height="100%"
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
