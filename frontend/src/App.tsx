import { useState, useEffect } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // This endpoint is defined in TestController
    fetch(`${API_BASE_URL}/api/test`)
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <h1>Full-Stack Calendar Analytics</h1>
      <div className="card">
        <p>
          Message from backend: <strong>{message || "Loading..."}</strong>
        </p>
      </div>
    </>
  );
}

export default App;
