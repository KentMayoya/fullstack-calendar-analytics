import { useState, useMemo, useCallback, useEffect } from "react";
import { Navigate } from "react-router-dom";
import DashboardToolbar from "../components/DashboardToolbar";
import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  format,
} from "date-fns";
import { type Calendar } from "../setup/app-context-manager/CalendarContext";
import { type Tag } from "../hooks/useTags";
import { useUser } from "../setup/app-context-manager/UserContext";
import { Box, Typography, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import BreakdownBarChart from "../components/BreakdownBarChart";

interface SummaryData {
  totalMinutes: number;
  totalEvents: number;
}

interface BreakdownData {
  name: string;
  minutes: number;
}

const DashboardPage = () => {
  const [view, setView] = useState<string>("week");
  const [currentDate, setCurrentDate] = useState<Date>(startOfWeek(new Date()));
  const [selectedCalendars, setSelectedCalendars] = useState<Calendar[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const { session } = useUser();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [breakdownData, setBreakdownData] = useState<BreakdownData[] | null>(
    []
  );

  // Sets the date range back by the period specified in view
  const onPrevClick = () => {
    if (view === "day") {
      setCurrentDate((prevDate) => subDays(prevDate, 1));
    } else if (view === "week") {
      setCurrentDate((prevDate) => subWeeks(startOfWeek(prevDate), 1));
    } else if (view === "month") {
      setCurrentDate((prevDate) => subMonths(startOfMonth(prevDate), 1));
    } else {
      setCurrentDate((prevDate) => subYears(startOfYear(prevDate), 1));
    }
  };

  // Sets the date where the period includes today's date
  const onTodayClick = () => {
    const today = new Date();
    if (view === "day") {
      setCurrentDate(today);
    } else if (view === "week") {
      setCurrentDate(startOfWeek(today));
    } else if (view === "month") {
      setCurrentDate(startOfMonth(today));
    } else {
      setCurrentDate(startOfYear(today));
    }
  };

  // Sets the date range forward by the period specified in view
  const onNextClick = () => {
    if (view === "day") {
      setCurrentDate((prevDate) => addDays(prevDate, 1));
    } else if (view === "week") {
      setCurrentDate((prevDate) => addWeeks(startOfWeek(prevDate), 1));
    } else if (view === "month") {
      setCurrentDate((prevDate) => addMonths(startOfMonth(prevDate), 1));
    } else {
      setCurrentDate((prevDate) => addYears(startOfYear(prevDate), 1));
    }
  };

  // Formats the date based on the period specified in view
  const dateRangeTitle = useMemo(() => {
    if (view === "day") {
      return format(currentDate, "MMMM d, yyyy");
    } else if (view === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(start);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    } else if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "year") {
      return format(currentDate, "yyyy");
    }
    return "";
  }, [currentDate, view]);

  // Fetches the total minutes and events for the current period
  const fetchSummary = useCallback(async () => {
    if (
      !session?.access_token ||
      selectedCalendars.length === 0 ||
      !selectedTag
    ) {
      setSummaryData(null);
      return;
    }
    try {
      let start: Date;
      let end: Date;
      // Set the start and end dates
      if (view === "day") {
        start = currentDate;
        end = currentDate;
      } else if (view === "week") {
        start = startOfWeek(currentDate);
        end = endOfWeek(currentDate);
      } else if (view === "month") {
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
      } else {
        start = startOfYear(currentDate);
        end = endOfYear(currentDate);
      }

      // If the user does not have a valid session, redirect to the home page
      if (!session?.auth) {
        return <Navigate to="/" replace />;
      }

      // Format query parameters for the endpoint
      const startDateString = format(start, "yyyy-MM-dd");
      const endDateString = format(end, "yyyy-MM-dd");
      const calendarIdList = selectedCalendars.map((c) => c.id).join(",");
      const tagId = selectedTag.id;
      const url =
        `${API_BASE_URL}/api/v1/analytics/summary` +
        `?start=${startDateString}&end=${endDateString}` +
        `&calendarIds=${calendarIdList}&tagId=${tagId}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();
      setSummaryData(data);
    } catch (error: any) {
      console.error("Failed to fetch the summary.", error);
    }
  }, [
    currentDate,
    view,
    selectedCalendars,
    selectedTag,
    session?.access_token,
    API_BASE_URL,
  ]);

  // Fetches the minutes for each breakdown in the current period
  const fetchBreakdownData = useCallback(async () => {
    if (
      !session?.access_token ||
      selectedCalendars.length === 0 ||
      !selectedTag
    ) {
      setBreakdownData([]);
      return;
    }
    try {
      const dateString = format(currentDate, "yyyy-MM-dd");
      const calendarIdList = selectedCalendars.map((c) => c.id).join(",");
      const tagId = selectedTag.id;
      const url =
        `${API_BASE_URL}/api/v1/analytics/breakdown?range=${view}` +
        `&date=${dateString}&calendarIds=${calendarIdList}&tagId=${tagId}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch breakdown data.");
      }
      const data = await response.json();
      setBreakdownData(data);
    } catch (error: any) {
      console.error("Failed to fetch breakdown data.", error);
    }
  }, [
    currentDate,
    view,
    selectedCalendars,
    selectedTag,
    session?.access_token,
    API_BASE_URL,
  ]);

  // Sets the title for the bar graph
  const breakdownTitle = useMemo(() => {
    switch (view) {
      case "day":
        return "Daily";
      case "week":
        return "Weekly";
      case "month":
        return "Monthly";
      case "year":
        return "Yearly";
      default:
        return "";
    }
  }, [view]);

  // Fetch the summary upon mounting
  useEffect(() => {
    fetchSummary();
    fetchBreakdownData();
  }, [fetchSummary, fetchBreakdownData]);

  // Fix the displayed date when view is changed
  useEffect(() => {
    if (view === "week") {
      setCurrentDate(startOfWeek(currentDate));
    } else if (view === "month") {
      setCurrentDate(startOfMonth(currentDate));
    } else if (view === "year") {
      setCurrentDate(startOfYear(currentDate));
    }
  }, [view]);

  return (
    <>
      <DashboardToolbar
        title={dateRangeTitle}
        view={view}
        setView={setView}
        onPrevClick={onPrevClick}
        onTodayClick={onTodayClick}
        onNextClick={onNextClick}
        selectedCalendars={selectedCalendars}
        setSelectedCalendars={setSelectedCalendars}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
      {(selectedCalendars.length === 0 || !selectedTag) && (
        <Paper sx={{ p: 2, backgroundColor: "azure" }}>
          <Typography>
            To view your analytics, please select at least one calendar and one
            tag.
          </Typography>
        </Paper>
      )}
      {summaryData && (
        <Paper sx={{ p: 1, backgroundColor: "azure" }}>
          <Typography
            component="h2"
            variant="h6"
            fontWeight="bold"
            gutterBottom
          >
            {breakdownTitle} Summary
          </Typography>
          <Box sx={{ display: "flex", mb: 1 }}>
            <AccessTimeIcon sx={{ mr: 1 }} />
            <Typography>Total Minutes: {summaryData.totalMinutes}</Typography>
          </Box>
          <Box sx={{ display: "flex", mb: 1 }}>
            <EventIcon sx={{ mr: 1 }} />
            <Typography>Total Events: {summaryData.totalEvents}</Typography>
          </Box>
        </Paper>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
        }}
      >
        {breakdownData && breakdownData.length > 0 && (
          <Paper sx={{ p: 2, width: "100%" }}>
            <Typography
              component="h2"
              variant="h6"
              fontWeight="bold"
              gutterBottom
            >
              {breakdownTitle} Breakdown
            </Typography>
            <BreakdownBarChart data={breakdownData} />
          </Paper>
        )}
      </Box>
    </>
  );
};

export default DashboardPage;
