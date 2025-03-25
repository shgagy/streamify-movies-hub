
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type ProfileData = {
  username: string;
  avatar_url: string | null;
};

const Profile: React.FC = () => {
  const { user, userLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    avatar_url: null,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/auth");
    }
    
    if (user) {
      // Load profile data from localStorage
      setProfileData({
        username: user.username || "",
        avatar_url: null,
      });
    }
  }, [user, userLoading, navigate]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Update the mock user in localStorage
      const mockUser = {
        ...user,
        username: profileData.username
      };
      
      localStorage.setItem("mock-auth-user", JSON.stringify(mockUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get first letter of email for avatar fallback
  const emailInitial = user?.email ? user.email[0].toUpperCase() : "U";

  if (userLoading) {
    return <div className="min-h-screen bg-streamify-black flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-streamify-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="page-container max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="bg-streamify-darkgray rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {emailInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{profileData.username || user?.email}</h2>
                <p className="text-white/60">{user?.email}</p>
              </div>
            </div>
            
            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="bg-streamify-gray border-streamify-gray text-white"
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
