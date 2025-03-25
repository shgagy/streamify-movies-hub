
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
      } else {
        // Sign up with OTP verification
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username, // Store username in user metadata
            },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        // Show OTP dialog for verification
        toast({
          title: "Verification code sent",
          description: "Please check your email for the verification code.",
        });
        setShowOTPDialog(true);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpValue || otpValue.length !== 6) {
      setOtpError("Please enter a valid 6-digit code");
      return;
    }

    setVerifyingOtp(true);
    setOtpError(null);

    try {
      // Verify the OTP code
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpValue,
        type: 'signup',
      });

      if (error) throw error;

      // Update the profile table with username after verification
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ username })
          .eq("id", user.data.user.id);
          
        if (profileError) console.error("Error updating profile:", profileError);
      }

      // Show success message and close the dialog
      toast({
        title: "Account verified!",
        description: "Your account has been successfully verified.",
      });
      setShowOTPDialog(false);
      
      // Navigate to homepage after successful verification
      navigate("/");
    } catch (error: any) {
      setOtpError(error.message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-streamify-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-streamify-darkgray rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Film className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isLogin ? "Sign in to Streamify" : "Create a Streamify account"}
          </h1>
          <p className="text-white/60 mt-2">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Fill in the form to create your account"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="bg-streamify-gray border-streamify-gray text-white"
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-streamify-gray border-streamify-gray text-white"
            />
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Your display name"
                className="bg-streamify-gray border-streamify-gray text-white"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={(open) => {
        if (!open && !verifyingOtp) setShowOTPDialog(false);
      }}>
        <DialogContent className="bg-streamify-darkgray border-streamify-gray text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Email Verification</DialogTitle>
            <DialogDescription className="text-white/60">
              Enter the 6-digit verification code sent to {email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4 py-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={setOtpValue}
              containerClassName="gap-2"
              className="text-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="bg-streamify-gray border-streamify-gray text-white" />
                <InputOTPSlot index={1} className="bg-streamify-gray border-streamify-gray text-white" />
                <InputOTPSlot index={2} className="bg-streamify-gray border-streamify-gray text-white" />
                <InputOTPSlot index={3} className="bg-streamify-gray border-streamify-gray text-white" />
                <InputOTPSlot index={4} className="bg-streamify-gray border-streamify-gray text-white" />
                <InputOTPSlot index={5} className="bg-streamify-gray border-streamify-gray text-white" />
              </InputOTPGroup>
            </InputOTP>
            
            {otpError && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{otpError}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowOTPDialog(false)}
              className="bg-streamify-gray border-streamify-gray text-white"
              disabled={verifyingOtp}
            >
              Cancel
            </Button>
            <Button 
              onClick={verifyOTP} 
              disabled={otpValue.length !== 6 || verifyingOtp}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {verifyingOtp ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
