
import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Info } from "lucide-react";
import { Movie } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useMyList } from "@/contexts/MyListContext";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Carousel3D } from "./3DCarousel";

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

  if (title === "Trending Now") {
    return (
      <div className="my-6 relative">
        <div className="page-container">
          <h2 className="text-2xl font-bold mb-4 animate-fade-in">{title}</h2>
          <div className="h-[40vh] w-full">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            }>
              <Canvas 
                camera={{ position: [0, 0, 8], fov: 60 }}
                onError={(error) => {
                  console.error("Canvas error:", error);
                }}
              >
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Carousel3D 
                  movies={movies} 
                  activeIndex={activeIndex} 
                  setActiveIndex={setActiveIndex} 
                />
                <Environment preset="city" />
              </Canvas>
            </Suspense>
          </div>
          {movies.length > 0 && (
            <div className="text-center pt-4">
              <h3 className="text-xl font-semibold">{currentMovie.title}</h3>
              <div className="flex justify-center gap-3 mt-3">
                <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 h-auto rounded-md flex items-center space-x-2 text-sm" onClick={() => handlePlayClick(Number(currentMovie.id))}>
                  <Play className="w-3 h-3" />
                  <span>Play</span>
                </Button>
                <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white px-4 py-2 h-auto rounded-md flex items-center space-x-2 text-sm" onClick={() => handleInfoClick(Number(currentMovie.id))}>
                  <Info className="w-3 h-3" />
                  <span>Info</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
    <div className="relative h-[60vh] w-full overflow-hidden my-6">
      <div className="page-container mb-2">
        <h2 className="text-2xl font-bold animate-fade-in z-50 relative">{title}</h2>
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
              <div className="absolute inset-0 bg-gradient-to-b from-streamify-black/50 via-streamify-black/10 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-streamify-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-streamify-black/50 via-streamify-black/10 to-transparent z-10" />
              <img 
                src={movie.backdropUrl || "/movie-placeholder.jpg"} 
                alt={movie.title} 
                className="w-full h-full object-cover object-center animate-scale-in" 
                onError={(e) => {
                  e.currentTarget.src = "/movie-placeholder.jpg";
                }}
              />
            </div>
            
            <div className="relative z-20 flex flex-col justify-end h-full">
              <div className="page-container pb-12 md:pb-14">
                <div className="max-w-2xl animate-fade-in">
                  <h1 className="font-bold mb-2 leading-tight text-2xl md:text-3xl">
                    {movie.title}
                  </h1>
                  
                  <div className="flex items-center text-sm mb-3 text-white/90">
                    <span className="mr-3">{movie.releaseYear}</span>
                    <span className="mr-3 flex items-center">
                      <span className="text-primary font-bold mr-1">{movie.rating}</span>/10
                    </span>
                    <span>{movie.duration}</span>
                  </div>
                  
                  <p className="text-white/90 mb-6 line-clamp-2 text-sm md:text-base">
                    {movie.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 items-center">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 h-auto rounded-md flex items-center space-x-2 text-sm" onClick={() => handlePlayClick(Number(movie.id))}>
                      <Play className="w-4 h-4" />
                      <span>Play Now</span>
                    </Button>
                    
                    <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white px-6 py-3 h-auto rounded-md flex items-center space-x-2 text-sm" onClick={() => handleInfoClick(Number(movie.id))}>
                      <Info className="w-4 h-4" />
                      <span>More Info</span>
                    </Button>
                    
                    <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white p-3 h-auto rounded-full" onClick={() => handleAddToList(movie)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex flex-wrap gap-2 ml-1">
                      {movie.genres.slice(0, 3).map((genre, index) => (
                        <span key={index} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm">
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

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-3">
        <div className="flex items-center gap-2">
          {movies.map((_, index) => (
            <button 
              key={index} 
              onClick={() => scrollToSlide(index)} 
              className={`transition-all duration-300 ${
                index === activeIndex 
                  ? "bg-primary w-8 h-2 rounded-full" 
                  : "bg-white/30 hover:bg-white/50 w-2 h-2 rounded-full"
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
