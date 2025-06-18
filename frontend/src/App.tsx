import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // This endpoint is defined in TestController
    fetch("http://localhost:8080/api/test")
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
