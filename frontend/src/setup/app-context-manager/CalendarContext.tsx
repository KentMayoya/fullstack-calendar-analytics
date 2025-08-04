import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useUser } from "./UserContext";
import type { ReactNode } from "react";

export interface Calendar {
  id: string;
  name: string;
  isSynced: boolean;
}

// Adds or deletes a calendar id to the Set and returns it.
export const toggleIdInSet = (
  prevSet: Set<string>,
  id: string
): Set<string> => {
  const newSet = new Set(prevSet);
  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }
  return newSet;
};

// Defines the data/functions that this context provides to other components
interface CalendarContextType {
  calendars: Calendar[];
  setCalendars: React.Dispatch<React.SetStateAction<Calendar[]>>;
  syncedCalendars: Calendar[];
  loading: boolean;
  error: string;
  selectedIds: Set<string>;
  saveSelectedIds: (newIds: Set<string>) => void;
  handleToggleSync: (
    calendarId: string,
    currentStatus: boolean
  ) => Promise<void>;
}

export const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { session } = useUser();
  const [calendars, setCalendars] = useState<Calendar[]>([]);

  // filters out unsynced calendars
  const syncedCalendars = useMemo(() => {
    return calendars.filter((calendar) => calendar.isSynced);
  }, [calendars]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Key used to store selectedCalendarIds in localStorage
  const SELECTED_CALENDARS_ID_KEY = "selectedCalendarIds";

  // Initializes selected calendar ids from localStorage, or uses an empty
  // set if none are saved
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(SELECTED_CALENDARS_ID_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Calls /api/v1/calendars to fetch calendars
  const fetchCalendars = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.access_token) {
        throw new Error("No access token available");
      }
      const response = await fetch(`${API_BASE_URL}/api/v1/calendars`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch calendars");
      }
      const data = await response.json();
      setCalendars(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, API_BASE_URL]);

  // Initial fetch when the component loads
  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  // Updates the database when a user toggles a switch for a specified calendar
  const handleToggleSync = async (
    calendarId: string,
    currentStatus: boolean
  ) => {
    if (!session?.access_token) {
      return;
    }
    // Traverse through the list of calendars. Switch the sync status of the
    // calendar that is toggled. This takes place before the API call.
    setCalendars((currentCalendars) =>
      currentCalendars.map((calendar) =>
        calendar.id === calendarId
          ? { ...calendar, isSynced: !currentStatus }
          : calendar
      )
    );
    try {
      if (currentStatus) {
        // Unsync operation
        const deleteResponse = await fetch(
          `${API_BASE_URL}/api/v1/calendars/${calendarId}/events`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${session.access_token}` },
          }
        );
        if (!deleteResponse.ok) {
          throw new Error(
            `Delete calendar events API call failed with status: ${deleteResponse.status}`
          );
        }
      }
      const putResponse = await fetch(
        `${API_BASE_URL}/api/v1/calendars/${calendarId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ isSynced: !currentStatus }),
        }
      );
      if (!putResponse.ok) {
        throw new Error(
          `Update calendar sync API call failed with status: ${putResponse.status}`
        );
      }
      // If currentStatus is true, toggling was just set to false
      if (currentStatus) {
        setSelectedIds((prevIds) => {
          const newIds = new Set(prevIds);
          newIds.delete(calendarId);
          localStorage.setItem(
            SELECTED_CALENDARS_ID_KEY,
            JSON.stringify(Array.from(newIds))
          );
          return newIds;
        });
      }
    } catch (err) {
      console.log(err);
      // Toggle failed, undo the optimistic UI toggle update.
      setCalendars((currentCalendars) =>
        currentCalendars.map((calendar) =>
          calendar.id === calendarId
            ? { ...calendar, isSynced: currentStatus }
            : calendar
        )
      );
    }
  };

  // Sets selectedIds to the passed set and stores the calendar ids in
  // local storage.
  const saveSelectedIds = (newIds: Set<string>) => {
    setSelectedIds(newIds);
    localStorage.setItem(
      SELECTED_CALENDARS_ID_KEY,
      JSON.stringify(Array.from(newIds))
    );
  };

  // Bundles all the information to share, since the Provider component can
  // only accept a single value
  const value = {
    calendars,
    setCalendars,
    syncedCalendars,
    loading,
    error,
    selectedIds,
    saveSelectedIds,
    handleToggleSync,
  };

  return (
    // Using the Provider, any descendant can access the data in value
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === null) {
    throw new Error(
      "useCalendar must be used within a CalendarContextProvider"
    );
  }
  return context;
};
