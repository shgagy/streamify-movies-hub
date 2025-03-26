
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
  movies,
  layout = "poster",
  autoPlay = true,
  interval = 8000,
  showArrows = true,
  featured = false
}) => {
  return (
    <div className="my-6 relative">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4 animate-fade-in">{title}</h2>
        <div className="py-8 bg-streamify-darkgray/30 rounded-lg flex items-center justify-center">
          <p className="text-white/70">المحتوى غير متوفر حالياً</p>
        </div>
      </div>
    </div>
  );
};

export default ContentSlider;
