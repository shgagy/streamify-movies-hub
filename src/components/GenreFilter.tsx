
import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { fetchAllGenres } from "@/services/api";
import { cn } from "@/lib/utils";
import useResponsive from "@/hooks/useResponsive";

interface GenreFilterProps {
  selectedGenreId: string | null;
  onSelectGenre: (genreId: string | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenreId,
  onSelectGenre,
}) => {
  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchAllGenres
  });
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const responsive = useResponsive();
  
  // Calculate how many genres fit in the visible area
  const calculatePages = () => {
    if (!scrollContainerRef.current || !genres.length) return;
    
    const containerWidth = scrollContainerRef.current.clientWidth;
    const firstButton = scrollContainerRef.current.querySelector('button');
    if (!firstButton) return;
    
    // Include margin/padding in the calculation
    const buttonWidth = firstButton.offsetWidth + 8; // 8px for margin/gap
    const genresPerPage = Math.floor(containerWidth / buttonWidth);
    
    // Always ensure we have at least 2 pages if there are many genres
    // This guarantees that dot navigation is shown on wide screens too
    const minPages = responsive.isLgUp ? 2 : 1;
    const calculatedPages = Math.max(minPages, Math.ceil((genres.length + 1) / Math.max(1, genresPerPage)));
    
    setTotalPages(calculatedPages);
    
    // Log for debugging
    console.log({
      containerWidth,
      buttonWidth,
      genresPerPage,
      totalGenres: genres.length,
      calculatedPages,
      windowWidth: window.innerWidth
    });
  };

  // Handle page navigation
  const goToPage = (pageIndex: number) => {
    if (!scrollContainerRef.current) return;
    
    // Ensure index is in bounds
    const boundedIndex = Math.max(0, Math.min(pageIndex, totalPages - 1));
    setCurrentPage(boundedIndex);
    
    const firstButton = scrollContainerRef.current.querySelector('button');
    if (!firstButton) return;
    
    // Calculate scroll position based on page index
    const buttonWidth = firstButton.offsetWidth + 8; // 8px for margin/gap
    const containerWidth = scrollContainerRef.current.clientWidth;
    const genresPerPage = Math.max(1, Math.floor(containerWidth / buttonWidth));
    const scrollPos = boundedIndex * genresPerPage * buttonWidth;
    
    // Smooth scroll to position
    scrollContainerRef.current.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
  };

  // Initialize and handle window resize
  useEffect(() => {
    calculatePages();
    
    const handleResize = () => {
      calculatePages();
      // Don't reset to first page on resize to maintain user position
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [genres.length, responsive.width]);
  
  // Update current page when scrolling manually
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const firstButton = scrollContainerRef.current.querySelector('button');
    if (!firstButton) return;
    
    const buttonWidth = firstButton.offsetWidth + 8;
    const containerWidth = scrollContainerRef.current.clientWidth;
    const genresPerPage = Math.max(1, Math.floor(containerWidth / buttonWidth));
    const scrollPos = scrollContainerRef.current.scrollLeft;
    
    const newPage = Math.floor(scrollPos / (genresPerPage * buttonWidth));
    if (newPage !== currentPage && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Genre buttons */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-none py-3 px-2 -mx-2 flex space-x-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={handleScroll}
        >
          {/* Style to hide webkit scrollbar */}
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          
          <Button
            variant={selectedGenreId === null ? "default" : "outline"}
            onClick={() => onSelectGenre(null)}
            className="whitespace-nowrap min-w-max"
          >
            All
          </Button>
          
          {genres.map((genre: any) => (
            <Button
              key={genre.id}
              variant={selectedGenreId === genre.id ? "default" : "outline"}
              onClick={() => onSelectGenre(genre.id)}
              className="whitespace-nowrap min-w-max"
            >
              {genre.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Dot Navigation - Force display on large screens */}
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button 
              key={index} 
              onClick={() => goToPage(index)} 
              className={`transition-all duration-300 ${
                index === currentPage 
                  ? "bg-primary w-8 h-2.5 rounded-full" 
                  : "bg-white/30 hover:bg-white/50 w-2.5 h-2.5 rounded-full"
              }`} 
              aria-label={`Go to page ${index + 1}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreFilter;
