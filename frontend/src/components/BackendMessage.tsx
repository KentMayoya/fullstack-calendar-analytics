import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BackendMessage() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // This endpoint is defined in TestController
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
    <div className="card">
      <p>
        Message from backend: <strong>{message || "Loading..."}</strong>
      </p>
    </div>
  );
}

export default BackendMessage;
