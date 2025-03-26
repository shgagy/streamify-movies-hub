
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { Movie } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

interface HeroProps {
  movies: Movie[];
}

const Hero: React.FC<HeroProps> = ({
  movies
}) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentMovie = movies[activeIndex];

  const handlePlayClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleInfoClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="relative h-[60vh] w-full overflow-hidden">
      <div className="carousel-container w-full h-full">
        <div className="absolute inset-0 w-full h-full">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-streamify-black via-streamify-black/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-streamify-black/80 to-transparent z-10" />
            {currentMovie && (
              <img 
                src={currentMovie.backdropUrl} 
                alt={currentMovie.title} 
                className="w-full h-full object-cover object-center" 
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            )}
          </div>
          
          {/* Content */}
          {currentMovie && (
            <div className="relative z-20 flex flex-col justify-end h-full">
              <div className="page-container pb-16">
                <div className="max-w-2xl">
                  <h1 className="font-bold mb-4 leading-tight text-2xl md:text-3xl">
                    {currentMovie.title}
                  </h1>
                  
                  <div className="flex items-center text-sm mb-6 text-white/80">
                    <span className="mr-3">{currentMovie.releaseYear}</span>
                    <span className="mr-3 flex items-center">
                      <span className="text-primary font-bold mr-1">{currentMovie.rating}</span>/10
                    </span>
                    <span>{currentMovie.duration}</span>
                  </div>
                  
                  <p className="text-white/90 mb-8 line-clamp-3">
                    {currentMovie.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md flex items-center space-x-2" onClick={() => handlePlayClick(Number(currentMovie.id))}>
                      <Play className="w-5 h-5" />
                      <span>مشاهدة الآن</span>
                    </Button>
                    
                    <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white px-6 py-3 rounded-md flex items-center space-x-2" onClick={() => handleInfoClick(Number(currentMovie.id))}>
                      <Info className="w-5 h-5" />
                      <span>مزيد من المعلومات</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dot Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4">
        <div className="flex items-center gap-2">
          {movies.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setActiveIndex(index)} 
              className={`transition-all duration-300 ${
                index === activeIndex 
                  ? "bg-primary w-8 h-2.5 rounded-full" 
                  : "bg-white/30 hover:bg-white/50 w-2.5 h-2.5 rounded-full"
              }`} 
              aria-label={`Go to slide ${index + 1}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
