"use client";

import { motion, Variants } from "framer-motion"; // <-- Agregamos Variants aquí
import { Calendar, MapPin, Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Le asignamos el tipo :Variants a las animaciones para que TypeScript no tire error
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function ShaktiSadhanaRetreat() {
  return (
    <main className="bg-cream min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        {/* Placeholder para la imagen de fondo del retiro */}
        <div className="absolute inset-0 bg-dark/20 z-10" />
        <img
          src="/images/gallery-pool.jpg"
          alt="Shakti Sadhana Retreat"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-cream px-6 text-center">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="uppercase tracking-widest text-sm mb-4"
          >
            A Transformational Journey
          </motion.span>
          
          {/* AQUÍ ESTABA EL ERROR DE LA ETIQUETA, ya está corregido a </motion.h1> */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl mb-6"
          >
            Shakti Sadhana
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex items-center gap-6 text-sm md:text-base font-light tracking-wide"
          >
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> April 13 - 19, 2026</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Santa Teresa, Costa Rica</span>
          </motion.div>
        </div>
      </section>

      {/* The Concept */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="font-display text-3xl md:text-4xl text-dark mb-8">Return to the Source</h2>
          <p className="text-dark/80 text-lg leading-relaxed mb-6">
            Shakti Sadhana Retreat is an invitation to return to the source of your vital energy. A space of pause, listening, and conscious practice, where we cultivate a relationship with the body as sacred territory and with Shakti as the creative, intuitive, and transformative life force.
          </p>
          <p className="text-dark/80 text-lg leading-relaxed">
            Throughout the retreat, we immerse ourselves in sadhana as a living path: yoga, breathwork, meditation, ritual, free movement, and moments of silence, all held by nature and the collective field.
          </p>
        </motion.div>
      </section>

      {/* Meet the Host */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div className="aspect-[4/5] bg-cream rounded-xl overflow-hidden relative">
              <img src="/images/retreat-shakti.jpg" alt="Nancy Goodfellow" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <span className="uppercase tracking-widest text-sm text-dark/50 mb-4 block">Hosted By</span>
            <h2 className="font-display text-4xl text-dark mb-6">Nancy Goodfellow</h2>
            <p className="text-dark/70 mb-6 leading-relaxed">
              Nancy is a yoga teacher, facilitator, and space holder devoted to embodied practices that support presence, self-awareness, and inner transformation. Her work weaves together yoga, breath, meditation, and somatic exploration, creating experiences that invite a deep return to the body as a source of wisdom and truth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Included / Not Included Grid */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-16"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
        >
          {/* Included */}
          <motion.div variants={fadeInUp} className="bg-white p-10 rounded-2xl border border-dark/5">
            <h3 className="font-display text-2xl text-dark mb-8">What's Included</h3>
            <ul className="space-y-4">
              {["Accommodation", "Daily yoga practice", "Brunch included", "1 Breathwork Journey", "2 sauna & ice bath sessions", "1 boat tour", "1 Gentle Breath & Sound Healing", "1 Shakti Tantra Workshop"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-dark/70">
                  <Check className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not Included */}
          <motion.div variants={fadeInUp} className="bg-white p-10 rounded-2xl border border-dark/5">
            <h3 className="font-display text-2xl text-dark mb-8">Not Included</h3>
            <ul className="space-y-4">
              {["International Flights & Transfers", "Travel Insurance (Strongly recommended)", "Tourist Visa", "Dinner (Guests can cook or explore Santa Teresa)"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-dark/70">
                  <X className="w-5 h-5 text-red-900/50 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* Schedule Preview & Pricing */}
      <section className="py-24 bg-dark text-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="font-display text-4xl mb-6">Join the Journey</h2>
            <p className="text-cream/70 mb-12">7 Days of deep immersion in the Costa Rican jungle.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
              <div className="bg-cream/10 p-8 rounded-xl backdrop-blur-sm">
                <span className="uppercase tracking-widest text-xs text-cream/50 mb-2 block">March Booking</span>
                <div className="font-display text-3xl mb-2">$1,414 <span className="text-sm font-body text-cream/70">/ person</span></div>
                <p className="text-sm text-cream/70">Special rate: $1,305/person for 2 people.</p>
              </div>
              <div className="bg-cream/10 p-8 rounded-xl backdrop-blur-sm">
                <span className="uppercase tracking-widest text-xs text-cream/50 mb-2 block">April Booking</span>
                <div className="font-display text-3xl mb-2">$1,625 <span className="text-sm font-body text-cream/70">/ person</span></div>
                <p className="text-sm text-cream/70">Standard individual rate.</p>
              </div>
            </div>

            <button className="bg-cream text-dark px-8 py-4 rounded-md text-sm tracking-wide uppercase hover:bg-white transition-colors inline-flex items-center gap-2">
              Apply for this Retreat <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}