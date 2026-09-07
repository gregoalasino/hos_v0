'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Retreat } from '@/lib/retreats';

// Video moment. When videoDesktop / videoMobile aren't provided, the poster
// image alone is shown (no broken sources, no error icon).
export function RetreatJourney({ retreat }: { retreat: Retreat }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const hasVideo = !!(retreat.videoDesktop || retreat.videoMobile);

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        {/* Header block — heading + body. Eyebrow intentionally omitted for
            cleaner editorial framing of the video moment. */}
        <div ref={ref} className="max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl lg:text-5xl leading-tight"
          >
            {retreat.journeyHeading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
            className="font-body text-sm text-ink leading-relaxed max-w-2xl mt-8"
          >
            {retreat.journeyBody}
          </motion.p>
        </div>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="relative overflow-hidden mt-16 lg:mt-20 aspect-[9/16] lg:aspect-video"
        >
          {hasVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={retreat.videoPoster}
              controls={false}
              className="w-full h-full object-cover"
            >
              {retreat.videoDesktop && (
                <source src={retreat.videoDesktop} media="(min-width: 1024px)" type="video/mp4" />
              )}
              {retreat.videoMobile && (
                <source src={retreat.videoMobile} type="video/mp4" />
              )}
            </video>
          ) : (
            // TODO: video files pending — using poster image as placeholder
            <img
              src={retreat.videoPoster}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
