'use client';

import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query.
 *
 * Returns `null` until the component has mounted, because the server has no
 * viewport to measure. Callers should treat `null` as "not decided yet" and
 * render something breakpoint-agnostic — guessing a value here would render
 * one branch on the server and swap it on hydration.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * True when the visitor has asked their OS to minimise animation. Ambient,
 * self-starting motion — a photo row that swaps frames on a timer, a looping
 * background clip — is exactly what that setting is meant to stop, so anything
 * running on its own should hold still instead.
 */
export function usePrefersReducedMotion(): boolean | null {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
