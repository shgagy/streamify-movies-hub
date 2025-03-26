
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
  useDotNavigation = true,
  showArrows = false,
}) => {
  const { isMdUp, width } = useResponsive();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [forceRender, setForceRender] = useState(0);
  const [visibleDots, setVisibleDots] = useState(true);

  // Calculate how many items to show at once based on layout and screen size
  const itemsPerPage = isMdUp 
    ? (layout === "poster" ? 5 : 3) 
    : (layout === "poster" ? 3 : 1);

  // Force at least 1 slide, even with empty movie lists
  const totalMovies = movies.length || 1;
  
  // Ensure we always have at least one dot when useDotNavigation is enabled
  const totalSlides = Math.max(Math.ceil(totalMovies / itemsPerPage), 1);

  const scrollToSlide = useCallback((index: number) => {
    if (!sliderRef.current) return;
    
    setActiveIndex(index);
    
    // Calculate scroll position based on index
    const itemWidth = sliderRef.current.querySelector('.flex-none')?.clientWidth || 0;
    const gapWidth = 16; // Our fixed gap between items
    const scrollPos = index * (itemWidth + gapWidth) * itemsPerPage;
    
    sliderRef.current.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
    
    console.log(`Scrolled to slide ${index} for ${title}`);
  }, [itemsPerPage, title]);

  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      const newIndex = Math.max(0, activeIndex - 1);
      scrollToSlide(newIndex);
    } else {
      const newIndex = Math.min(totalSlides - 1, activeIndex + 1);
      scrollToSlide(newIndex);
    }
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
    
    // Update active index based on scroll position
    const itemWidth = sliderRef.current.querySelector('.flex-none')?.clientWidth || 0;
    const gapWidth = 16;
    const slideWidth = (itemWidth + gapWidth) * itemsPerPage;
    
    if (slideWidth > 0) {
      const newIndex = Math.round(scrollLeft / slideWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  // Initialize dot navigation and handle window resize
  useEffect(() => {
    if (!sliderRef.current) return;
    
    // Force recalculation of active index on mount and resize
    const handleResize = () => {
      // Force component to re-render on resize to correctly calculate itemsPerPage
      setForceRender(prev => prev + 1);
      
      // Reset to the first slide when resizing to avoid out-of-bounds issues
      setActiveIndex(0);
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = 0;
      }
      
      // Update dot navigation state
      handleScroll();
      
      // Determine if we should show dots based on content width vs container width
      // This ensures we only show navigation when there's actually scrollable content
      if (sliderRef.current) {
        const totalContentWidth = sliderRef.current.scrollWidth;
        const containerWidth = sliderRef.current.clientWidth;
        
        // Always show at least one dot when useDotNavigation is enabled
        setVisibleDots(true);
      }
    };
    
    // Initialize dot navigation by running handleScroll once
    handleScroll();
    
    // Run the resize handler immediately on mount
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [movies.length, itemsPerPage, forceRender]); // Re-run when movies, itemsPerPage, or forceRender changes

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;
    
    const autoPlayTimer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % totalSlides;
      scrollToSlide(nextIndex);
    }, interval);
    
    return () => clearInterval(autoPlayTimer);
  }, [activeIndex, autoPlay, interval, scrollToSlide, totalSlides]);

  // Debugging effect to help track dot navigation state
  useEffect(() => {
    console.log(`${title} slider: ${totalSlides} total slides, ${activeIndex} active index, ${itemsPerPage} items per page, width: ${width}px`);
  }, [title, totalSlides, activeIndex, itemsPerPage, forceRender, width]);

  return (
    <div className="my-8">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <div className="relative group">
          {/* Left navigation button - only shown if showArrows is true */}
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
            {/* Hide webkit scrollbar using regular style tag */}
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            
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

          {/* Right navigation button - only shown if showArrows is true */}
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
        
        {/* Dot Navigation Controls - always shown if enabled regardless of totalSlides */}
        {useDotNavigation && visibleDots && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.max(totalSlides, 1) }).map((_, index) => (
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
