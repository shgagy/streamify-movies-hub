
import { useRef, useState, useEffect, useCallback } from "react";
import useResponsive from "./useResponsive";

interface UseContentSliderProps {
  totalItems: number;
  layout: "poster" | "backdrop";
  itemsPerPage?: number;
}

export function useContentSlider({ totalItems, layout }: UseContentSliderProps) {
  const { isMdUp, width } = useResponsive();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(1);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate how many items to show at once based on layout and screen size
  const itemsPerPage = isMdUp 
    ? (layout === "poster" ? 5 : 3) 
    : (layout === "poster" ? 3 : 1);

  // Scroll to a specific slide by index
  const scrollToSlide = useCallback((index: number) => {
    if (!sliderRef.current) return;
    
    // Ensure index is within bounds - for wide screens, we need to limit the maximum index
    // to prevent scrolling beyond content boundaries
    const maxSafeIndex = isMdUp 
      ? Math.max(0, Math.min(index, totalSlides - 2)) 
      : Math.max(0, Math.min(index, totalSlides - 1));
    
    setActiveIndex(maxSafeIndex);
    
    // Calculate the element width including gap
    const itemElement = sliderRef.current.querySelector('.flex-none');
    if (!itemElement) return;
    
    const itemWidth = itemElement.clientWidth;
    const gapWidth = 16; // Our fixed gap between items
    
    // Calculate scroll position based on index
    const scrollPos = maxSafeIndex * (itemWidth + gapWidth) * itemsPerPage;
    
    // Perform the smooth scroll
    sliderRef.current.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
  }, [itemsPerPage, totalSlides, isMdUp]);

  // Calculate the total number of slides
  const calculateTotalSlides = useCallback(() => {
    if (!sliderRef.current) return 1;
    
    if (totalItems === 0) return 1;
    
    // Calculate total slides based on items per page
    const slides = Math.ceil(totalItems / itemsPerPage);
    return Math.max(slides, 1);
  }, [totalItems, itemsPerPage]);

  // Update navigation button visibility based on scroll position
  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    // Show left button only if we're not at the start
    setShowLeftButton(scrollLeft > 5);
    
    // Show right button only if we're not at the end
    setShowRightButton(scrollLeft + clientWidth < scrollWidth - 5);
    
    // Clear any pending scroll detection
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    // Detect when scrolling stops
    scrollTimerRef.current = setTimeout(() => {
      if (!sliderRef.current) return;
      
      const itemWidth = sliderRef.current.querySelector('.flex-none')?.clientWidth || 0;
      const gapWidth = 16;
      const slideWidth = (itemWidth + gapWidth) * itemsPerPage;
      
      if (slideWidth > 0) {
        const newIndex = Math.round(scrollLeft / slideWidth);
        if (newIndex !== activeIndex && newIndex < totalSlides) {
          setActiveIndex(newIndex);
        }
      }
    }, 100);
  }, [activeIndex, itemsPerPage, totalSlides]);

  // Calculate visible dots based on screen size
  // For desktop: Show only enough dots for navigation, excluding the last slide position
  // For mobile: Show all dots for precise navigation
  const getVisibleDots = useCallback(() => {
    if (isMdUp) {
      // Desktop: Don't show the last dot to avoid lag issues
      return Math.max(0, totalSlides - 1);
    } else {
      // Mobile: Show all dots
      return totalSlides;
    }
  }, [isMdUp, totalSlides]);

  // Calculate total slides and handle component resize
  useEffect(() => {
    if (!sliderRef.current) return;
    
    const handleResize = () => {
      // Calculate total slides
      const slides = calculateTotalSlides();
      setTotalSlides(slides);
      
      // Reset to the first slide when resizing to avoid out-of-bounds issues
      setActiveIndex(prev => (prev >= slides ? 0 : prev));
      
      // Update navigation state
      handleScroll();
    };
    
    // Initial setup
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateTotalSlides, handleScroll, totalItems, itemsPerPage]);

  return {
    sliderRef,
    activeIndex,
    totalSlides,
    showLeftButton,
    showRightButton,
    scrollToSlide,
    handleScroll,
    getVisibleDots,
    itemsPerPage,
  };
}
