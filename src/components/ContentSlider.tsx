
import React from "react";
import { Movie } from "@/lib/mockData";
import { useContentSlider } from "@/hooks/useContentSlider";
import SliderContent from "./SliderContent";
import SliderNavigation from "./SliderNavigation";

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
  showArrows = true,
}) => {
  const {
    sliderRef,
    activeIndex,
    totalSlides,
    handleScroll,
    scrollToSlide,
  } = useContentSlider({
    totalItems: movies.length,
    layout
  });

  const handlePrevious = () => {
    scrollToSlide(Math.max(0, activeIndex - 1));
  };

  const handleNext = () => {
    scrollToSlide(Math.min(totalSlides - 1, activeIndex + 1));
  };

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

          {/* Arrow Navigation */}
          <SliderNavigation
            totalSlides={totalSlides}
            activeIndex={activeIndex}
            onPrevious={handlePrevious}
            onNext={handleNext}
            showNavigation={showArrows}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentSlider;
