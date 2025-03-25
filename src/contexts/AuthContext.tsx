
import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userLoading: boolean;
  signOut: () => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  generateVerificationCode: (email: string, userId: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userLoading: true,
  signOut: async () => {},
  verifyEmail: async () => ({ success: false }),
  generateVerificationCode: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setUserLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const generateVerificationCode = async (email: string, userId: string) => {
    try {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set expiration time (30 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);
      
      console.log("Attempting to store verification code for:", email, "user ID:", userId);
      
      // Store the verification code in the database
      const { error } = await supabase
        .from('verification_codes')
        .insert({
          user_id: userId,
          email,
          code,
          expires_at: expiresAt.toISOString(),
        });

      if (error) {
        console.error("Error storing verification code:", error);
        return { success: false, error: error.message };
      }
      
      console.log("Verification code stored successfully");
      return { success: true };
    } catch (error: any) {
      console.error("Error generating verification code:", error);
      return { success: false, error: error.message };
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      // Find the verification code entry
      const { data, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.error("Error finding verification code:", error || "No valid code found");
        return { 
          success: false, 
          error: error ? error.message : "Invalid or expired verification code" 
        };
      }

      // Mark the verification code as used
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', data.id);

      // Verify the user's email with Supabase's auth API
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup',
      });

      if (verifyError) {
        console.error("Error verifying with Supabase auth:", verifyError);
        return { success: false, error: verifyError.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error verifying email:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userLoading, 
      signOut, 
      verifyEmail, 
      generateVerificationCode 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
