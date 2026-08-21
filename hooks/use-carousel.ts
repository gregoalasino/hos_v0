'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drives a horizontally scrolling track: where its edges are, and stepping it
 * one item at a time.
 *
 * The track stays a plain scroll container, so dragging, swiping and the
 * keyboard all keep working on their own. This only adds a second way in.
 */
export function useCarousel<T extends HTMLElement = HTMLDivElement>() {
  const trackRef = useRef<T | null>(null);
  // The pending fallback-jump timer (see step). Held in a ref so a content
  // reset can cancel it — a stale timer firing after the track was rebuilt
  // would fling the new content a step in.
  const fallbackTimer = useRef<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    // Also true when there is nothing to scroll, which is what lets a caller
    // hide both arrows rather than leave a pair of dead controls on screen.
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncEdges();
    el.addEventListener('scroll', syncEdges, { passive: true });
    // Item widths are viewport-relative, so the ends move when the window does.
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', syncEdges);
      observer.disconnect();
    };
  }, [syncEdges]);

  /**
   * Moves by one item plus the gap that follows it, measured live rather than
   * hard-coded — item widths are viewport units and gaps change at breakpoints.
   */
  const step = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0;
    const distance = first ? first.getBoundingClientRect().width + gap : el.clientWidth * 0.8;

    const before = el.scrollLeft;
    if (fallbackTimer.current !== null) window.clearTimeout(fallbackTimer.current);
    el.scrollBy({ left: direction * distance, behavior: 'smooth' });

    // Some environments drop a smooth scroll instead of falling back to a jump,
    // which would leave the arrow doing nothing at all. If the track genuinely
    // hasn't moved by now, move it outright. A scroll already under way will
    // have travelled some distance, so this can't interrupt one.
    //
    // It has to be an explicit 'instant': these tracks carry `scroll-smooth`,
    // and both assigning scrollLeft and passing 'auto' defer to that CSS
    // property — which is the very thing that just failed.
    fallbackTimer.current = window.setTimeout(() => {
      fallbackTimer.current = null;
      if (Math.abs(el.scrollLeft - before) < 2) {
        el.scrollTo({
          left: before + direction * distance,
          behavior: 'instant' as ScrollBehavior,
        });
      }
    }, 250);
  }, []);

  /**
   * Walks the track back to its start and re-measures the edges — for callers
   * that swap the track's content in place (a group toggle). Cancels any
   * pending fallback jump first: that timer belongs to content that no longer
   * exists, and a reset back to the recorded start position is exactly the
   * "scroll was dropped" signature it fires on.
   */
  const resetToStart = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    if (fallbackTimer.current !== null) {
      window.clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
    el.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior });
    syncEdges();
  }, [syncEdges]);

  return { trackRef, atStart, atEnd, step, resetToStart, hasOverflow: !(atStart && atEnd) };
}
