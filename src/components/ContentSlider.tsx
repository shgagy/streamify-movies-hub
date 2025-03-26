
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Movie } from "@/lib/mockData";
import MovieCard from "./MovieCard";
import useResponsive from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { Circle, CircleDot } from "lucide-react";

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
  autoPlay = false,
  interval = 6000
}) => {
  const { isMdUp } = useResponsive();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleItems, setVisibleItems] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Calculate visible items and total pages based on screen width
  useEffect(() => {
    const calculateDimensions = () => {
      if (!sliderRef.current) return;
      
      const containerWidth = sliderRef.current.clientWidth;
      const itemWidth = layout === "poster" 
        ? (isMdUp ? 180 : 140) 
        : (isMdUp ? 320 : 260);
      const gap = 16; // 4 in tailwind space-x-4
      
      const calculatedVisibleItems = Math.floor((containerWidth + gap) / (itemWidth + gap));
      setVisibleItems(calculatedVisibleItems);
      
      const calculatedTotalPages = Math.ceil(movies.length / calculatedVisibleItems);
      setTotalPages(calculatedTotalPages);
      
      // If current page is beyond the new total, adjust it
      if (currentPage >= calculatedTotalPages) {
        setCurrentPage(calculatedTotalPages - 1 > 0 ? calculatedTotalPages - 1 : 0);
      }
    };

    calculateDimensions();
    
    // Debounced resize handler for performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateDimensions, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isMdUp, movies.length, layout, currentPage]);

  // Handle smooth page navigation with animation lock
  const goToPage = useCallback((pageIndex: number) => {
    if (!sliderRef.current || isAnimating) return;
    
    // Don't animate if it's the same page
    if (pageIndex === currentPage) return;
    
    setIsAnimating(true);
    setCurrentPage(pageIndex);
    
    // Calculate scroll position
    const itemWidth = layout === "poster" 
      ? (isMdUp ? 180 : 140) 
      : (isMdUp ? 320 : 260);
    const gap = 16;
    const scrollAmount = pageIndex * (visibleItems * (itemWidth + gap));
    
    sliderRef.current.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Reset animation lock after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [currentPage, isAnimating, layout, isMdUp, visibleItems]);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || totalPages <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      const nextPage = (currentPage + 1) % totalPages;
      goToPage(nextPage);
    }, interval);
    
    return () => clearInterval(interval);
  }, [autoPlay, currentPage, totalPages, goToPage, interval, isPaused]);

  // Handle pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div 
      className="my-6 relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4 animate-fade-in">{title}</h2>
        
        <div className="relative">
          {/* Content Slider */}
          <div 
            ref={sliderRef}
            className="flex space-x-4 overflow-x-auto scrollbar-none pb-4 pt-1 -mx-4 px-4 snap-x"
            style={{ scrollBehavior: 'smooth' }}
          >
            {movies.slice(0, 15).map((movie, index) => (
              <div 
                key={movie.id} 
                className={cn(
                  "flex-shrink-0 transition-all duration-300 transform",
                  "hover:scale-[1.02] hover:z-10 snap-start",
                  "opacity-0 translate-y-4"
                )}
                style={{ 
                  width: layout === "poster" ? (isMdUp ? "180px" : "140px") : (isMdUp ? "320px" : "260px"),
                  animation: `fadeInUp 500ms ease-out forwards`,
                  animationDelay: `${index * 50}ms`
                }}
              >
                <MovieCard 
                  movie={movie} 
                  layout={layout} 
                  size={isMdUp ? "md" : "sm"} 
                />
              </div>
            ))}
          </div>
          
          {/* Animated Dot Navigation - Only show if more than one page */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2 animate-fade-in">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={cn(
                    "focus:outline-none transition-all duration-300",
                    isAnimating ? "pointer-events-none" : "pointer-events-auto"
                  )}
                  disabled={isAnimating}
                  aria-label={`Go to page ${index + 1}`}
                >
                  {index === currentPage ? (
                    <CircleDot className="w-4 h-4 text-primary transform scale-110 transition-all animate-pulse" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/50 hover:text-white/80 transition-all hover:scale-110" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentSlider;
