'use client';

import { useRef } from 'react';

/**
 * Mouse drag-to-scroll for a horizontal track, extracted from the Featured
 * Experiences carousel so every strip on the site drags the same way — two
 * near-identical tracks where one drags and the other doesn't teaches the
 * reader that neither can be trusted.
 *
 * While dragging, scroll-snap and smooth behavior are suspended so the pull
 * is frictionless 1:1; on release both are restored and the track glides to
 * the nearest snap point. A click that follows a real drag is suppressed in
 * the capture phase, so cards that are links don't navigate on release.
 *
 * Touch is untouched: the browser's native panning already does all of this
 * better than synthetic handlers would.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>(
  ref: React.RefObject<T | null>,
) {
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.pageX;
    startScrollLeft.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto'; // direct 1:1 follow while dragging
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = ref.current;
    if (!el) return;
    const delta = e.pageX - startX.current;
    if (Math.abs(delta) > 5) dragMoved.current = true;
    el.scrollLeft = startScrollLeft.current - delta;
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const el = ref.current;
    if (!el) return;
    el.style.cursor = 'grab';
    el.style.scrollBehavior = 'smooth';
    el.style.scrollSnapType = 'x proximity';
  };

  // Suppress the click that would fire after a drag (prevents accidental nav).
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved.current = false;
    }
  };

  return {
    dragHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp: endDrag,
      onMouseLeave: endDrag,
      onClickCapture,
    },
  };
}
