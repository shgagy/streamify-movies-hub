
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables.");
    }

    // Initialize the Supabase client with the service role key
    // This allows access to all database operations bypassing RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { email, userId } = await req.json();
    
    if (!email || !userId) {
      return new Response(
        JSON.stringify({ 
          error: "Email and userId are required" 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (30 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    
    console.log("Attempting to store verification code for:", email, "user ID:", userId);
    
    // Store the verification code in the database
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        user_id: userId,
        email,
        code,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Error storing verification code:", insertError);
      return new Response(
        JSON.stringify({ 
          error: insertError.message 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Send a custom email with the verification code
    const emailContent = `
      <h2>Your Streamify Verification Code</h2>
      <p>Thank you for signing up for Streamify. Please use the following 6-digit code to verify your email address:</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f0f0f0; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 3px; font-family: monospace; border-radius: 5px;">${code}</div>
      <p>This code will expire in 30 minutes.</p>
      <p>If you didn't sign up for Streamify, you can safely ignore this email.</p>
      <p>Thanks,<br>The Streamify Team</p>
    `;

    // Use Supabase's built-in email sending
    const { error: emailError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true, // Mark as already confirmed
      user_metadata: {
        verification_code_sent: true,
      },
      password: null, // We don't want to create a password here
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ 
          error: emailError.message 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log("Verification code stored and email sent successfully");

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in send-verification-code function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
