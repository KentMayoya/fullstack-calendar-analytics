import { useState, useEffect, useCallback } from "react";
import { useUser } from "../setup/app-context-manager/UserContext";

interface Calendar {
  id: string;
  name: string;
  isSynced: boolean;
}

export const useCalendar = () => {
  const { session } = useUser();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  return { calendars, loading, error, fetchCalendars, setCalendars }
};
