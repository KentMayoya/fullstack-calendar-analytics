// src/setup/app-context-manager/UserContext.tsx

import { createContext, useState, useEffect, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import type { User, SupabaseClient } from "@supabase/supabase-js";

// Custom users table
interface Profile {
  full_name: string;
  email: string;
}

// Contains both supabase's users object and
// our custom users object (Profile)
interface Session {
  auth: User;
  profile: Profile | null;
}

interface UserContextType {
  session: Session | null;
  supabase: SupabaseClient;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Make UserContext available to other files.
export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // A listener that calls setSession whenever authentication happens
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setLoading(false);
    });
    // Cleanup function that stops listening for authentication changes
    // when this component unmounts. UserContextProvider will likely never
    // be unmounted until the user navigates away from the website
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // If a user is logged in, fetch their profile.
    if (authUser) {
      supabase
        .from("users")
        .select("full_name, email")
        .eq("id", authUser.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching profile:", error);
          }
          setProfile(data);
        });
    } else {
      // If the user logs out, clear the profile.
      setProfile(null);
    }
  }, [authUser]);

  const session: Session | null = authUser ? { auth: authUser, profile } : null;

  // Give UserContext a value. When another files calls useContext and passes
  // in UserContext, they will get these values.
  const value = {
    session,
    supabase,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
