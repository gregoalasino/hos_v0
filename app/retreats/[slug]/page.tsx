"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Calendar, Clock, Users } from "lucide-react";
import { getRetreatBySlug } from "../data";

export default function RetreatPage({ params }: { params: { slug: string } }) {
  const retreat = getRetreatBySlug(params.slug);

  if (!retreat) {
    notFound();
  }

  const heroRef = useRef(null);
  const overviewRef = useRef(null);
  const itineraryRef = useRef(null);
  const formRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const overviewInView = useInView(overviewRef, { once: true, margin: "-100px" });
  const itineraryInView = useInView(itineraryRef, { once: true, margin: "-100px" });
  const formInView = useInView(formRef, { once: true, margin: "-100px" });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-warm-white"
    >
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/retreats"
          className="flex items-center gap-2 text-sm text-cream/90 hover:text-cream transition-colors bg-dark/50 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          All Retreats
        </Link>
      </div>

      <section ref={heroRef} className="relative h-screen flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={retreat.heroImage}
            alt={retreat.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-cream/60 mb-4 block">
            {retreat.duration} · Starting at ${retreat.price.toLocaleString()}
          </span>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-cream mb-4 leading-none">
            {retreat.name}
          </h1>
          <p className="font-display text-xl md:text-2xl text-cream/70 italic mb-10">
            {retreat.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#book"
              className="group inline-flex items-center gap-3 bg-burgundy text-cream px-8 py-4 rounded-md text-sm tracking-wide uppercase hover:bg-burgundy-light transition-colors"
            >
              Book Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#itinerary"
              className="inline-flex items-center gap-3 border border-cream/40 text-cream px-8 py-4 rounded-md text-sm tracking-wide uppercase hover:bg-cream/10 transition-colors"
            >
              View Itinerary
            </a>
          </div>
        </motion.div>
      </section>

      <section ref={overviewRef} className="py-24 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={overviewInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-6 block">
                About This Journey
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-dark mb-8 leading-tight">
                {retreat.name}
              </h2>
              <p className="text-dark/70 leading-relaxed text-lg mb-6">
                {retreat.extendedDescription}
              </p>
              <div className="flex flex-wrap gap-6 pt-6 border-t border-dark/10">
                <div className="flex items-center gap-2 text-dark/70">
                  <Clock className="w-5 h-5 text-burgundy" />
                  <span>{retreat.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <Users className="w-5 h-5 text-burgundy" />
                  <span>Small group (max 12)</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <Calendar className="w-5 h-5 text-burgundy" />
                  <span>{retreat.dates.join(" · ")}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={overviewInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-display text-2xl text-dark mb-6">Highlights</h3>
                <ul className="space-y-3">
                  {retreat.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-dark/70">
                      <span className="w-5 h-5 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-burgundy" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-warm-white rounded-lg p-8">
                <h3 className="font-display text-2xl text-dark mb-6">What's Included</h3>
                <ul className="space-y-3">
                  {retreat.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-dark/70">
                      <Check className="w-4 h-4 text-burgundy flex-shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-dark/10">
                  <span className="text-sm text-dark/50 block mb-1">Starting at</span>
                  <span className="font-display text-4xl text-dark">
                    ${retreat.price.toLocaleString()}
                    <span className="text-lg text-dark/50"> / person</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="itinerary" ref={itineraryRef} className="py-24 lg:py-32 bg-warm-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={itineraryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">Day by Day</span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-dark">Your Itinerary</h2>
          </motion.div>
          <div className="space-y-0">
            {retreat.itinerary.map((day, index) => (
              <ItineraryItem key={index} day={day} index={index} isInView={itineraryInView} />
            ))}
          </div>
        </div>
      </section>

      <section id="book" ref={formRef} className="py-24 lg:py-32 bg-dark">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">Begin Your Journey</span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-cream mb-4">
              Reserve Your Place
            </h2>
            <p className="text-cream/60 text-lg">
              Complete the form below and our team will reach out within 24 hours to confirm your booking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          >
            <BookingForm retreatName={retreat.name} dates={retreat.dates} price={retreat.price} />
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}

function ItineraryItem({
  day,
  index,
  isInView,
}: {
  day: { day: string; title: string; activities: string[] };
  index: number;
  isInView: boolean;
}) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
      className="border-b border-dark/10 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <div className="flex items-center gap-6">
          <span className="text-sm tracking-[0.2em] uppercase text-burgundy w-12 flex-shrink-0">
            {day.day}
          </span>
          <span className="font-display text-xl md:text-2xl text-dark group-hover:text-burgundy transition-colors">
            {day.title}
          </span>
        </div>
        <span className={`text-dark/40 transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? "rotate-45" : ""}`}>
          <ArrowRight className="w-5 h-5 rotate-[-45deg]" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }} />
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <ul className="pb-6 pl-18 space-y-3" style={{ paddingLeft: "4.5rem" }}>
          {day.activities.map((activity, i) => (
            <li key={i} className="flex items-start gap-3 text-dark/60">
              <span className="w-1 h-1 rounded-full bg-burgundy/60 flex-shrink-0 mt-2.5" />
              {activity}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

function BookingForm({
  retreatName,
  dates,
  price,
}: {
  retreatName: string;
  dates: string[];
  price: number;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedDate: "",
    participants: "1",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-burgundy/20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-burgundy" />
        </div>
        <h3 className="font-display text-3xl text-cream mb-4">Thank You</h3>
        <p className="text-cream/60 text-lg max-w-md mx-auto">
          Your inquiry for <span className="text-cream">{retreatName}</span> has been received. Our team will reach out to you within 24 hours to confirm your spot.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="text-sm tracking-wide uppercase text-cream/50 mb-2 block">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Your first name"
            className="w-full bg-transparent border border-cream/20 rounded-md px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm tracking-wide uppercase text-cream/50 mb-2 block">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Your last name"
            className="w-full bg-transparent border border-cream/20 rounded-md px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="text-sm tracking-wide uppercase text-cream/50 mb-2 block">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="hello@example.com"
            className="w-full bg-transparent border border-cream/20 rounded-md px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm tracking-wide uppercase text-cream/50 mb-2 block">
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            className="w-full bg-transparent border border-cream/20 rounded-md px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="selectedDate" className="text-sm tracking-wide uppercase text-cream/50 mb-2 block">
            Preferred Date
          </label>
          <select
            id="selectedDate"
            name="selectedDate"
            required
            value={formData.selectedDate}
            onChange={handleChange}
            className="w-full bg-dark border border-cream/20 rounded-md px-4 py-3 text-cream focus:outline-none focus:border-burgundy transition-colors appearance-none"
          >
            <option value="" disabled>Select a date</option>
            {dates.map((date) => (
              <option key={date} value={date}>{retreatName} — {date}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="participants" className="text-sm tracking-wide uppercase text-cream/50 mb-2 block">
            Participants
          </label>
          <select
            id="participants"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            className="w-full bg-dark border border-cream/20 rounded-md px-4 py-3 text-cream focus:outline-none focus:border-burgundy transition-colors appearance-none"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm tracking-wide uppercase text-cream/50 mb-2 block">
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your experience level, any special requirements, or questions..."
          className="w-full bg-transparent border border-cream/20 rounded-md px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-burgundy transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-cream/10">
        <div>
          <span className="text-sm text-cream/40 block">Total estimate</span>
          <span className="font-display text-3xl text-cream">
            ${(price * parseInt(formData.participants)).toLocaleString()}
            <span className="text-base text-cream/50"> / {formData.participants} {parseInt(formData.participants) === 1 ? "person" : "people"}</span>
          </span>
        </div>
        <button
          type="submit"
          className="group flex items-center gap-3 bg-burgundy text-cream px-10 py-4 rounded-md text-sm tracking-wide uppercase hover:bg-burgundy-light transition-colors"
        >
          Book Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
