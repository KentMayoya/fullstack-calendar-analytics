import { createContext, useState, useEffect, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import type { User, SupabaseClient } from "@supabase/supabase-js";

// Custom users table
interface Profile {
  fullName: string;
  email: string;
}

// Contains both supabase's users object and
// our custom users object (Profile)
interface Session {
  auth: User;
  profile: Profile | null;
  access_token: string;
}

interface UserContextType {
  session: Session | null;
  supabase: SupabaseClient;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
  },
});

// Make UserContext available to other files.
export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar.readonly",
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    // A listener that calls setSession whenever authentication happens
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, supabaseSession) => {
      try {
        if (supabaseSession?.user) {
          const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
            headers: {
              Authorization: `Bearer ${supabaseSession.access_token}`,
            },
          });
          if (!response.ok) {
            const responseBody = await response.text();
            throw new Error(
              `Failed to fetch user profile. Body: ${responseBody} Status: ${response.status}`
            );
          }
          const profile = await response.json();
          if (!profile.isGoogleTokenSaved && supabaseSession.provider_token) {
            await fetch(`${API_BASE_URL}/api/v1/users/me/token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${supabaseSession.access_token}`,
              },
              body: JSON.stringify({
                refreshToken: supabaseSession.provider_token,
              }),
            });
          }
          setSession({
            auth: supabaseSession.user,
            profile: profile,
            access_token: supabaseSession.access_token,
          });
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Error setting up session: ", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    });
    // Cleanup function that stops listening for authentication changes
    // when this component unmounts. UserContextProvider will likely never
    // be unmounted until the user navigates away from the website
    return () => subscription.unsubscribe();
  }, []);

  // Give UserContext a value. When another files calls useContext and passes
  // in UserContext, they will get these values.
  const value = {
    session,
    supabase,
    handleLogin,
    handleLogout,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

// Custom hook that allows the user to be accessible from other files
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserContextProvider");
    // useUser was attempted to be retrieved from a component that was
    // not wrapped with <UserContextProvider>
  }
  return context;
};
