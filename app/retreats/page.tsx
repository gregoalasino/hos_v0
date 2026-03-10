"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const retreats = [
  {
    id: "shakti-sadhana",
    name: "Shakti Sadhana",
    duration: "7 Days",
    price: 2499,
    description:
      "A deep dive into the feminine divine. This week-long immersion combines daily yoga practice, Tantric philosophy, sacred ceremony, and transformative bodywork. Guided by our senior teachers, you'll explore the awakening of Shakti energy through movement, breath, and meditation.",
    highlights: ["Daily 2-hour yoga practice", "Tantric philosophy sessions", "Sacred fire ceremony", "Sound healing journey", "Private integration session"],
    image: "/images/retreat-shakti.jpg",
    dates: ["Mar 15-22", "May 10-17", "Jul 5-12"],
  },
  {
    id: "within",
    name: "Within",
    duration: "5 Days",
    price: 1899,
    description:
      "A silent retreat for those seeking profound inner stillness. Step away from the noise of daily life and journey inward through meditation, gentle yoga, and contemplative practices. Nourishing plant-based meals and optional journaling sessions support your process.",
    highlights: ["Noble silence throughout", "Guided meditation sessions", "Gentle morning yoga", "Walking meditation in nature", "One-on-one guidance available"],
    image: "/images/retreat-within.jpg",
    dates: ["Apr 1-6", "Jun 12-17", "Aug 20-25"],
  },
  {
    id: "pura-vida",
    name: "Pura Vida",
    duration: "4 Days",
    price: 1499,
    description:
      "Celebrate the pure life through movement, adventure, and connection. This dynamic retreat blends yoga with surf lessons, jungle hikes, and beach bonfire gatherings. Perfect for those who want to balance inner work with the joy of play.",
    highlights: ["Surf lessons included", "Jungle waterfall hike", "Beach yoga sessions", "Community dinners", "Optional massage treatments"],
    image: "/images/retreat-puravida.jpg",
    dates: ["Mar 28-31", "Apr 18-21", "May 23-26"],
  },
];

const calendarMonths = [
  {
    name: "March 2026",
    events: [
      { date: "15-22", retreat: "Shakti Sadhana", color: "burgundy" },
      { date: "28-31", retreat: "Pura Vida", color: "dark" },
    ],
  },
  {
    name: "April 2026",
    events: [
      { date: "1-6", retreat: "Within", color: "burgundy" },
      { date: "18-21", retreat: "Pura Vida", color: "dark" },
    ],
  },
  {
    name: "May 2026",
    events: [
      { date: "10-17", retreat: "Shakti Sadhana", color: "burgundy" },
      { date: "23-26", retreat: "Pura Vida", color: "dark" },
    ],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
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

export default function RetreatsPage() {
  const heroRef = useRef(null);
  const calendarRef = useRef(null);
  const retreatsRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const calendarInView = useInView(calendarRef, { once: true, margin: "-100px" });
  const retreatsInView = useInView(retreatsRef, { once: true, margin: "-100px" });
  const [currentMonth, setCurrentMonth] = useState(0);

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? calendarMonths.length - 1 : prev - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => (prev === calendarMonths.length - 1 ? 0 : prev + 1));
  };

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
            src="/images/retreat-hero.jpg"
            alt="Group meditation at sunrise"
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
            Transform & Evolve
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-cream text-balance">
            Transformational Retreats
          </h1>
        </motion.div>
      </section>

      {/* Calendar Section */}
      <section ref={calendarRef} className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={calendarInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">
              Upcoming Dates
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-dark">
              Retreat Calendar
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={calendarInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="bg-warm-white rounded-lg p-8 lg:p-12"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={goToPreviousMonth}
                className="w-10 h-10 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-cream transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-serif text-2xl md:text-3xl text-dark">
                {calendarMonths[currentMonth].name}
              </h3>
              <button
                onClick={goToNextMonth}
                className="w-10 h-10 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-cream transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Events */}
            <div className="space-y-4">
              {calendarMonths[currentMonth].events.map((event, index) => (
                <motion.div
                  key={`${event.retreat}-${event.date}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 lg:p-6 rounded-md bg-cream"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${event.color === "burgundy" ? "bg-burgundy" : "bg-dark"}`} />
                    <div>
                      <span className="block font-serif text-lg lg:text-xl text-dark">
                        {event.retreat}
                      </span>
                      <span className="text-sm text-dark/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                    </div>
                  </div>
                  <button className="text-sm text-burgundy hover:text-burgundy-dark transition-colors">
                    Learn More
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Retreat Cards Section */}
      <section ref={retreatsRef} className="py-24 lg:py-32 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={retreatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">
              Our Journeys
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-dark">
              Choose Your Path
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={retreatsInView ? "visible" : "hidden"}
            className="space-y-16 lg:space-y-24"
          >
            {retreats.map((retreat, index) => (
              <motion.div
                key={retreat.id}
                variants={itemVariants}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                    <img
                      src={retreat.image}
                      alt={retreat.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-dark/80 text-cream px-4 py-2 rounded-full text-sm">
                      {retreat.duration}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-dark mb-4">
                    {retreat.name}
                  </h3>
                  <p className="text-dark/70 leading-relaxed mb-6">
                    {retreat.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-sm tracking-[0.2em] uppercase text-burgundy mb-3 block">
                      Highlights
                    </span>
                    <ul className="space-y-2">
                      {retreat.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-dark/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-burgundy mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div>
                      <span className="text-sm text-dark/50 block">Starting at</span>
                      <span className="font-serif text-3xl text-dark">
                        ${retreat.price.toLocaleString()}
                      </span>
                    </div>
                    <button className="group flex items-center gap-2 bg-dark text-cream px-6 py-3 rounded-md hover:bg-dark-light transition-colors">
                      View Journey
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-dark/10">
                    <span className="text-sm text-dark/50 mr-3">Upcoming:</span>
                    {retreat.dates.map((date, i) => (
                      <span
                        key={i}
                        className="inline-block text-sm text-dark/70 mr-3 last:mr-0"
                      >
                        {date}
                        {i < retreat.dates.length - 1 && <span className="ml-3 text-dark/30">|</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-dark text-cream text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-serif text-3xl md:text-4xl mb-6">
            Ready to transform?
          </h3>
          <p className="text-cream/70 mb-8">
            Begin your journey of self-discovery and renewal with us.
          </p>
          <Link
            href="/#book"
            className="inline-block bg-burgundy text-cream px-8 py-4 rounded-md text-sm tracking-wide uppercase hover:bg-burgundy-light transition-colors"
          >
            Reserve Your Spot
          </Link>
        </div>
      </section>
    </motion.main>
  );
}
