
import { useState, useEffect } from 'react';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: Record<BreakpointKey, number> = {
  xs: 0,
  sm: 640,
  md: 768, 
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Only set up listeners on the client
    if (typeof window === 'undefined') return;

    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Boolean helpers for common breakpoints
  const isXs = windowSize.width < breakpoints.sm;
  const isSm = windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.md;
  const isMd = windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg;
  const isLg = windowSize.width >= breakpoints.lg && windowSize.width < breakpoints.xl;
  const isXl = windowSize.width >= breakpoints.xl && windowSize.width < breakpoints['2xl'];
  const is2xl = windowSize.width >= breakpoints['2xl'];

  // Comparison helpers
  const isSmUp = windowSize.width >= breakpoints.sm;
  const isMdUp = windowSize.width >= breakpoints.md;
  const isLgUp = windowSize.width >= breakpoints.lg;
  const isXlUp = windowSize.width >= breakpoints.xl;
  const is2xlUp = windowSize.width >= breakpoints['2xl'];

  const isSmDown = windowSize.width < breakpoints.md;
  const isMdDown = windowSize.width < breakpoints.lg;
  const isLgDown = windowSize.width < breakpoints.xl;
  const isXlDown = windowSize.width < breakpoints['2xl'];

  // Check if current width matches a breakpoint
  const up = (key: BreakpointKey) => windowSize.width >= breakpoints[key];
  const down = (key: BreakpointKey) => windowSize.width < breakpoints[key];
  const between = (start: BreakpointKey, end: BreakpointKey) => 
    windowSize.width >= breakpoints[start] && windowSize.width < breakpoints[end];
  const only = (key: BreakpointKey) => {
    const keys = Object.keys(breakpoints) as BreakpointKey[];
    const currentIndex = keys.indexOf(key);
    const nextKey = keys[currentIndex + 1];
    
    return nextKey
      ? between(key, nextKey)
      : windowSize.width >= breakpoints[key];
  };

  return {
    width: windowSize.width,
    height: windowSize.height,
    breakpoints,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isSmUp,
    isMdUp,
    isLgUp,
    isXlUp,
    is2xlUp,
    isSmDown,
    isMdDown,
    isLgDown,
    isXlDown,
    up,
    down,
    between,
    only,
  };
}

export default useResponsive;
