
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
  const [resendingOtp, setResendingOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendCounter, setResendCounter] = useState(0);
  const [signupSuccess, setSignupSuccess] = useState(false);
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
        console.log("Auth state changed:", event);
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Handle resend cooldown
  useEffect(() => {
    let interval: number | undefined;
    
    if (resendCounter > 0) {
      setCanResend(false);
      interval = window.setInterval(() => {
        setResendCounter((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendCounter]);

  const handleResendOTP = async () => {
    if (!canResend && resendCounter > 0) return;
    
    setResendingOtp(true);
    setOtpError(null);
    
    try {
      // Re-trigger the signup process to send a new OTP
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: "New verification code sent",
        description: "Please check your email for the new verification code. Also check your spam/junk folder.",
      });
      
      // Set cooldown timer (60 seconds)
      setResendCounter(60);
    } catch (error: any) {
      console.error("Resend error:", error);
      setOtpError(error.message);
    } finally {
      setResendingOtp(false);
    }
  };

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
        setSignupSuccess(false);
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

        console.log("Sign up response:", data);
        setSignupSuccess(true);

        // Show OTP dialog for verification
        toast({
          title: "Verification code sent",
          description: "Please check your email (including spam/junk folder) for the verification code.",
        });
        setShowOTPDialog(true);
        setCanResend(false);
        setResendCounter(60); // Set initial cooldown timer
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
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
      console.log("Verifying OTP:", otpValue, "for email:", email);
      
      // Verify the OTP code
      const { error, data } = await supabase.auth.verifyOtp({
        email,
        token: otpValue,
        type: 'signup',
      });

      console.log("OTP verification response:", data, error);

      if (error) throw error;

      // Update the profile table with username after verification
      const user = await supabase.auth.getUser();
      console.log("Current user after verification:", user);
      
      if (user.data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ username })
          .eq("id", user.data.user.id);
          
        if (profileError) {
          console.error("Error updating profile:", profileError);
        } else {
          console.log("Profile updated successfully");
        }
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
      console.error("OTP verification error:", error);
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

        {!isLogin && signupSuccess && (
          <Alert className="mb-6 bg-green-900 border-green-700">
            <AlertDescription className="text-white">
              Signup successful! Please check your email for the verification code. 
              If you don't see it, check your spam or junk folder.
            </AlertDescription>
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
            
            <div className="text-center text-white/60 text-sm mt-2">
              Didn't receive a code?{" "}
              {canResend ? (
                <button 
                  onClick={handleResendOTP} 
                  className="text-primary hover:underline"
                  disabled={resendingOtp}
                >
                  {resendingOtp ? "Sending..." : "Resend code"}
                </button>
              ) : (
                <span>Resend available in {resendCounter} seconds</span>
              )}
            </div>

            <div className="text-center text-white/70 text-sm mt-2 bg-streamify-gray p-3 rounded-md">
              <p>Troubleshooting tips:</p>
              <ul className="list-disc text-left pl-5 mt-1">
                <li>Check your spam or junk folder</li>
                <li>Verify your email address is correct</li>
                <li>Try using a different email provider</li>
                <li>Whitelist emails from Supabase/noreply@mail.app.supabase.io</li>
              </ul>
            </div>
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
