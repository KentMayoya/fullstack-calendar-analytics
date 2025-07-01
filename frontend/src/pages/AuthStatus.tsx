// src/pages/AuthStatus.tsx

import { useUser } from "../setup/app-context-manager/UserContext";

function AuthStatus() {
  const context = useUser();
  if (!context) {
    return <div className="card">Loading user...</div>;
    // If context is null, do not execute any of the following logic.
    // As context is a hook, this code will rerun when its state changes.
  }

  const { session, supabase } = context;

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // If the user is authenticated, display the user's email
  // and a sign out button.
  if (session) {
    return (
      <div className="card">
        {/*
            session and profile are fetched separately.
            Even if session is not null, profile still could be.
            Therefore, if profile is null, display the email.
        */}
        <p>Welcome, {session.profile?.fullName || session.auth.email}</p>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    );
  }

  // Otherwise, the user is not authenticated, and is prompted
  // to sign into their account.
  return (
    <div className="card">
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}

export default AuthStatus;
