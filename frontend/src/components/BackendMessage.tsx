import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BackendMessage() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/test`);
        const data = await response.text();
        setMessage(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Typography>
      Backend Status: <strong>{message || "No connection."}</strong>
    </Typography>
  );
}

export default BackendMessage;
