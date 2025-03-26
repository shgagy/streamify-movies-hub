
import React from "react";

interface SliderDotsProps {
  totalDots: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}

const SliderDots: React.FC<SliderDotsProps> = ({
  totalDots,
  activeIndex,
  onDotClick,
}) => {
  if (totalDots <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalDots }).map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`transition-all duration-300 ${
              index === activeIndex
                ? "bg-primary w-8 h-2.5 rounded-full"
                : "bg-white/30 hover:bg-white/50 w-2.5 h-2.5 rounded-full"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SliderDots;
