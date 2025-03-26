
import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/lib/mockData";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";

interface ContentSliderProps {
  title: string;
  movies: Movie[];
  layout?: "poster" | "backdrop";
}

const ContentSlider: React.FC<ContentSliderProps> = ({
  title,
  movies,
  layout = "poster",
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const { scrollLeft, clientWidth } = sliderRef.current;
    const scrollAmount = clientWidth * 0.8;
    const newScrollLeft =
      direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

    sliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
  };

  return (
    <div className="my-8">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <div className="relative group">
          {/* Left navigation button */}
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

          {/* Content slider */}
          <div
            ref={sliderRef}
            className="flex space-x-4 overflow-x-auto scrollbar-none py-4 px-2 -mx-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={handleScroll}
          >
            {/* Hide webkit scrollbar */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {movies.map((movie) => (
              <div
                key={movie.id}
                className={cn(
                  "flex-none animate-fade-in",
                  layout === "backdrop" ? "first:pl-0 last:pr-8" : ""
                )}
              >
                <MovieCard movie={movie} layout={layout} />
              </div>
            ))}
          </div>

          {/* Right navigation button */}
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

          {/* Removed the gradient fades at the edges */}
        </div>
      </div>
    </div>
  );
};

export default ContentSlider;
