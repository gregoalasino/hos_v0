"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Editorial masonry gallery — the closing exhale of the home page.
 * No heading, no eyebrow, no CTA. Just nine curated images.
 *
 * Layout: CSS multi-column (`columns-1 lg:columns-3`) for true masonry.
 * Each item is wrapped in `break-inside-avoid` so no image gets split
 * across columns.
 */

type GalleryImage = {
  src: string;
  aspect: string;
  alt: string;
};

const galleryImages: GalleryImage[] = [
  {
    src: "/images/yoga/IMG_7494%201.webp",
    aspect: "aspect-[4/5]",
    alt: "A solitary yoga practice in soft morning light",
  },
  {
    src: "/images/sanctuary/271A0686_websize%201.webp",
    aspect: "aspect-[3/4]",
    alt: "Vertical detail of sanctuary architecture",
  },
  {
    src: "/images/sanctuary/271A0704_websize%201.webp",
    aspect: "aspect-[4/3]",
    alt: "Landscape detail of the sanctuary grounds",
  },
  {
    src: "/images/sanctuary/271A0785_websize%201.webp",
    aspect: "aspect-[3/4]",
    alt: "An empty corner of the sanctuary at rest",
  },
  {
    src: "/images/yoga/IMG_8669%201.webp",
    aspect: "aspect-[4/5]",
    alt: "A wider moment of practice in the open-air shala",
  },
  {
    src: "/images/sanctuary/271A0870_websize%201.webp",
    aspect: "aspect-[4/5]",
    alt: "Organic texture of the surrounding jungle",
  },
  {
    src: "/images/contrast_therapy/IMG_7498%201.webp",
    aspect: "aspect-[1/1]",
    alt: "Detail of the contrast therapy ritual",
  },
  {
    src: "/images/sanctuary/271A0800_websize%201.webp",
    aspect: "aspect-[3/4]",
    alt: "Interior of a sanctuary room",
  },
  {
    src: "/images/sanctuary/271A0883_websize%201.webp",
    aspect: "aspect-[4/3]",
    alt: "A wide view of the land at golden hour",
  },
];

function GalleryItem({ src, alt, aspect }: GalleryImage) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="mb-6 lg:mb-8 break-inside-avoid"
    >
      <div className={`relative w-full ${aspect}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}

export function Gallery() {
  return (
    <section
      aria-label="Gallery"
      className="bg-warm-white py-20 lg:py-28"
    >
      <div className="w-[90%] md:w-[80%] mx-auto">
        <div className="columns-1 lg:columns-3 gap-6 lg:gap-8">
          {galleryImages.map((img, i) => (
            <GalleryItem
              key={i}
              src={img.src}
              alt={img.alt}
              aspect={img.aspect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
