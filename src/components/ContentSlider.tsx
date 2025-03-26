
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Movie } from "@/lib/mockData";
import MovieCard from "./MovieCard";
import useResponsive from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { Circle, CircleDot, GripHorizontal } from "lucide-react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

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

    // Log the slide change for debugging
    console.info(`Scrolled to slide ${pageIndex}`);
  }, [currentPage, isAnimating, layout, isMdUp, visibleItems]);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || totalPages <= 1 || isPaused) return;
    
    const autoPlayInterval = setInterval(() => {
      const nextPage = (currentPage + 1) % totalPages;
      goToPage(nextPage);
    }, interval);
    
    return () => clearInterval(autoPlayInterval);
  }, [autoPlay, currentPage, totalPages, goToPage, interval, isPaused]);

  // Handle pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Handle touch/drag events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current || totalPages <= 1) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(sliderRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current || totalPages <= 1) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollLeft(sliderRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const distance = (startX - x);
    setDragDistance(distance);
    sliderRef.current.scrollLeft = scrollLeft + distance;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX;
    const distance = (startX - x);
    setDragDistance(distance);
    sliderRef.current.scrollLeft = scrollLeft + distance;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(dragDistance) > 50) {
      // Determine direction and go to next/previous page
      const direction = dragDistance > 0 ? 1 : -1; // 1 for right, -1 for left
      const nextPage = Math.max(0, Math.min(totalPages - 1, currentPage + direction));
      goToPage(nextPage);
    } else {
      // If drag was minimal, snap back to current page
      goToPage(currentPage);
    }
  };

  const handleMouseLeaveSlider = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

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
            className={cn(
              "flex space-x-4 overflow-x-auto scrollbar-none pb-4 pt-1 -mx-4 px-4 snap-x",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeaveSlider}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
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
          
          {/* Animated Dot Navigation with Drag Indicator - Only show if more than one page */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2 animate-fade-in">
              <GripHorizontal 
                className={cn(
                  "w-4 h-4 text-white/50 mr-2 transition-opacity duration-300",
                  isDragging ? "opacity-100" : "opacity-50"
                )} 
              />
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={cn(
                    "focus:outline-none transition-all duration-300",
                    isAnimating ? "pointer-events-none" : "pointer-events-auto",
                    isDragging ? "scale-90" : ""
                  )}
                  disabled={isAnimating}
                  aria-label={`Go to page ${index + 1}`}
                >
                  {index === currentPage ? (
                    <CircleDot 
                      className={cn(
                        "w-4 h-4 text-primary transform transition-all",
                        isDragging ? "scale-100" : "scale-110 animate-pulse"
                      )} 
                    />
                  ) : (
                    <Circle 
                      className={cn(
                        "w-4 h-4 text-white/50 hover:text-white/80 transition-all",
                        isDragging ? "scale-90" : "hover:scale-110"
                      )} 
                    />
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
