'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Retreat, RetreatGalleryImage } from '@/lib/retreats';

function GalleryItem({ image }: { image: RetreatGalleryImage }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="mb-6 lg:mb-8 break-inside-avoid"
    >
      <div className={`relative w-full ${image.aspect}`}>
        <img src={image.src} alt={image.alt} className="w-full h-full object-cover"
  loading="lazy"
  decoding="async"
/>
      </div>
    </motion.div>
  );
}

export function RetreatGallery({ retreat }: { retreat: Retreat }) {
  const t = useTranslations('retreatLanding.gallery');
  return (
    <section
      aria-label={t('aria')}
      className="bg-warm-white py-20 lg:py-28"
    >
      <div className="w-[90%] md:w-[80%] mx-auto">
        <div className="columns-1 lg:columns-3 gap-6 lg:gap-8">
          {retreat.galleryImages.map((image, i) => (
            <GalleryItem key={`${image.src}-${i}`} image={image} />
          ))}
        </div>
      </div>
    </section>
  );
}
