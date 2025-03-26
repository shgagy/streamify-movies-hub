
import React, { useRef, useState } from "react";
import { Movie } from "@/lib/mockData";
import MovieCard from "./MovieCard";
import useResponsive from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  showArrows = true
}) => {
  const { isMdUp } = useResponsive();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.75;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="my-6 relative group">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        
        <div className="relative">
          {/* Left Arrow */}
          {showArrows && showLeftArrow && (
            <button 
              onClick={() => scroll("left")} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity -ml-4"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          {/* Content Slider */}
          <div 
            ref={sliderRef}
            className="flex space-x-4 overflow-x-auto scrollbar-none pb-4 pt-1 -mx-4 px-4"
            onScroll={handleScroll}
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
          
          {/* Right Arrow */}
          {showArrows && showRightArrow && (
            <button 
              onClick={() => scroll("right")} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity -mr-4"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentSlider;
