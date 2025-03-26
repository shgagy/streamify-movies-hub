
import React from "react";
import { Movie } from "@/lib/mockData";
import MovieCard from "./MovieCard";
import useResponsive from "@/hooks/useResponsive";

interface SliderContentProps {
  movies: Movie[];
  layout: "poster" | "backdrop";
  sliderRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
}

const SliderContent: React.FC<SliderContentProps> = ({
  movies,
  layout,
  sliderRef,
  onScroll,
}) => {
  const { isMdUp } = useResponsive();

  return (
    <div
      ref={sliderRef}
      className="flex overflow-x-auto scrollbar-none py-4 px-2 -mx-2"
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        gap: '16px' // Fixed gap between items
      }}
      onScroll={onScroll}
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
  );
};

export default SliderContent;
