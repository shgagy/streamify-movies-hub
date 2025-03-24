
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Info } from "lucide-react";
import { getFeaturedMovies, Movie } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const movies = getFeaturedMovies();
    setFeaturedMovies(movies);
  }, []);
  
  useEffect(() => {
    // Auto rotate featured content
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev === featuredMovies.length - 1 ? 0 : prev + 1
      );
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featuredMovies.length]);
  
  const handlePlayClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };
  
  const handleInfoClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };
  
  if (featuredMovies.length === 0) {
    return null;
  }
  
  const currentMovie = featuredMovies[currentIndex];
  
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-streamify-black via-streamify-black/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-streamify-black/80 to-transparent z-10" />
        <img
          src={currentMovie.backdropUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center animate-scale-in"
          style={{ transition: "opacity 1s ease" }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end h-full">
        <div className="page-container pb-16 md:pb-24">
          <div className="max-w-2xl animate-fade-in">
            <div className="flex flex-wrap gap-2 mb-4">
              {currentMovie.genres.slice(0, 3).map((genre, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {currentMovie.title}
            </h1>
            
            <div className="flex items-center text-sm mb-6 text-white/80">
              <span className="mr-3">{currentMovie.releaseYear}</span>
              <span className="mr-3 flex items-center">
                <span className="text-primary font-bold mr-1">{currentMovie.rating}</span>/10
              </span>
              <span>{currentMovie.duration}</span>
            </div>
            
            <p className="text-white/90 mb-8 line-clamp-3 md:line-clamp-none">
              {currentMovie.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md flex items-center space-x-2"
                onClick={() => handlePlayClick(currentMovie.id)}
              >
                <Play className="w-5 h-5" />
                <span>Play Now</span>
              </Button>
              
              <Button 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white px-6 py-3 rounded-md flex items-center space-x-2"
                onClick={() => handleInfoClick(currentMovie.id)}
              >
                <Info className="w-5 h-5" />
                <span>More Info</span>
              </Button>
              
              <Button 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white p-3 rounded-full"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-8 right-8 z-30 flex space-x-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-6" : "bg-white/30"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`View featured movie ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
