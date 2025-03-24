
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Info, Star } from "lucide-react";
import { Movie } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  layout?: "poster" | "backdrop";
  size?: "sm" | "md" | "lg";
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  layout = "poster", 
  size = "md" 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  const sizeClasses = {
    sm: layout === "poster" ? "w-[150px]" : "w-[250px]",
    md: layout === "poster" ? "w-[180px]" : "w-[320px]",
    lg: layout === "poster" ? "w-[220px]" : "w-[400px]"
  };
  
  return (
    <div 
      className={cn(
        "relative group overflow-hidden rounded-md transition-all duration-300",
        sizeClasses[size],
        isHovered ? "ring-2 ring-primary shadow-lg scale-105 z-10" : "shadow"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={layout === "poster" ? movie.posterUrl : movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)"
          }}
        />
        
        {/* Overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
        />
        
        {/* Rating */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm flex items-center">
          <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3 bg-streamify-darkgray">
        <h3 className="font-medium line-clamp-1">{movie.title}</h3>
        <div className="text-sm text-white/60 mt-1">
          <span>{movie.releaseYear}</span>
          <span className="mx-2">•</span>
          <span className="line-clamp-1">{movie.genres.slice(0, 2).join(", ")}</span>
        </div>
      </div>
      
      {/* Hover Actions */}
      <div 
        className={cn(
          "absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-streamify-black/90 to-transparent opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}
      >
        <div className="flex space-x-2 mb-4">
          <button 
            className="p-2 bg-primary hover:bg-primary/90 text-white rounded-full transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie.id}`);
            }}
          >
            <Play className="w-4 h-4" fill="currentColor" />
          </button>
          
          <button 
            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button 
            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie.id}`);
            }}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        
        <h3 className="font-medium text-lg mb-1">{movie.title}</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {movie.genres.slice(0, 3).map((genre, index) => (
            <span 
              key={index}
              className="px-2 py-0.5 bg-white/10 rounded-sm text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
        <p className="text-sm text-white/80 line-clamp-2">{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieCard;
