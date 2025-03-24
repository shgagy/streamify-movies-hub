
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Welcome: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    
    if (!hasVisitedBefore) {
      setIsVisible(true);
      // Set flag in localStorage
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-4 mb-8 animate-fade-in relative">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>
      
      <h2 className="text-xl font-bold mb-2">Welcome to Streamify!</h2>
      <p className="mb-4">
        Your personal streaming platform with all your favorite movies and shows.
        Browse by genre, create your watchlist, and enjoy seamless streaming.
      </p>
      
      <div className="flex space-x-3">
        <Button onClick={handleDismiss} className="button-primary">
          Get Started
        </Button>
        <Button 
          variant="outline" 
          className="bg-white/10 border-0" 
          onClick={handleDismiss}
        >
          Explore Genres
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
