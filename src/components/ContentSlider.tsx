
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Info } from "lucide-react";
import { Movie } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useMyList } from "@/contexts/MyListContext";

interface ContentSliderProps {
  title: string;
  movies: Movie[];
  layout?: "poster" | "backdrop";
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  featured?: boolean;
}

const ContentSlider: React.FC<ContentSliderProps> = ({
  title,
  movies,
  layout = "poster",
  autoPlay = true,
  interval = 8000,
  showArrows = true,
  featured = false
}) => {
  const navigate = useNavigate();
  const {
    addToMyList,
    isInMyList
  } = useMyList();
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselRef, setCarouselRef] = useState<HTMLDivElement | null>(null);
  const currentMovie = movies[activeIndex];

  const handlePlayClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleInfoClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleAddToList = (movie: Movie) => {
    if (!isInMyList(movie.id)) {
      addToMyList(movie);
    }
  };

  const scrollToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    console.log(`Scrolled to slide ${index}`);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    
    const autoPlayInterval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % movies.length;
      scrollToSlide(nextIndex);
    }, interval);
    
    return () => clearInterval(autoPlayInterval);
  }, [activeIndex, movies.length, scrollToSlide, autoPlay, interval]);

  if (!featured) {
    return (
      <div className="my-6 relative">
        <div className="page-container">
          <h2 className="text-2xl font-bold mb-4 animate-fade-in">{title}</h2>
          <p className="text-white/70">Content has been removed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] w-full overflow-hidden my-12">
      {/* Title - displayed outside the carousel */}
      <div className="page-container mb-4">
        <h2 className="text-3xl font-bold animate-fade-in z-50 relative">{title}</h2>
      </div>
      
      <div className="carousel-container w-full h-full" ref={setCarouselRef}>
        {movies.map((movie, index) => (
          <div 
            key={movie.id} 
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 z-0">
              {/* Top gradient - softened */}
              <div className="absolute inset-0 bg-gradient-to-b from-streamify-black/70 via-streamify-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-streamify-black/70 to-transparent z-10" />
              {/* Bottom gradient - softened */}
              <div className="absolute inset-0 bg-gradient-to-t from-streamify-black/70 via-streamify-black/20 to-transparent z-10" />
              <img 
                src={movie.backdropUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover object-center animate-scale-in" 
              />
            </div>
            
            <div className="relative z-20 flex flex-col justify-end h-full">
              <div className="page-container pb-16 md:pb-20">
                <div className="max-w-2xl animate-fade-in">
                  <h1 className="font-bold mb-3 leading-tight text-3xl md:text-4xl">
                    {movie.title}
                  </h1>
                  
                  <div className="flex items-center text-base mb-5 text-white/90">
                    <span className="mr-4">{movie.releaseYear}</span>
                    <span className="mr-4 flex items-center">
                      <span className="text-primary font-bold mr-1">{movie.rating}</span>/10
                    </span>
                    <span>{movie.duration}</span>
                  </div>
                  
                  <p className="text-white/90 mb-8 line-clamp-3 text-base md:text-lg">
                    {movie.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 h-auto rounded-md flex items-center space-x-2 text-base" onClick={() => handlePlayClick(Number(movie.id))}>
                      <Play className="w-5 h-5" />
                      <span>Play Now</span>
                    </Button>
                    
                    <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white px-8 py-4 h-auto rounded-md flex items-center space-x-2 text-base" onClick={() => handleInfoClick(Number(movie.id))}>
                      <Info className="w-5 h-5" />
                      <span>More Info</span>
                    </Button>
                    
                    <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white p-4 h-auto rounded-full" onClick={() => handleAddToList(movie)}>
                      <Plus className="w-5 h-5" />
                    </Button>
                    
                    <div className="flex flex-wrap gap-2 ml-2">
                      {movie.genres.slice(0, 3).map((genre, index) => (
                        <span key={index} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm md:text-base">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4">
        <div className="flex items-center gap-3">
          {movies.map((_, index) => (
            <button 
              key={index} 
              onClick={() => scrollToSlide(index)} 
              className={`transition-all duration-300 ${
                index === activeIndex 
                  ? "bg-primary w-10 h-2.5 rounded-full" 
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

export default ContentSlider;
