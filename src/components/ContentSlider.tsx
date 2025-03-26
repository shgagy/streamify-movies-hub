
import React, { useRef, useState, useEffect } from "react";
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
  layout = "poster"
}) => {
  const { isMdUp } = useResponsive();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Calculate visible items and total pages based on screen width
  useEffect(() => {
    const calculatePages = () => {
      if (!sliderRef.current) return;
      
      const containerWidth = sliderRef.current.clientWidth;
      const itemWidth = layout === "poster" 
        ? (isMdUp ? 180 : 140) 
        : (isMdUp ? 320 : 260);
      const gap = 16; // 4 in tailwind space-x-4
      
      const visibleItems = Math.floor((containerWidth + gap) / (itemWidth + gap));
      const calculatedTotalPages = Math.ceil(movies.length / visibleItems);
      
      setTotalPages(calculatedTotalPages);
      
      // If current page is beyond the new total, adjust it
      if (currentPage >= calculatedTotalPages) {
        setCurrentPage(calculatedTotalPages - 1);
      }
    };

    calculatePages();
    window.addEventListener('resize', calculatePages);
    
    return () => {
      window.removeEventListener('resize', calculatePages);
    };
  }, [isMdUp, movies.length, layout, currentPage]);

  // Handle page navigation
  const goToPage = (pageIndex: number) => {
    if (!sliderRef.current) return;
    
    setCurrentPage(pageIndex);
    
    const containerWidth = sliderRef.current.clientWidth;
    const scrollAmount = containerWidth * pageIndex;
    
    sliderRef.current.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="my-6 relative">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        
        <div className="relative">
          {/* Content Slider */}
          <div 
            ref={sliderRef}
            className="flex space-x-4 overflow-x-auto scrollbar-none pb-4 pt-1 -mx-4 px-4 snap-x"
          >
            {movies.slice(0, 15).map((movie) => (
              <div 
                key={movie.id} 
                className="flex-shrink-0 transition-transform first:ml-0"
                style={{ width: layout === "poster" ? (isMdUp ? "180px" : "140px") : (isMdUp ? "320px" : "260px") }}
              >
                <MovieCard 
                  movie={movie} 
                  layout={layout} 
                  size={isMdUp ? "md" : "sm"} 
                />
              </div>
            ))}
          </div>
          
          {/* Simple Dot Navigation - Only show if more than one page */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className="focus:outline-none transition-colors"
                  aria-label={`Go to page ${index + 1}`}
                >
                  {index === currentPage ? (
                    <CircleDot className="w-4 h-4 text-primary" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/50 hover:text-white/80" />
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
