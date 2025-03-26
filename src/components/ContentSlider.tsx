
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/lib/mockData";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";
import useResponsive from "@/hooks/useResponsive";

interface ContentSliderProps {
  title: string;
  movies: Movie[];
  layout?: "poster" | "backdrop";
  autoPlay?: boolean;
  interval?: number;
  useDotNavigation?: boolean;
  showArrows?: boolean;
}

const ContentSlider: React.FC<ContentSliderProps> = ({
  title,
  movies,
  layout = "poster",
  autoPlay = false,
  interval = 8000,
  useDotNavigation = false, // Default changed to false
  showArrows = false,
}) => {
  const { isMdUp, width } = useResponsive();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(1);

  // Calculate how many items to show at once based on layout and screen size
  const itemsPerPage = isMdUp 
    ? (layout === "poster" ? 5 : 3) 
    : (layout === "poster" ? 3 : 1);

  // Scroll to a specific slide by index
  const scrollToSlide = useCallback((index: number) => {
    if (!sliderRef.current) return;
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(index, totalSlides - 1));
    setActiveIndex(boundedIndex);
    
    // Calculate the element width including gap
    const itemElement = sliderRef.current.querySelector('.flex-none');
    if (!itemElement) return;
    
    const itemWidth = itemElement.clientWidth;
    const gapWidth = 16; // Our fixed gap between items
    
    // Calculate scroll position based on index
    const scrollPos = boundedIndex * (itemWidth + gapWidth) * itemsPerPage;
    
    // Perform the smooth scroll
    sliderRef.current.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
    
    console.log(`Scrolled to slide ${boundedIndex} for "${title}" slider, total slides: ${totalSlides}`);
  }, [itemsPerPage, title, totalSlides]);

  // Calculate the total number of slides
  const calculateTotalSlides = useCallback(() => {
    if (!sliderRef.current) return 1;
    
    const totalItems = movies.length;
    if (totalItems === 0) return 1;
    
    // Calculate total slides based on items per page
    const slides = Math.ceil(totalItems / itemsPerPage);
    return Math.max(slides, 1);
  }, [movies.length, itemsPerPage]);

  // Handle manual arrow navigation
  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      scrollToSlide(activeIndex - 1);
    } else {
      scrollToSlide(activeIndex + 1);
    }
  };

  // Update navigation button visibility based on scroll position
  const handleScroll = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    // Show left button only if we're not at the start
    setShowLeftButton(scrollLeft > 5);
    
    // Show right button only if we're not at the end
    setShowRightButton(scrollLeft + clientWidth < scrollWidth - 5);
    
    // Update active index based on scroll position if user manually scrolls
    if (!sliderRef.current.querySelector('.flex-none')) return;
    
    const itemWidth = sliderRef.current.querySelector('.flex-none')?.clientWidth || 0;
    const gapWidth = 16;
    const slideWidth = (itemWidth + gapWidth) * itemsPerPage;
    
    if (slideWidth > 0) {
      const newIndex = Math.round(scrollLeft / slideWidth);
      if (newIndex !== activeIndex && newIndex < totalSlides) {
        setActiveIndex(newIndex);
      }
    }
  };

  // Calculate total slides and handle component resize
  useEffect(() => {
    if (!sliderRef.current) return;
    
    const handleResize = () => {
      // Calculate total slides
      const slides = calculateTotalSlides();
      setTotalSlides(slides);
      
      // Reset to the first slide when resizing to avoid out-of-bounds issues
      setActiveIndex(prev => (prev >= slides ? 0 : prev));
      
      // Update navigation state
      handleScroll();
    };
    
    // Initial setup
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateTotalSlides, movies.length, itemsPerPage]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;
    
    const autoPlayTimer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % totalSlides;
      scrollToSlide(nextIndex);
    }, interval);
    
    return () => clearInterval(autoPlayTimer);
  }, [activeIndex, autoPlay, interval, scrollToSlide, totalSlides]);

  // Log for debugging
  useEffect(() => {
    console.log(`${title} slider: ${totalSlides} total slides, ${activeIndex} active index, ${itemsPerPage} items per page, width: ${width}px`);
  }, [title, totalSlides, activeIndex, itemsPerPage, width]);

  // Force recalculation when items per page changes
  useEffect(() => {
    const slides = calculateTotalSlides();
    setTotalSlides(slides);
  }, [calculateTotalSlides, itemsPerPage]);

  return (
    <div className="my-8">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <div className="relative group">
          {/* Left navigation arrow */}
          {showArrows && (
            <button
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-30 p-1 bg-streamify-black/80 text-white rounded-full transform transition-all duration-300",
                showLeftButton ? "opacity-80 hover:opacity-100 -translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
              )}
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Content slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-none py-4 px-2 -mx-2"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              gap: '16px' // Fixed gap between items
            }}
            onScroll={handleScroll}
          >
            {/* Hide webkit scrollbar */}
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            
            {/* Movie cards */}
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-none animate-fade-in"
                style={{
                  width: isMdUp 
                    ? (layout === "poster" ? "180px" : "320px") 
                    : (layout === "poster" ? "150px" : "260px"),
                  minWidth: isMdUp 
                    ? (layout === "poster" ? "180px" : "320px") 
                    : (layout === "poster" ? "150px" : "260px"),
                  maxWidth: isMdUp
                    ? (layout === "poster" ? "180px" : "320px")
                    : (layout === "poster" ? "150px" : "260px")
                }}
              >
                <MovieCard movie={movie} layout={layout} size={isMdUp ? "md" : "sm"} />
              </div>
            ))}
          </div>

          {/* Right navigation arrow */}
          {showArrows && (
            <button
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-30 p-1 bg-streamify-black/80 text-white rounded-full transform transition-all duration-300",
                showRightButton ? "opacity-80 hover:opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
              )}
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
        
        {/* Dot Navigation - Only shown when useDotNavigation is true */}
        {useDotNavigation && totalSlides > 0 && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => scrollToSlide(index)} 
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
        )}
      </div>
    </div>
  );
};

export default ContentSlider;
