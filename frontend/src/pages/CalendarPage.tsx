import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, DatesSetArg } from "@fullcalendar/core";
import CalendarToolbar from "../components/CalendarToolbar";
import { useUser } from "../setup/app-context-manager/UserContext";

const CalendarPage = () => {
  // Stores the title to display on the Calendar header
  const [calendarTitle, setCalendarTitle] = useState<string>("");

  // A ref to get direct access to the FullCalendar component's API
  const calendarRef = useRef<FullCalendar>(null);

  // Stores the current dates displayed on the UI
  const [viewInfo, setViewInfo] = useState<DatesSetArg | null>(null);

  // Stores the events to be displayed on the calendar
  const [events, setEvents] = useState<EventInput[]>([]);

  const { session } = useUser();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!viewInfo || !session?.access_token) {
      return;
    }
    console.log("Attempting to fetch events!");
    const fetchEvents = async () => {
      // Temporarily hard coded for testing. To be changed later.
      const calendarIds = "00f9c832-4901-4fb7-84e6-a5402c7b784d";
      try {
        const start = viewInfo.start.toISOString();
        const end = viewInfo.end.toISOString();
        const response = await fetch(
          `${API_BASE_URL}/api/v1/events?start=${start}&end=${end}&calendarIds=${calendarIds}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        const data = await response.json();
        // Map the data to the format FullCalendar expects
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.startTime,
          end: event.endTime,
          allDay: event.isAllDay,
          backgroundColor: event.color,
          borderColor: event.color,
        }));
        console.log(
          "Data received from API. Found " + formattedEvents.length + " events."
        );
        setEvents(formattedEvents);
        console.log("Formatted:", formattedEvents);
        calendarRef.current?.getApi().refetchEvents();
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    fetchEvents();
  }, [viewInfo, session?.access_token, API_BASE_URL]);

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
    setViewInfo(dateInfo);
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
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          datesSet={handleDatesSet}
          height="100%"
          eventSources={[events]}
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
