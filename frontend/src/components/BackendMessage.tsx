import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BackendMessage() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // This endpoint is defined in TestController
    fetch(`${API_BASE_URL}/api/test`)
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error("Error fetching data:", error));
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
