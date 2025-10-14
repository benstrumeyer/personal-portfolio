import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook to detect media query matches
 * Useful for responsive design and conditional rendering
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoint queries for common screen sizes
 */
export const breakpoints = {
  mobile: '(max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const;

/**
 * Hook to get current breakpoint
 * Returns the current breakpoint name or 'desktop' as fallback
 */
export function useBreakpoint(): keyof typeof breakpoints {
  const isMobile = useMediaQuery(breakpoints.mobile);
  const isDesktop = useMediaQuery(breakpoints.desktop);

  if (isMobile) {
    return 'mobile';
  }
  if (isDesktop) {
    return 'desktop';
  }

  // Default to desktop for larger screens or fallback
  return 'desktop';
}

/**
 * Hook to get responsive configuration based on current breakpoint
 */
export function useResponsiveConfig() {
  const breakpoint = useBreakpoint();
  
  
  // Memoize the config to prevent infinite loops
  const config = useMemo(() => ({
    mobile: {
      sunVisibleStart: 0.0,
      sunVisibleEnd: 0.4, // Sun comes in sooner on mobile
      moonVisibleStart: 0.4,
      moonVisibleEnd: 0.8, // Moon comes in sooner on mobile
      sunBaseSize: 60,
      moonBaseSize: 78, // 1.3x of sun
    },
    desktop: {
      sunVisibleStart: 0.0,
      sunVisibleEnd: 0.5,
      moonVisibleStart: 0.5,
      moonVisibleEnd: 1.0,
      sunBaseSize: 40, // Half size desktop sun
      moonBaseSize: 45, // Half size desktop moon
    },
  }), []);

  return config[breakpoint];
}
