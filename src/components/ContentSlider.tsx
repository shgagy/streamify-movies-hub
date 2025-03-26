
import React from "react";
import { Movie } from "@/lib/mockData";
import MovieCard from "./MovieCard";
import useResponsive from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

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
  featured = true
}) => {
  const { isMdUp } = useResponsive();

  return (
    <div className="my-8">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* All content now uses the featured grid layout with larger first item */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
          {movies.slice(0, 7).map((movie, index) => (
            <div 
              key={movie.id} 
              className={cn(
                "animate-fade-in",
                index === 0 && "sm:col-span-2 sm:row-span-2"
              )}
            >
              <MovieCard 
                movie={movie} 
                layout={layout} 
                size={index === 0 ? "lg" : (isMdUp ? "md" : "sm")} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentSlider;
