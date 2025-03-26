
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Info } from "lucide-react";
import { Movie } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useMyList } from "@/contexts/MyListContext";

interface HeroProps {
  movie: Movie;
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  const navigate = useNavigate();
  const { addToMyList, isInMyList } = useMyList();
  
  const handlePlayClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  const handleInfoClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  const handleAddToList = () => {
    if (!isInMyList(movie.id)) {
      addToMyList(movie);
    }
  };
  
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-streamify-black via-streamify-black/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-streamify-black/80 to-transparent z-10" />
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center animate-scale-in"
          style={{ transition: "opacity 1s ease" }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end h-full">
        <div className="page-container pb-16 md:pb-24">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {movie.title}
            </h1>
            
            <div className="flex items-center text-sm mb-6 text-white/80">
              <span className="mr-3">{movie.releaseYear}</span>
              <span className="mr-3 flex items-center">
                <span className="text-primary font-bold mr-1">{movie.rating}</span>/10
              </span>
              <span>{movie.duration}</span>
            </div>
            
            <p className="text-white/90 mb-8 line-clamp-3 md:line-clamp-none">
              {movie.description}
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md flex items-center space-x-2"
                onClick={handlePlayClick}
              >
                <Play className="w-5 h-5" />
                <span>Play Now</span>
              </Button>
              
              <Button 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white px-6 py-3 rounded-md flex items-center space-x-2"
                onClick={handleInfoClick}
              >
                <Info className="w-5 h-5" />
                <span>More Info</span>
              </Button>
              
              <Button 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white p-3 rounded-full"
                onClick={handleAddToList}
              >
                <Plus className="w-5 h-5" />
              </Button>
              
              <div className="flex flex-wrap gap-2 ml-1">
                {movie.genres.slice(0, 3).map((genre, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
