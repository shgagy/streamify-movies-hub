
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  const [userId, setUserId] = useState<string | null>(null);
  const [showVerificationHelp, setShowVerificationHelp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generateVerificationCode, verifyEmail, signUp } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    
    checkSession();
    
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

  useEffect(() => {
    // Check URL parameters for verification flow
    const params = new URLSearchParams(window.location.search);
    const verificationParam = params.get('verification');
    const emailParam = params.get('email');
    
    // If coming from the verification link in email
    if (verificationParam === 'true' && emailParam) {
      setEmail(emailParam);
      setShowOTPDialog(true);
      setShowVerificationHelp(true);
      toast({
        title: "Enter verification code",
        description: "Please enter the 6-digit verification code from your database.",
      });
    }
  }, [toast]);

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
    if (!canResend && resendCounter > 0 || !userId) return;
    
    setResendingOtp(true);
    setOtpError(null);
    
    try {
      const { success, error } = await generateVerificationCode(email, userId);
      
      if (!success) throw new Error(error);

      toast({
        title: "New verification email sent",
        description: "Please check your email for a password reset link. Click it to proceed with verification.",
      });
      
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
        setSignupSuccess(false);
        console.log("Starting signup process for email:", email);
        
        const signupResult = await signUp(email, password, username);
        
        if (!signupResult.success) {
          throw new Error(signupResult.error || "Account creation failed");
        }
        
        const userId = signupResult.userId;
        if (!userId) {
          throw new Error("Failed to get user ID after signup");
        }
        
        setUserId(userId);
        setSignupSuccess(true);

        toast({
          title: "Account created! Check your email",
          description: "We've sent you a confirmation email. Click the link in the email to verify your account.",
          duration: 10000,
        });
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
      
      const verificationResult = await verifyEmail(email, otpValue);
      
      if (!verificationResult.success) {
        throw new Error(verificationResult.error || "Verification failed");
      }

      console.log("Email verification successful");
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error("Error signing in after verification:", signInError);
        throw new Error("Verification successful, but couldn't sign you in automatically. Please sign in manually.");
      }
      
      toast({
        title: "Account verified!",
        description: "Your account has been successfully verified.",
      });
      setShowOTPDialog(false);
      
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
              Signup successful! Check your email for a confirmation link. 
              Click the link to verify your account.
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

      <Dialog open={showOTPDialog} onOpenChange={(open) => {
        if (!open && !verifyingOtp) setShowOTPDialog(false);
      }}>
        <DialogContent className="bg-streamify-darkgray border-streamify-gray text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Email Verification</DialogTitle>
            <DialogDescription className="text-white/60">
              Enter the 6-digit verification code for {email}
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
            
            {showVerificationHelp && (
              <div className="text-center text-white/70 text-sm mt-2 bg-streamify-gray p-3 rounded-md">
                <p className="font-bold mb-2">Your verification code is in the database!</p>
                <p>To find your verification code:</p>
                <ol className="text-left pl-5 mt-1 space-y-1">
                  <li>Check the verification_codes table in your Supabase database</li>
                  <li>Find the entry with your email</li>
                  <li>Use the 6-digit code from the "code" column</li>
                </ol>
              </div>
            )}
            
            <div className="text-center text-white/60 text-sm mt-2">
              Need help with verification?{" "}
              <button 
                onClick={() => setShowVerificationHelp(!showVerificationHelp)} 
                className="text-primary hover:underline"
              >
                {showVerificationHelp ? "Hide help" : "Show help"}
              </button>
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
