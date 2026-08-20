'use client';

import { useEffect, useState } from 'react';

/**
 * Whether the page is currently being shown, via the Page Visibility API.
 *
 * Being inside the viewport is not the same as being looked at: a section can
 * sit dead centre of a tab the reader switched away from ten minutes ago. That
 * distinction matters for anything on a timer. A browser suspends rendering for
 * a hidden page — image decoding stops and animation frames stop — so work that
 * keeps running there burns data and CPU for nobody, and any exit animation
 * waiting on a frame simply never finishes, leaving its nodes mounted.
 *
 * Pair it with an in-viewport check: in view *and* visible.
 */
export function usePageVisible(): boolean {
  // Assume visible: the server can't know, and starting from `false` would
  // stall anything gated on this until the first event that may never come.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setVisible(document.visibilityState === 'visible');
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return visible;
}
