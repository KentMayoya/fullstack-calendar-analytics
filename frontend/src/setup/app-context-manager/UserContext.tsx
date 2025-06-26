import { createContext, useState, useEffect, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Upon rendering, check if a user was logged in during a previous visit
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // A listener that calls setUser whenever authentication happens
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup function that stops listening for authentication changes
    // when this component unmounts. UserContextProvider will likely never
    // be unmounted until the user navigates away from the website
    return () => subscription.unsubscribe();
  }, []);

  // Give UserContext a value. When another files calls useContext and passes
  // in UserContext, they will get these values.
  // user is initially null as defined by the useState above.
  const value = {
    user,
    supabase,
  };

  return (
    <UserContext.Provider value={value}> {children} </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
