
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SliderNavigationProps {
  totalSlides: number;
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  showNavigation?: boolean;
}

const SliderNavigation: React.FC<SliderNavigationProps> = ({
  totalSlides,
  activeIndex,
  onPrevious,
  onNext,
  showNavigation = true,
}) => {
  // If only one slide or navigation disabled, don't show arrows
  if (totalSlides <= 1 || !showNavigation) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 ml-2 pointer-events-auto transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
        onClick={onPrevious}
        disabled={activeIndex === 0}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 mr-2 pointer-events-auto transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
        onClick={onNext}
        disabled={activeIndex >= totalSlides - 1}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SliderNavigation;
