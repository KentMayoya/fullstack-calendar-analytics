import { useState, useEffect, useCallback } from "react";
import { useUser } from "../setup/app-context-manager/UserContext";

export const useTags = () => {
  interface Tag {
    id: string;
    name: string;
  }

  const context = useUser();
  const { session } = context;
  const [tags, setTags] = useState<Tag[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Memoizes to prevent recreating fetchTags every render
  // Prevents infinite loop when using fetchTags as a dependency in useEffect
  const fetchTags = useCallback(async () => {
    if (!session?.access_token) {
        return;
    }
    setIsLoading(true);
    setError("");
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/tags`, {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch tags");
        }
        const data = await response.json();
        setTags(data);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  }, [session?.access_token, API_BASE_URL])

  useEffect(() => {
    fetchTags();
  }, [fetchTags])
  
  return { tags, setTags, isLoading, error, fetchTags }
}