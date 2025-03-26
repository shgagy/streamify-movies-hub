
import React from "react";
import { Movie } from "@/lib/mockData";
import { useContentSlider } from "@/hooks/useContentSlider";
import SliderContent from "./SliderContent";
import SliderDots from "./SliderDots";

interface ContentSliderProps {
  title: string;
  movies: Movie[];
  layout?: "poster" | "backdrop";
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
}

const ContentSlider: React.FC<ContentSliderProps> = ({
  title,
  movies,
  layout = "poster",
  autoPlay = false,
  interval = 8000,
  showArrows = false,
}) => {
  const {
    sliderRef,
    activeIndex,
    totalSlides,
    handleScroll,
    scrollToSlide,
    getVisibleDots
  } = useContentSlider({
    totalItems: movies.length,
    layout
  });

  const handleDotClick = (index: number) => {
    scrollToSlide(index);
  };

  const maxVisibleDots = getVisibleDots();

  return (
    <div className="my-8">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <div className="relative group">
          {/* Content slider */}
          <SliderContent
            movies={movies}
            layout={layout}
            sliderRef={sliderRef}
            onScroll={handleScroll}
          />

          {/* Dot Navigation - Conditionally render based on number of slides */}
          <SliderDots
            totalDots={maxVisibleDots}
            activeIndex={activeIndex}
            onDotClick={handleDotClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentSlider;
