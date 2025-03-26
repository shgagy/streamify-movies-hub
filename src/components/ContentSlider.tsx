
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
  layout = "poster"
}) => {
  const { isMdUp } = useResponsive();

  return (
    <div className="my-8">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* Simple responsive grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4">
          {movies.slice(0, 8).map((movie) => (
            <div 
              key={movie.id} 
              className="animate-fade-in"
            >
              <MovieCard 
                movie={movie} 
                layout={layout} 
                size={isMdUp ? "md" : "sm"} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentSlider;
