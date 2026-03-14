"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Leaf, 
  Sun, 
  Moon, 
  Users, 
  Calendar, 
  Utensils, 
  Tent, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

// Tipos para el estado del formulario
type RetreatData = {
  vibe: string;
  groupSize: string;
  duration: string;
  diet: string;
  name: string;
  email: string;
  comments: string;
};

const VIBES = [
  { id: "yoga", title: "Yoga & Mindfulness", icon: Sun, desc: "Alineación, flujo y paz interior." },
  { id: "healing", title: "Deep Healing", icon: Moon, desc: "Trabajo somático, meditación y silencio." },
  { id: "nature", title: "Nature Immersion", icon: Leaf, desc: "Aventuras en la jungla y conexión terrenal." },
  { id: "creative", title: "Creative Escape", icon: Sparkles, desc: "Arte, escritura y expansión mental." },
];

const SIZES = [
  { id: "intimate", title: "Intimate (Up to 10)", icon: Users },
  { id: "standard", title: "Standard (10 - 20)", icon: Users },
  { id: "buyout", title: "Full Buyout (20+)", icon: Tent },
];

export function HostYourRetreat() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RetreatData>({
    vibe: "",
    groupSize: "",
    duration: "",
    diet: "",
    name: "",
    email: "",
    comments: "",
  });

  const updateForm = (field: keyof RetreatData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí luego conectaremos con Supabase o Resend para enviar el mail
    console.log("Retreat Proposal Submitted:", formData);
    setStep(6); // Pantalla de éxito
  };

  // Variantes de animación para Framer Motion
  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <section id="host-retreat" className="py-24 bg-cream relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header del Componente */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-dark mb-4">
            Host Your Retreat
          </h2>
          <p className="text-dark/70 max-w-2xl mx-auto">
            Craft a transformational journey for your community. Share your vision with us, and we'll curate the perfect sanctuary experience in Costa Rica.
          </p>
        </div>

        {/* Contenedor del Builder */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-dark/5 min-h-[500px] flex flex-col">
          
          {/* Indicador de Progreso */}
          {step < 6 && (
            <div className="flex justify-between items-center mb-12 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-dark/10 -z-10" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors duration-300 ${
                    step >= i ? "bg-dark text-white" : "bg-cream text-dark/40 border border-dark/10"
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
          )}

          {/* Área Dinámica del Formulario */}
          <div className="flex-grow relative">
            <AnimatePresence mode="wait">
              
              {/* PASO 1: Vibe */}
              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <h3 className="font-serif text-2xl text-dark mb-6 text-center">What is the core vibe of your retreat?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {VIBES.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => { updateForm("vibe", v.id); nextStep(); }}
                        className={`p-6 rounded-xl border text-left transition-all duration-300 ${
                          formData.vibe === v.id ? "border-dark bg-dark/5" : "border-dark/10 hover:border-dark/30"
                        }`}
                      >
                        <v.icon className="w-6 h-6 mb-4 text-dark" />
                        <h4 className="font-serif text-xl text-dark mb-2">{v.title}</h4>
                        <p className="text-sm text-dark/60">{v.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PASO 2: Tamaño y Duración */}
              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <h3 className="font-serif text-2xl text-dark mb-6 text-center">Tribe & Timing</h3>
                  <div className="space-y-8">
                    <div>
                      <p className="text-sm uppercase tracking-widest text-dark/60 mb-4">Estimated Group Size</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SIZES.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => updateForm("groupSize", s.id)}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                              formData.groupSize === s.id ? "border-dark bg-dark/5" : "border-dark/10 hover:border-dark/30"
                            }`}
                          >
                            <s.icon className="w-6 h-6 mb-2 text-dark" />
                            <span className="text-sm font-medium">{s.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-widest text-dark/60 mb-4">Ideal Duration</p>
                      <select 
                        className="w-full p-4 rounded-xl border border-dark/10 bg-transparent focus:outline-none focus:border-dark"
                        value={formData.duration}
                        onChange={(e) => updateForm("duration", e.target.value)}
                      >
                        <option value="" disabled>Select duration...</option>
                        <option value="3">3 Days (Weekend Escape)</option>
                        <option value="5">5 Days (Deep Dive)</option>
                        <option value="7">7+ Days (Full Immersion)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PASO 3: Nutrición */}
              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <h3 className="font-serif text-2xl text-dark mb-6 text-center">Culinary Journey</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {["Plant-Based & Organic", "Ayurvedic Healing", "Local Costa Rican Flavors", "Mixed / Flexible"].map((diet) => (
                      <button
                        key={diet}
                        onClick={() => updateForm("diet", diet)}
                        className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                          formData.diet === diet ? "border-dark bg-dark/5" : "border-dark/10 hover:border-dark/30"
                        }`}
                      >
                        <Utensils className="w-5 h-5 text-dark/60" />
                        <span className="text-lg">{diet}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PASO 4: Detalles Finales */}
              {step === 4 && (
                <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <h3 className="font-serif text-2xl text-dark mb-6 text-center">Any special requests?</h3>
                  <textarea
                    className="w-full h-40 p-4 rounded-xl border border-dark/10 bg-transparent focus:outline-none focus:border-dark resize-none"
                    placeholder="Tell us about specific spaces you need (Yoga Shala, Fire pit), preferred dates, or the unique vision you have for your guests..."
                    value={formData.comments}
                    onChange={(e) => updateForm("comments", e.target.value)}
                  />
                </motion.div>
              )}

              {/* PASO 5: Contacto para Enviar */}
              {step === 5 && (
                <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <h3 className="font-serif text-2xl text-dark mb-6 text-center">Where should we send your proposal?</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      required
                      type="text"
                      placeholder="Your Full Name"
                      className="w-full p-4 rounded-xl border border-dark/10 bg-transparent focus:outline-none focus:border-dark"
                      value={formData.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full p-4 rounded-xl border border-dark/10 bg-transparent focus:outline-none focus:border-dark"
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="w-full mt-8 bg-dark text-cream py-4 rounded-xl text-sm tracking-wide uppercase hover:bg-dark/90 transition-colors flex items-center justify-center gap-2"
                    >
                      Request Proposal <Sparkles className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* PASO 6: Éxito */}
              {step === 6 && (
                <motion.div key="step6" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="text-center py-12">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="inline-block mb-6 text-green-700"
                  >
                    <CheckCircle2 className="w-20 h-20 mx-auto" />
                  </motion.div>
                  <h3 className="font-serif text-3xl text-dark mb-4">Your Vision is Received</h3>
                  <p className="text-dark/70">
                    Thank you, {formData.name || "friend"}. Our sanctuary curators will review your retreat details and craft a personalized proposal within 48 hours.
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Navegación Inferior (Botones Prev/Next) */}
          {step > 1 && step < 5 && (
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-dark/10">
              <button onClick={prevStep} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={nextStep} className="flex items-center gap-2 text-sm text-dark font-medium hover:opacity-70 transition-opacity">
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}