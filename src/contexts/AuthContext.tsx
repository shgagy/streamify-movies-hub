
import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";

// Mock types to replace Supabase types
export type User = {
  id: string;
  email: string;
  username?: string;
};

export type Session = {
  user: User;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userLoading: true,
  signOut: async () => {},
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

// Demo user credentials for testing
const DEMO_USER = {
  email: "demo@example.com",
  password: "password123",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("mock-auth-user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
        setSession({ user: parsedUser });
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("mock-auth-user");
      }
    }
    setUserLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem("mock-auth-user");
    setUser(null);
    setSession(null);
    toast.success("You have been signed out");
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Demo authentication - only works with the demo account
      if (email === DEMO_USER.email && password === DEMO_USER.password) {
        const mockUser: User = {
          id: "demo-user-id",
          email: DEMO_USER.email,
          username: "Demo User",
        };

        setUser(mockUser);
        setSession({ user: mockUser });
        localStorage.setItem("mock-auth-user", JSON.stringify(mockUser));
        
        return { success: true };
      }

      // For development, allow any email/password combo to work
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        username: email.split('@')[0],
      };

      setUser(mockUser);
      setSession({ user: mockUser });
      localStorage.setItem("mock-auth-user", JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "An error occurred during sign in" };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Create a new mock user
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        username,
      };

      setUser(mockUser);
      setSession({ user: mockUser });
      localStorage.setItem("mock-auth-user", JSON.stringify(mockUser));
      
      toast.success("Account created successfully!");
      return { success: true };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { success: false, error: error.message || "An error occurred during sign up" };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userLoading, 
      signOut,
      signIn,
      signUp 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
