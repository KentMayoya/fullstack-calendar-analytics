import BackendMessage from "./components/BackendMessage";
import AuthStatus from "./pages/AuthStatus";
import "./App.css";

function App() {
  return (
    <>
      <h1>Full-Stack Calendar Analytics</h1>
      <AuthStatus />
      <BackendMessage />
    </>
  );
}

export default App;
