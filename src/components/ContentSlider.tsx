
import React from "react";
import { Movie } from "@/lib/mockData";

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
  movies
}) => {
  return (
    <div className="my-6 relative">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4 animate-fade-in">{title}</h2>
        <p className="text-white/70">Content has been removed</p>
      </div>
    </div>
  );
};

export default ContentSlider;
