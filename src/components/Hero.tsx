
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Info } from "lucide-react";
import { Movie } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useMyList } from "@/contexts/MyListContext";
import { 
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

interface HeroProps {
  movies: Movie[];
}

const Hero: React.FC<HeroProps> = ({ movies }) => {
  const navigate = useNavigate();
  const { addToMyList, isInMyList } = useMyList();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Get current movie based on index
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

  const scrollToSlide = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };
  
  // Update activeIndex when slide changes
  React.useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    
    // Initial call to set the active index on mount
    onSelect();
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  
  return (
    <Carousel className="relative h-[80vh] w-full overflow-hidden">
      <CarouselContent ref={emblaRef}>
        {movies.map((movie, index) => (
          <CarouselItem key={movie.id} className="w-full relative min-w-0 flex-shrink-0">
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
                      onClick={() => handlePlayClick(Number(movie.id))}
                    >
                      <Play className="w-5 h-5" />
                      <span>Play Now</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white px-6 py-3 rounded-md flex items-center space-x-2"
                      onClick={() => handleInfoClick(Number(movie.id))}
                    >
                      <Info className="w-5 h-5" />
                      <span>More Info</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 text-white p-3 rounded-full"
                      onClick={() => handleAddToList(movie)}
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
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Dot Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4">
        <div className="flex items-center gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? "bg-primary w-8" 
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Carousel>
  );
};

export default Hero;
