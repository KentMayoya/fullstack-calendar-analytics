import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import type { EventInput, DatesSetArg } from "@fullcalendar/core";
import CalendarToolbar from "../components/CalendarToolbar";
import { useUser } from "../setup/app-context-manager/UserContext";
import { useCalendar } from "../setup/app-context-manager/CalendarContext";
import type { EventClickArg } from "@fullcalendar/core";
import ApplyTagsModal from "../components/ApplyTagsModal";

const CalendarPage = () => {
  // Stores the title to display on the Calendar header
  const [calendarTitle, setCalendarTitle] = useState<string>("");

  // A ref to get direct access to the FullCalendar component's API
  const calendarRef = useRef<FullCalendar>(null);

  // Stores the current dates displayed on the UI
  const [viewInfo, setViewInfo] = useState<DatesSetArg | null>(null);

  // Stores the events to be displayed on the calendar
  const [events, setEvents] = useState<EventInput[]>([]);

  // Stores the event the user selected
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);

  const [isApplyTagsModalOpen, setIsApplyTagsModalOpen] =
    useState<boolean>(false);

  const { selectedIds, currentView } = useCalendar();

  const { session } = useUser();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetches the events for the calendars the user selected to display for
  // the current view (e.g. week)
  useEffect(() => {
    if (!viewInfo || !session?.access_token || selectedIds.size === 0) {
      setEvents([]);
      return;
    }
    const fetchEvents = async () => {
      const calendarIds = Array.from(selectedIds).join(",");
      try {
        const start = viewInfo.start.toISOString();
        const end = viewInfo.end.toISOString();
        const url =
          `${API_BASE_URL}/api/v1/events?start=${start}&end=${end}` +
          `&calendarIds=${calendarIds}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const data = await response.json();
        // Define the Event FullCalendar expects
        interface ApiEvent {
          id: string;
          title: string;
          startTime: string;
          endTime: string;
          allDay: boolean;
          color: string;
        }
        // Convert our Event to the Event FullCalendar expects
        const formattedEvents = data.map((event: ApiEvent) => ({
          id: event.id,
          title: event.title,
          start: event.startTime,
          end: event.endTime,
          allDay: event.allDay,
          backgroundColor: event.color,
          borderColor: event.color,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    fetchEvents();
  }, [viewInfo, session?.access_token, API_BASE_URL, selectedIds]);

  // Changes the calendar view when currentView changes
  useEffect(() => {
    calendarRef.current?.getApi().changeView(currentView);
  }, [currentView]);

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

  // Triggered whenever the user clicks on a FullCalendar event
  const handleEventClick = (clickInfo: EventClickArg) => {
    // Transform the data to a compatible type to store in selectedEvent
    const eventData: EventInput = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start ?? undefined,
      end: clickInfo.event.end ?? undefined,
      allDay: clickInfo.event.allDay,
      backgroundColor: clickInfo.event.backgroundColor,
      borderColor: clickInfo.event.borderColor,
    };
    setSelectedEvent(eventData);
    setIsApplyTagsModalOpen(true);
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
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          datesSet={handleDatesSet}
          height="100%"
          events={events}
          eventClick={handleEventClick}
        />
      </Box>
      <Box>
        {isApplyTagsModalOpen && (
          <ApplyTagsModal
            eventId={selectedEvent?.id}
            title={selectedEvent?.title}
            handleClose={() => setIsApplyTagsModalOpen(false)}
          ></ApplyTagsModal>
        )}
      </Box>
    </Box>
  );
};

export default CalendarPage;
