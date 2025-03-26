
import React, { useRef, useState, useEffect, useCallback } from "react";
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
  showArrows?: boolean;
}

const ContentSlider: React.FC<ContentSliderProps> = ({
  title,
  movies,
  layout = "poster",
  autoPlay = false, // Changed default to false
  interval = 8000,
  showArrows = false,
}) => {
  const { isMdUp, width } = useResponsive();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(1);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate how many items to show at once based on layout and screen size
  const itemsPerPage = isMdUp 
    ? (layout === "poster" ? 5 : 3) 
    : (layout === "poster" ? 3 : 1);

  // Scroll to a specific slide by index
  const scrollToSlide = useCallback((index: number) => {
    if (!sliderRef.current) return;
    
    // Ensure index is within bounds - for wide screens, we need to limit the maximum index
    // to prevent scrolling beyond content boundaries
    const maxSafeIndex = isMdUp 
      ? Math.max(0, Math.min(index, totalSlides - 2)) 
      : Math.max(0, Math.min(index, totalSlides - 1));
    
    setActiveIndex(maxSafeIndex);
    
    // Calculate the element width including gap
    const itemElement = sliderRef.current.querySelector('.flex-none');
    if (!itemElement) return;
    
    const itemWidth = itemElement.clientWidth;
    const gapWidth = 16; // Our fixed gap between items
    
    // Calculate scroll position based on index
    const scrollPos = maxSafeIndex * (itemWidth + gapWidth) * itemsPerPage;
    
    // Perform the smooth scroll
    sliderRef.current.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
    
    console.log(`Scrolled to slide ${maxSafeIndex} for "${title}" slider, total slides: ${totalSlides}`);
  }, [itemsPerPage, title, totalSlides, isMdUp]);

  // Calculate the total number of slides
  const calculateTotalSlides = useCallback(() => {
    if (!sliderRef.current) return 1;
    
    const totalItems = movies.length;
    if (totalItems === 0) return 1;
    
    // Calculate total slides based on items per page
    const slides = Math.ceil(totalItems / itemsPerPage);
    return Math.max(slides, 1);
  }, [movies.length, itemsPerPage]);

  // Update navigation button visibility based on scroll position
  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    // Show left button only if we're not at the start
    setShowLeftButton(scrollLeft > 5);
    
    // Show right button only if we're not at the end
    setShowRightButton(scrollLeft + clientWidth < scrollWidth - 5);
    
    // Clear any pending scroll detection
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    // Detect when scrolling stops
    scrollTimerRef.current = setTimeout(() => {
      if (!sliderRef.current) return;
      
      const itemWidth = sliderRef.current.querySelector('.flex-none')?.clientWidth || 0;
      const gapWidth = 16;
      const slideWidth = (itemWidth + gapWidth) * itemsPerPage;
      
      if (slideWidth > 0) {
        const newIndex = Math.round(scrollLeft / slideWidth);
        if (newIndex !== activeIndex && newIndex < totalSlides) {
          setActiveIndex(newIndex);
        }
      }
    }, 100);
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
  }, [calculateTotalSlides, handleScroll, movies.length, itemsPerPage]);

  // Handle dot navigation
  const handleDotClick = (index: number) => {
    scrollToSlide(index);
  };

  // Calculate visible dots based on screen size
  const maxVisibleDots = isMdUp ? Math.max(0, totalSlides - 1) : totalSlides;

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

          {/* Dot Navigation */}
          {maxVisibleDots > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2">
                {Array.from({ length: maxVisibleDots }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
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
    </div>
  );
};

export default ContentSlider;
