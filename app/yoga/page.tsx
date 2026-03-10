"use client";

import React, { useRef } from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Users } from "lucide-react";

const schedule = [
  { day: "Monday", time: "6:30 AM", class: "Sunrise Vinyasa", instructor: "Maya", spots: 8 },
  { day: "Monday", time: "9:00 AM", class: "Gentle Flow", instructor: "Sara", spots: 12 },
  { day: "Tuesday", time: "6:30 AM", class: "Ashtanga Primary", instructor: "Ravi", spots: 6 },
  { day: "Tuesday", time: "9:00 AM", class: "Yin Yoga", instructor: "Maya", spots: 10 },
  { day: "Wednesday", time: "6:30 AM", class: "Sunrise Vinyasa", instructor: "Sara", spots: 8 },
  { day: "Wednesday", time: "9:00 AM", class: "Hatha Foundations", instructor: "Ravi", spots: 12 },
  { day: "Thursday", time: "6:30 AM", class: "Power Flow", instructor: "Maya", spots: 8 },
  { day: "Thursday", time: "9:00 AM", class: "Restorative", instructor: "Sara", spots: 10 },
  { day: "Friday", time: "6:30 AM", class: "Sunrise Vinyasa", instructor: "Ravi", spots: 8 },
  { day: "Friday", time: "9:00 AM", class: "Breath & Movement", instructor: "Maya", spots: 12 },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["6:30 AM", "9:00 AM"]; // Extraemos los horarios para armar las filas

const galleryImages = [
  { src: "/images/yoga-studio-1.jpeg", alt: "Peaceful yoga studio with natural light" },
  { src: "/images/yoga-studio-2.jpeg", alt: "Morning meditation practice" },
  { src: "/images/yoga-studio-3.JPG", alt: "Group yoga session at sunset" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function YogaPage() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const scheduleRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true, margin: "-100px" });
  const scheduleInView = useInView(scheduleRef, { once: true, margin: "-100px" });

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
          className="flex items-center gap-2 text-sm text-dark/70 hover:text-dark transition-colors bg-cream/90 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/yoga-hero.jpeg"
            alt="Yoga studio atmosphere"
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
            The Practice
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-cream text-balance">
            Yoga Classes
          </h1>
        </motion.div>
      </section>

      {/* Content Section - Split Layout */}
      <section ref={contentRef} className="py-24 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-6 block">
                Serenity & Practice
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-dark mb-8 leading-tight">
                Where breath becomes movement, and movement becomes meditation
              </h2>
              <div className="space-y-6 text-dark/70 leading-relaxed">
                <p>
                  At House of Shakti, yoga is not merely exercise—it is a sacred dialogue 
                  between body, mind, and spirit. Our intimate classes, held in our 
                  open-air shala overlooking the jungle canopy, create a space where 
                  transformation unfolds naturally.
                </p>
                <p>
                  Each session is thoughtfully crafted by our resident teachers, who 
                  bring decades of study and devotion to their practice. From the 
                  energizing flow of sunrise vinyasa to the deep stillness of evening 
                  yin, every class invites you to return to yourself.
                </p>
                <p className="font-serif text-lg text-dark/60 italic">
                  "The body is your temple. Keep it pure and clean for the soul to reside in."
                </p>
              </div>
            </motion.div>

            {/* Gallery Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={contentInView ? "visible" : "hidden"}
              className="grid grid-cols-2 gap-4"
            >
              <motion.div variants={itemVariants} className="col-span-2">
                <div className="aspect-[16/9] overflow-hidden rounded-md">
                  <img
                    src={galleryImages[0].src}
                    alt={galleryImages[0].alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="aspect-square overflow-hidden rounded-md">
                  <img
                    src={galleryImages[1].src}
                    alt={galleryImages[1].alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="aspect-square overflow-hidden rounded-md">
                  <img
                    src={galleryImages[2].src}
                    alt={galleryImages[2].alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Schedule Section - NUEVO CALENDARIO SEMANAL */}
      <section ref={scheduleRef} className="py-24 lg:py-32 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={scheduleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">
              Weekly Schedule
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-dark mb-4">
              Morning Classes
            </h2>
            <p className="text-dark/60">
              All classes are <span className="text-burgundy font-medium">$25 USD</span> per session
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={scheduleInView ? "visible" : "hidden"}
            className="w-full"
          >
            {/* Aviso de scroll para móviles */}
            <div className="lg:hidden text-center text-xs tracking-wider uppercase text-dark/40 mb-6 animate-pulse">
              ← Swipe to see full week →
            </div>

            {/* Contenedor con Scroll Horizontal */}
            <div className="overflow-x-auto pb-8 hide-scrollbar">
              <div className="min-w-[1000px] max-w-6xl mx-auto w-full grid grid-cols-[120px_repeat(5,1fr)] gap-4 lg:gap-6">
                
                {/* Cabecera: Días de la semana */}
                <div className="col-span-1"></div> {/* Espacio vacío arriba de los horarios */}
                {days.map((day) => (
                  <div key={day} className="text-center font-serif text-2xl text-dark border-b border-dark/10 pb-4">
                    {day}
                  </div>
                ))}

                {/* Filas: Horarios y Clases */}
                {times.map((time) => (
                  <React.Fragment key={time}>
                    
                    {/* Columna de Horario */}
                    <div className="col-span-1 flex items-center justify-end pr-6 border-r border-dark/10 mt-4">
                      <span className="font-medium text-dark/60 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {time}
                      </span>
                    </div>

                    {/* Columnas de Clases */}
                    {days.map((day) => {
                      const classItem = schedule.find(s => s.day === day && s.time === time);
                      
                      return (
                        <div key={`${day}-${time}`} className="mt-4">
                          {classItem ? (
                            <motion.div 
                              variants={itemVariants}
                              className="bg-cream rounded-2xl p-5 border border-dark/5 hover:border-dark/10 hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                            >
                              <h4 className="font-serif text-lg text-dark mb-1 group-hover:text-burgundy transition-colors">
                                {classItem.class}
                              </h4>
                              <p className="text-sm text-dark/60 mb-6">
                                with {classItem.instructor}
                              </p>
                              
                              <div className="mt-auto flex items-center justify-between border-t border-dark/5 pt-4">
                                <span className="text-xs font-medium text-dark/50 flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5" /> {classItem.spots}
                                </span>
                                <button className="bg-dark text-cream px-4 py-2 rounded-full text-xs tracking-wide hover:bg-burgundy transition-colors shadow-md">
                                  Book
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="h-full rounded-2xl border border-dashed border-dark/10 flex items-center justify-center">
                              <span className="text-xs text-dark/30 italic">No class</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-dark text-cream text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-serif text-3xl md:text-4xl mb-6">
            Ready to begin your practice?
          </h3>
          <p className="text-cream/70 mb-8">
            Join us on the mat and discover the transformative power of mindful movement.
          </p>
          <Link
            href="/#book"
            className="inline-block bg-burgundy text-cream px-8 py-4 rounded-md text-sm tracking-wide uppercase hover:bg-burgundy-light transition-colors"
          >
            Book Your Stay
          </Link>
        </div>
      </section>
    </motion.main>
  );
}