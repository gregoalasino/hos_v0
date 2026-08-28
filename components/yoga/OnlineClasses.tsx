'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Ornament } from '@/components/landing/ornament';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';
import { usePageVisible } from '@/hooks/use-page-visible';

// ─── Online Yoga Classes ─────────────────────────────────────────────────────
// Sits between Special Activities and Meet Our Team, and carries one hard
// constraint: the only footage is a 608×1080 portrait. Given the container's
// full width it would stand 2560px tall on a desktop — three screens for one
// paragraph of copy. Two escapes were considered and rejected. Scaling it down
// and centring it turns the section into a banner. Cropping it to a letterbox
// buys a cinematic band, but this particular shot will not survive it: it is a
// symmetric architectural portrait — a vaulted wood ceiling, a chandelier of
// copper pendants, the doorway centred beneath them — and a 3:1 crop keeps
// about 16% of the frame, discarding the ceiling entirely while enlarging a
// 608px-wide source past 3× on a wide screen, where the softness shows.
//
// So the clip is never sized from the available width. It lives in a grid track
// whose width is a clamp, which pins its height between roughly 476px and
// 625px from 1024px to 1920px, where the section then measures about one
// viewport. Stacked on a phone it runs closer to two, which is the cost of
// reading order and is paid there rather than on the desktop composition. The plate spans both rows, so its height IS the row height, and
// the copy column stretches to meet it: heading pinned to the plate's top edge,
// CTA pinned to its bottom against a hairline, a continuous rule down the
// gutter. The air left in the middle is the composition, not a remainder.
//
// Mobile stacks in reading order — heading, then the clip as evidence, then the
// way in — which is why the copy is two grid items rather than one block.

const CLIP_SRC = '/videos/yoga-wellbeing/online-classes-video.mp4#t=0.1';

// One measure shared by the paragraph, the hairline and the small print, so all
// three land on the same right edge. Past xl the copy track grows to roughly a
// thousand pixels; letting the rule stretch with it would leave a hairline
// ruled across empty page. Bounded here, the surplus reads as margin instead.
const MEASURE = 'max-w-md xl:max-w-lg';

export function OnlineClasses() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const plateRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [onScreen, setOnScreen] = useState(false);
  const [frameReady, setFrameReady] = useState(false);

  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  // The element is server-rendered with opacity-0, so the browser starts
  // fetching the clip while parsing the HTML — long before React commits the
  // hydration of a 700-line page. Media events do not queue: if loadedmetadata
  // has already fired by then, the handlers below never see it and the clip
  // stays invisible for good. Seeding from readyState closes that window; the
  // handlers still cover the case where loading has not finished yet.
  useEffect(() => {
    const el = videoRef.current;
    if (el && el.readyState >= 1) setFrameReady(true);
  }, []);

  // A clip decoding off screen costs exactly what a watched one costs, and this
  // section sits deep in a long page most readers scroll straight past.
  useEffect(() => {
    const el = plateRef.current;
    if (!el) return;

    // Without an observer there is no way to know the plate is being looked at.
    // Give up the saving rather than leave the frame frozen forever.
    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Asserted rather than assumed: a clip that reaches play() unmuted is
    // refused outright by the autoplay policy.
    el.muted = true;

    // `reducedMotion === false`, not `!reducedMotion`: the hook reports null
    // until it has a viewport to read, and null must not be taken for a no.
    // Under a real reduce preference play() is never called at all, which
    // leaves the clip resting on the frame the media fragment seeks to — which
    // is exactly the image this section needs to show anyway.
    if (onScreen && pageVisible && reducedMotion === false) {
      // Autoplay can still be refused — a data saver, a low-power mode. Swallow
      // it: the seeked frame is already painted and simply stays.
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [onScreen, pageVisible, reducedMotion]);

  // There is no poster file and none can be produced, so the clip's own first
  // frame serves as one and is faded up to avoid an empty box snapping to
  // image. Bound to `loadedmetadata` as well as `loadeddata`: the former always
  // fires under preload="metadata", so the video can never be stranded at zero
  // opacity by a browser that declines to decode a frame up front.
  const markReady = () => setFrameReady(true);

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div
        ref={sectionRef}
        className="
          w-[90%] md:w-[80%] mx-auto
          grid grid-cols-1 gap-y-12
          lg:grid-cols-[clamp(268px,24vw,352px)_minmax(0,1fr)]
          lg:grid-rows-[auto_minmax(0,1fr)]
          lg:gap-x-12 xl:gap-x-16 lg:gap-y-0
        "
      >
        {/* ── Head — the invitation, level with the top of the plate ──── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="lg:col-start-2 lg:row-start-1 lg:border-l lg:border-ink/15 lg:pl-12 xl:pl-16"
        >
          {/* Both neighbouring sections open on an ornament; this one keeps the
              rhythm and takes the mark neither of them uses. */}
          <div className="w-fit">
            <Ornament
              src="/logos/snake-sun-rays.png"
              className="h-8 md:h-9 mx-auto mb-5 lg:mb-6"
            />
            <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]">
              Online Yoga Classes
            </h2>
          </div>

          <p className={`font-body text-sm text-ink leading-[1.7] mt-6 lg:mt-8 ${MEASURE}`}>
            Bring the practice home. Live online classes to move, breathe, and
            reconnect — wherever you are.
          </p>
        </motion.div>

        {/* ── Plate — the vertical clip ──────────────────────────────────
            Width comes from the grid track on desktop and is capped by hand
            below it. Left-aligned rather than centred while stacked, so the
            plate, the heading, the rule and the button all share one left edge
            — centred, it read as a slide pasted between two blocks of text. On
            a phone the cap is above the container width, so the clip goes flush
            to both margins at the one size where 9:16 is the native shape.
            `self-start` keeps the box at its own ratio instead of being
            stretched by the row it defines. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
          className="
            w-full max-w-[340px] lg:max-w-none
            lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-start
          "
        >
          {/* The source's exact ratio, not a nominal 9:16, so object-cover has
              nothing to trim: keeping the plate narrow is only worth doing if
              the framing survives whole. The observer sits on this static box
              rather than on the animated parent, so the entrance transform
              never enters the intersection maths. */}
          <div
            ref={plateRef}
            className="relative w-full aspect-[608/1080] overflow-hidden bg-ink/5"
          >
            <video
              ref={videoRef}
              // The #t=0.1 fragment makes the browser seek to that frame and
              // paint it while paused; without it Safari holds a black
              // rectangle until playback starts — which is most of the time,
              // since the clip only runs while it is on screen.
              src={CLIP_SRC}
              muted
              loop
              playsInline
              preload="metadata"
              // Decoration, not content: nothing to read, grab, or tab to, and
              // out of the accessibility tree. Everything this section means is
              // said in the text beside it.
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden
              tabIndex={-1}
              draggable={false}
              onLoadedMetadata={markReady}
              onLoadedData={markReady}
              className={`absolute inset-0 h-full w-full object-cover pointer-events-none select-none transition-opacity duration-700 ease-out ${
                frameReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </motion.div>

        {/* ── Foot — the way in, pinned to the plate's bottom edge ───────
            The item keeps its full row height so the gutter hairline runs
            unbroken; only its contents are pushed down. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.35 }}
          className="
            lg:col-start-2 lg:row-start-2
            lg:border-l lg:border-ink/15 lg:pl-12 xl:pl-16
            lg:flex lg:flex-col lg:justify-end
          "
        >
          <div className={`border-t border-ink/15 pt-8 lg:pt-10 ${MEASURE}`}>
            {/* The button comes first in the DOM so it precedes the small print
                on a phone. A plain anchor, not a router link: the target is
                this same page, `scroll-behavior: smooth` is already set
                globally, and the schedule section carries the scroll-mt that
                keeps its heading clear of the fixed navbar. */}
            <a
              href="#schedule"
              className="inline-block bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300"
            >
              Book an online class
            </a>

            <p className="font-body text-xs text-ink/70 leading-[1.7] mt-6">
              Online classes appear on the same weekly schedule as the ones
              held at the house, and are booked there.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}