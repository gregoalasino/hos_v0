"use client";

import { motion, Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

// Estructura de datos para las fotos (apuntando a tu carpeta public/images)
const gallerySections = [
  {
    id: "sanctuary",
    title: "The Sanctuary",
    description: "Our carefully designed spaces blending luxury with deep tranquility.",
    images: [
      "/images/sanctuary/p1.jpg",
      "/images/sanctuary/p2.jpg",
      "/images/sanctuary/p3.jpg",
      "/images/sanctuary/p4.jpg",
    ],
  },
  {
    id: "beach",
    title: "The Beach",
    description: "Just steps away from the healing waters of Santa Teresa.",
    images: [
      "/images/gallery-beach.jpg",
      "/images/retreat-puravida.jpg",
      "/images/gallery-meditation.png",
      "/images/gallery-garden.jpg",
    ],
  },
  {
    id: "nature",
    title: "Accommodations",
    description: "Immerse yourself in our luxury place.",
    images: [
      "/images/accommodation-hero.jpg",
      "/images/room-soul-2.jpg",
      "/images/room-sea-3.jpg",
      "/images/sauna.jpg",
    ],
  },
];

const fadeInUp: Variants= {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function GalleryPage() {
  // Función para manejar el scroll horizontal con botones
  const scroll = (id: string, direction: "left" | "right") => {
    const container = document.getElementById(`carousel-${id}`);
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <main className="bg-cream min-h-screen pt-32 pb-24">
        <div className="fixed top-6 left-6 z-50 md:top-10 md:left-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-dark/70 hover:text-dark transition-colors bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-dark/5 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      {/* Hero de la Galería */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="uppercase tracking-widest text-sm text-dark/50 mb-4 block"
        >
          Visual Journey
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl text-dark"
        >
          What your eyes will see
        </motion.h1>
      </div>

      {/* Secciones de Carruseles */}
      <div className="space-y-32">
        {gallerySections.map((section, index) => (
          <motion.section
            key={section.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="w-full"
          >
            {/* Cabecera de cada sección */}
            <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-dark mb-2">
                  {section.title}
                </h2>
                <p className="text-dark/70">{section.description}</p>
              </div>
              
              {/* Controles del carrusel */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => scroll(section.id, "left")}
                  className="p-3 rounded-full border border-dark/20 hover:bg-dark hover:text-cream transition-colors"
                  aria-label="Scroll left"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll(section.id, "right")}
                  className="p-3 rounded-full border border-dark/20 hover:bg-dark hover:text-cream transition-colors"
                  aria-label="Scroll right"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenedor del Carrusel (Scroll Horizontal) */}
            <div
              id={`carousel-${section.id}`}
              className="flex overflow-x-auto gap-6 px-6 pb-8 snap-x snap-mandatory hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* Margen inicial para alinear con el contenedor max-w-7xl */}
              <div className="min-w-[calc((100vw-80rem)/2)] shrink-0 hidden xl:block" />

              {section.images.map((img, i) => (
                <div
                    key={i}
                    className="relative w-[75vw] sm:w-[350px] md:w-[400px] aspect-[4/3] shrink-0 snap-center rounded-xl overflow-hidden"
                >
                  {/* Imagen (Asegúrate de tener estas imágenes en public/images) */}
                  <img
                    src={img}
                    alt={`${section.title} - Image ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-dark/10 hover:bg-transparent transition-colors duration-500" />
                </div>
              ))}
              
              {/* Margen final */}
              <div className="min-w-[6rem] shrink-0" />
            </div>
          </motion.section>
        ))}
      </div>
    </main>
  );
}