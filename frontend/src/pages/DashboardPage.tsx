import { useState, useMemo } from "react";
import DashboardToolbar from "../components/DashboardToolBar";
import {
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

const DashboardPage = () => {
  const [view, setView] = useState<string>("week");
  const [currentDate, setCurrentDate] = useState<Date>(startOfWeek(new Date()));

  // Sets the date range back by the period specified in view
  const onPrevClick = () => {
    if (view === "day") {
      setCurrentDate((prevDate) => subDays(prevDate, 1));
    } else if (view === "week") {
      setCurrentDate((prevDate) => subWeeks(prevDate, 1));
    } else if (view === "month") {
      setCurrentDate((prevDate) => subMonths(prevDate, 1));
    } else {
      setCurrentDate((prevDate) => subYears(prevDate, 1));
    }
  };

  // Sets the date range forward by the period specified in view
  const onNextClick = () => {
    if (view === "day") {
      setCurrentDate((prevDate) => addDays(prevDate, 1));
    } else if (view === "week") {
      setCurrentDate((prevDate) => addWeeks(prevDate, 1));
    } else if (view === "month") {
      setCurrentDate((prevDate) => addMonths(prevDate, 1));
    } else {
      setCurrentDate((prevDate) => addYears(prevDate, 1));
    }
  };

  // Formats the date based on the period specified in view
  const dateRangeTitle = useMemo(() => {
    if (view === "day") {
      return format(currentDate, "MMMM d, yyyy");
    } else if (view === "week") {
      const start = currentDate;
      const end = endOfWeek(start);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    } else if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "year") {
      return format(currentDate, "yyyy");
    }
    return "";
  }, [currentDate, view]);

  return (
    <>
      <DashboardToolbar
        title={dateRangeTitle}
        view={view}
        setView={setView}
        onPrevClick={onPrevClick}
        onNextClick={onNextClick}
      />
      <h1>This a dashboard</h1>
    </>
  );
};

export default DashboardPage;
