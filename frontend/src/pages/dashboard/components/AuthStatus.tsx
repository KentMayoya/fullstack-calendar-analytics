// src/AuthStatus.tsx

import { useUser } from "/src/setup/app-context-manager/user-context";

function AuthStatus() {
  const context = useUser();
  if (!context) {
    return <div className="card">Loading user...</div>;
  }

  const { user, supabase } = context;

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="card">
        <p>Email: {user.email}</p>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    );
  }

  return (
    <div className="card">
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}

export default AuthStatus;
