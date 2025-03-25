
import React, { useRef, useEffect, useCallback } from "react";
import { genres } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GenreFilterProps {
  onSelectGenre: (genreId: string | null) => void;
  selectedGenreId: string | null;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
  onSelectGenre, 
  selectedGenreId 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const scrollAmount = 200;

  // Handle scroll position to show/hide navigation arrows
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Check initial scroll position
      handleScroll();
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // Scroll left/right
  const handleScrollClick = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft } = scrollContainerRef.current;
    const newScrollLeft = direction === 'left' 
      ? scrollLeft - scrollAmount 
      : scrollLeft + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  }, [scrollAmount]);

  // Memoize the button class function to improve performance
  const getButtonClass = useCallback((isSelected: boolean) => {
    return cn(
      "whitespace-nowrap transition-colors",
      isSelected
        ? "bg-primary text-white hover:bg-primary/90"
        : "bg-streamify-darkgray hover:bg-streamify-gray"
    );
  }, []);

  return (
    <div className="relative">
      {/* Left scroll button */}
      {showLeftArrow && (
        <button 
          onClick={() => handleScrollClick('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-streamify-black/90 text-white rounded-full shadow-md hover:bg-primary/80 transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-none py-3 px-2 -mx-2 flex space-x-2 relative"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectGenre(null)}
          className={getButtonClass(selectedGenreId === null)}
        >
          All Genres
        </Button>
        
        {genres.map((genre) => (
          <Button
            key={genre.id}
            variant="outline"
            size="sm"
            onClick={() => onSelectGenre(genre.id)}
            className={getButtonClass(selectedGenreId === genre.id)}
          >
            {genre.name}
          </Button>
        ))}
      </div>
      
      {/* Right scroll button */}
      {showRightArrow && (
        <button 
          onClick={() => handleScrollClick('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-streamify-black/90 text-white rounded-full shadow-md hover:bg-primary/80 transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      
      {/* Gradient fades for better scrolling indication */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-streamify-black to-transparent pointer-events-none z-[1]" 
           style={{ opacity: showLeftArrow ? 1 : 0, transition: 'opacity 0.3s ease' }} />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-streamify-black to-transparent pointer-events-none z-[1]" 
           style={{ opacity: showRightArrow ? 1 : 0, transition: 'opacity 0.3s ease' }} />
    </div>
  );
};

export default GenreFilter;
