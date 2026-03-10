"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Users, ChevronLeft, ChevronRight } from "lucide-react";

const rooms = [
  {
    id: "soul",
    name: "Soul Suite",
    size: "45 m²",
    capacity: 2,
    price: 299,
    description:
      "A sanctuary of stillness and light. The Soul Suite features floor-to-ceiling windows that frame the jungle canopy, a handcrafted king bed with organic linens, and a private terrace for morning meditation. The en-suite bathroom includes a rainfall shower surrounded by tropical plants.",
    images: [
      "/images/room-soul-1.jpg",
      "/images/room-soul-2.jpg",
      "/images/room-soul-3.jpg",
    ],
  },
  {
    id: "sea",
    name: "Sea Villa",
    size: "65 m²",
    capacity: 2,
    price: 449,
    description:
      "Where ocean whispers meet tropical breeze. The Sea Villa offers panoramic views of the coastline, a spacious living area with artisanal furnishings, and a private plunge pool. Wake to the rhythm of waves and fall asleep under a canopy of stars from your outdoor daybed.",
    images: [
      "/images/room-sea-1.jpg",
      "/images/room-sea-2.jpg",
      "/images/room-sea-3.jpg",
    ],
  },
  {
    id: "beach",
    name: "Beach House",
    size: "120 m²",
    capacity: 4,
    price: 799,
    description:
      "The ultimate expression of barefoot luxury. This two-bedroom residence features a full kitchen, expansive indoor-outdoor living spaces, and direct beach access. Perfect for families or groups seeking privacy and space while remaining connected to the sanctuary community.",
    images: [
      "/images/room-beach-1.jpg",
      "/images/room-soul-3.jpg",
      "/images/room-sea-2.jpg",
    ],
  },
];

function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-md group">
      <motion.img
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        src={images[currentIndex]}
        alt={`${name} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cream"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 text-dark" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cream"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 text-dark" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-cream w-6" : "bg-cream/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function AccommodationsPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-warm-white"
    >
      {/* Back Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-cream/90 hover:text-cream transition-colors bg-dark/50 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/accommodation-hero.jpg"
            alt="House of Shakti sanctuary overview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-6"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-cream/80 mb-4 block">
            Rest & Restore
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-cream text-balance">
            Boutique Accommodation
          </h1>
        </motion.div>
      </section>

      {/* Room Sections */}
      {rooms.map((room, index) => (
        <RoomSection key={room.id} room={room} index={index} />
      ))}

      {/* Footer CTA */}
      <section className="py-20 bg-dark text-cream text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-serif text-3xl md:text-4xl mb-6">
            Find your perfect sanctuary
          </h3>
          <p className="text-cream/70 mb-8">
            Each space has been thoughtfully designed for your comfort and renewal.
          </p>
          <Link
            href="/#book"
            className="inline-block bg-burgundy text-cream px-8 py-4 rounded-md text-sm tracking-wide uppercase hover:bg-burgundy-light transition-colors"
          >
            Check Availability
          </Link>
        </div>
      </section>
    </motion.main>
  );
}

function RoomSection({ room, index }: { room: typeof rooms[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      className={`py-24 lg:py-32 ${isEven ? "bg-cream" : "bg-warm-white"}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isEven ? "" : "lg:grid-flow-dense"}`}>
          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -40 : 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={isEven ? "" : "lg:col-start-2"}
          >
            <ImageCarousel images={room.images} name={room.name} />
          </motion.div>

          {/* Room Info */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 40 : -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 40 : -40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className={isEven ? "" : "lg:col-start-1 lg:row-start-1"}
          >
            <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">
              {room.size}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-dark mb-6">
              {room.name}
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-dark/60">
                <Users className="w-5 h-5" />
                <span>Up to {room.capacity} guests</span>
              </div>
            </div>

            <p className="text-dark/70 leading-relaxed mb-8">
              {room.description}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div>
                <span className="text-sm text-dark/50 block">Starting at</span>
                <span className="font-serif text-3xl text-dark">
                  ${room.price}
                  <span className="text-lg text-dark/60">/night</span>
                </span>
              </div>
              <button className="group flex items-center gap-2 border border-dark/30 text-dark px-6 py-3 rounded-md hover:bg-dark hover:text-cream transition-all">
                Book a Stay
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
