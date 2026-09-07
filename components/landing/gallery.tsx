"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useMessages, useTranslations } from "next-intl";

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

// The nine, in order. Their alt texts live in the catalogue under
// home.gallery.alts, in the same order.
const galleryImages: Omit<GalleryImage, "alt">[] = [
  { src: "/images/yoga/IMG_7494%201.webp", aspect: "aspect-[4/5]" },
  { src: "/images/sanctuary/271A0686_websize%201.webp", aspect: "aspect-[3/4]" },
  { src: "/images/sanctuary/271A0704_websize%201.webp", aspect: "aspect-[4/3]" },
  { src: "/images/sanctuary/271A0785_websize%201.webp", aspect: "aspect-[3/4]" },
  { src: "/images/yoga/IMG_8669%201.webp", aspect: "aspect-[4/5]" },
  { src: "/images/sanctuary/271A0870_websize%201.webp", aspect: "aspect-[4/5]" },
  { src: "/images/contrast_therapy/IMG_7498%201.webp", aspect: "aspect-[1/1]" },
  { src: "/images/sanctuary/271A0800_websize%201.webp", aspect: "aspect-[3/4]" },
  { src: "/images/sanctuary/271A0883_websize%201.webp", aspect: "aspect-[4/3]" },
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
  const t = useTranslations("home.gallery");
  const alts = useMessages().home.gallery.alts;
  return (
    <section
      aria-label={t("aria")}
      className="bg-warm-white py-20 lg:py-28"
    >
      <div className="w-[90%] md:w-[80%] mx-auto">
        <div className="columns-1 lg:columns-3 gap-6 lg:gap-8">
          {galleryImages.map((img, i) => (
            <GalleryItem
              key={i}
              src={img.src}
              alt={alts[i] ?? ""}
              aspect={img.aspect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
