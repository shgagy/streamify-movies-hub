
import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOCAL_STORAGE_KEY = "hasVisitedBefore";

const Welcome: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (!hasVisitedBefore) {
      // Add a small delay for a better entrance animation
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 500);
      
      // Set flag in localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
      
      return () => clearTimeout(timer);
    } else {
      // We need to set isVisible to false explicitly when hasVisitedBefore is true
      setIsVisible(false);
    }
  }, []);
  
  const handleDismiss = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300); // Wait for animation to complete
  }, []);
  
  const handleExploreGenres = useCallback(() => {
    handleDismiss();
    // Scroll to genre section
    const genreSection = document.querySelector('[data-section="genres"]');
    if (genreSection) {
      genreSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [handleDismiss]);
  
  // Instead of an early return, render null conditionally
  return (
    <>
      {isVisible && (
        <div 
          className={`bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-6 mb-8 relative 
            shadow-lg transition-all duration-300 ${isAnimating ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}
        >
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold mb-3">Welcome to Streamify!</h2>
          <p className="mb-4 text-white/80">
            Your personal streaming platform with all your favorite movies and shows.
            Browse by genre, create your watchlist, and enjoy seamless streaming.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDismiss} className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-0 hover:bg-white/20" 
              onClick={handleExploreGenres}
            >
              Explore Genres
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Welcome;
