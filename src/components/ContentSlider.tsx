
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
  featured = false
}) => {
  const { isMdUp } = useResponsive();

  return (
    <div className="my-8">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {featured ? (
          // Featured grid with larger first item
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
        ) : (
          // Regular grid for all other content
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
            {movies.map((movie) => (
              <div key={movie.id} className="animate-fade-in">
                <MovieCard 
                  movie={movie} 
                  layout={layout} 
                  size={isMdUp ? "md" : "sm"} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentSlider;
