
import React, { useRef, useState, useEffect, useCallback, memo } from "react";
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
}

// Using memo to prevent unnecessary re-renders of the entire component
const ContentSlider: React.FC<ContentSliderProps> = memo(({
  title,
  movies,
  layout = "poster",
  autoPlay = false,
  interval = 8000,
}) => {
  const { isMdUp, width } = useResponsive();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(1);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate how many items to show at once based on layout and screen size
  const itemsPerPage = isMdUp 
    ? (layout === "poster" ? 5 : 3) 
    : (layout === "poster" ? 3 : 1);

  // Memoize the scroll to slide function to prevent recreating it on each render
  const scrollToSlide = useCallback((index: number) => {
    if (!sliderRef.current) return;
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(index, totalSlides - 1));
    
    // Only update state if the index actually changed
    if (boundedIndex !== activeIndex) {
      setActiveIndex(boundedIndex);
    }
    
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
  }, [itemsPerPage, title, totalSlides, activeIndex]);

  // Memoize the calculation function for total slides
  const calculateTotalSlides = useCallback(() => {
    if (!sliderRef.current) return 1;
    
    const totalItems = movies.length;
    if (totalItems === 0) return 1;
    
    // Calculate total slides based on items per page
    const slides = Math.ceil(totalItems / itemsPerPage);
    return Math.max(slides, 1);
  }, [movies.length, itemsPerPage]);

  // Debounced scroll handler to reduce number of state updates
  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    // Check if scrollable element exists
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
  }, [activeIndex, itemsPerPage, totalSlides]);

  // Calculate total slides and handle component resize
  useEffect(() => {
    if (!sliderRef.current) return;
    
    const handleResize = () => {
      // Calculate total slides
      const slides = calculateTotalSlides();
      setTotalSlides(slides);
      
      // Reset to the first slide when resizing to avoid out-of-bounds issues
      setActiveIndex(prev => (prev >= slides ? 0 : prev));
    };
    
    // Initial setup
    handleResize();
    
    // Use a more efficient resize observer instead of window resize event
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(sliderRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateTotalSlides, movies.length, itemsPerPage]);

  // Optimized auto-play functionality with cleanup
  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;
    
    // Clear any existing timer
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
    
    autoPlayTimerRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % totalSlides;
      scrollToSlide(nextIndex);
    }, interval);
    
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [activeIndex, autoPlay, interval, scrollToSlide, totalSlides]);

  // Debug logging - reduced to only log when values actually change
  useEffect(() => {
    console.log(`${title} slider: ${totalSlides} total slides, ${activeIndex} active index, ${itemsPerPage} items per page, width: ${width}px`);
  }, [title, totalSlides, activeIndex, itemsPerPage, width]);

  // Memoized dot navigation component to prevent unnecessary re-renders
  const DotNavigation = useCallback(() => {
    if (totalSlides <= 1) return null;
    
    return (
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
    );
  }, [activeIndex, scrollToSlide, totalSlides]);

  return (
    <div className="my-8">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <div className="relative group">
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
        </div>
        
        {/* Dot Navigation - using memoized component */}
        <DotNavigation />
      </div>
    </div>
  );
});

ContentSlider.displayName = "ContentSlider";

export default ContentSlider;
