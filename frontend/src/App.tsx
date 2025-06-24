import { UserContextProvider } from "./setup/app-context-manager/user-context";
import BackendMessage from "./pages/dashboard/components/BackendMessage";
import AuthStatus from "./pages/dashboard/components/AuthStatus";
import "./App.css";

function App() {
  return (
    <UserContextProvider>
      <>
        <h1>Full-Stack Calendar Analytics</h1>
        <AuthStatus />
        <BackendMessage />
      </>
    </UserContextProvider>
  );
}

export default App;
