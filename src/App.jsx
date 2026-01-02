import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Menu,
  X,
  Instagram,
  Linkedin,
  Facebook,
  MessageSquare,
} from 'lucide-react';

import heroVideo from './assets/hero-video.mp4';

// --- Assets & Constants ---
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop",
  interior: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop",
  exterior: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop",
  detail: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2592&auto=format&fit=crop",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
  construction: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2631&auto=format&fit=crop"
};

const SECTIONS = ['Home', 'Projects', 'Services', 'Philosophy', 'Careers', 'Contact'];

// --- Components ---

// 0. Preloader
const Preloader = ({ setLoading }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-[#050505] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 1, delay: 2.5, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => setLoading(false)}
    >
      <div className="overflow-hidden relative">
        <motion.h1
          className="text-white font-serif text-4xl md:text-6xl tracking-widest"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          ADROIT
        </motion.h1>
      </div>
      <motion.div
        className="absolute bottom-10 w-full flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-64 h-[1px] bg-white/20 overflow-hidden">
          <motion.div
            className="h-full bg-[#C5A059]"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

// 0.5 Custom Cursor
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('.cursor-pointer')) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white z-[100] pointer-events-none mix-blend-difference hidden md:block"
      animate={{
        x: mousePosition.x - (hovered ? 24 : 8),
        y: mousePosition.y - (hovered ? 24 : 8),
        scale: hovered ? 3 : 1,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
    />
  );
};

// 1. Navigation Overlay
const Navigation = ({ isOpen, setIsOpen, setPage }) => {
  const menuVariants = {
    closed: { x: "100%", transition: { type: "tween", duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
    open: { x: 0, transition: { type: "tween", duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 50 },
    open: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.5 } })
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-screen w-full md:w-[50vw] bg-[#0a0a0a] z-50 flex flex-col justify-center px-12 md:px-24 shadow-2xl"
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-[#C5A059] transition-colors cursor-pointer">
        <X size={32} />
      </button>
      <div className="flex flex-col gap-8">
        {SECTIONS.map((item, i) => (
          <motion.div
            key={item}
            custom={i}
            variants={linkVariants}
            className="group cursor-pointer flex items-center gap-6"
            onClick={() => { setPage(item); setIsOpen(false); }}
          >
            <span className="text-xs text-[#C5A059] font-mono opacity-50">0{i + 1}</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white/40 group-hover:text-white transition-colors duration-500 font-light tracking-wide italic-hover">
              {item}
            </h2>
          </motion.div>
        ))}
      </div>
      <div className="mt-16 pt-12 border-t border-white/5 flex gap-8 text-white/30">
        <Instagram className="hover:text-[#C5A059] cursor-pointer transition-colors w-5 h-5" />
        <Linkedin className="hover:text-[#C5A059] cursor-pointer transition-colors w-5 h-5" />
        <Facebook className="hover:text-[#C5A059] cursor-pointer transition-colors w-5 h-5" />
      </div>
    </motion.div>
  );
};

// 2. Hero Section (Updated with New Video and Font)
const Hero = () => {
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2500); // Wait for preloader
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
      videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#050505]">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ opacity: { duration: 2, delay: 2 }, scale: { duration: 20, ease: "linear" } }}
      >
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />

        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={IMAGES.hero}
          className="w-full h-full object-cover"
        >
          {/* Updated to Local Video Source */}
          <source src={heroVideo} type="video/mp4" />
        </video>
      </motion.div>

      <div className="relative z-20 h-full flex flex-col justify-center items-center px-6 md:px-24 text-center">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center mix-blend-screen"
            >
              <h1 className="text-white font-serif text-6xl md:text-[10rem] leading-none tracking-tight font-light">
                ADROIT
              </h1>
              {/* Added Italic styling for distinct luxury contrast */}
              <h1 className="text-white font-serif italic text-6xl md:text-[10rem] leading-none tracking-tight mt-2 md:-mt-8 text-[#f0f0f0]">
                DESIGN
              </h1>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "80px" }}
                transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
                className="w-[1px] bg-[#C5A059] my-8 opacity-80"
              />

              <motion.div
                initial={{ opacity: 0, letterSpacing: "0em" }}
                animate={{ opacity: 1, letterSpacing: "0.4em" }}
                transition={{ delay: 1.2, duration: 1.5 }}
              >
                <h2 className="text-white/80 text-[10px] md:text-sm uppercase font-medium tracking-[0.4em]">
                  Architecture <span className="text-[#C5A059] px-2">&</span> Interiors
                </h2>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1.5 }}
            className="absolute bottom-12 left-0 right-0 z-20 flex justify-center cursor-pointer"
          >
            <div className="flex flex-col items-center text-white/30 text-[9px] tracking-[0.3em] gap-3 group">
              <span className="group-hover:text-[#C5A059] transition-colors duration-500">DISCOVER</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 3. Featured Projects
const FeaturedProjects = () => {
  const projects = [
    { title: "Azure Villa", loc: "Malibu, California", img: IMAGES.exterior, cat: "Residential" },
    { title: "The Onyx", loc: "Dubai, UAE", img: IMAGES.interior, cat: "Commercial" },
    { title: "Serenity Spa", loc: "Kyoto, Japan", img: IMAGES.detail, cat: "Hospitality" },
    { title: "Vanguard HQ", loc: "Berlin, Germany", img: IMAGES.office, cat: "Corporate" },
  ];

  return (
    <section className="py-40 bg-[#f4f4f4] overflow-hidden">
      <div className="px-6 md:px-24 mb-20 flex justify-between items-end border-b border-stone-200 pb-8">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase">Selected Works</span>
          <h2 className="text-4xl md:text-6xl font-serif text-stone-900 mt-6 font-light">Curated Excellence</h2>
        </div>
        <button className="hidden md:flex items-center gap-2 text-stone-900 text-xs tracking-widest uppercase hover:text-[#C5A059] transition-colors pb-2 cursor-pointer">
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="flex overflow-x-auto pb-12 px-6 md:px-24 gap-12 snap-x scrollbar-hide cursor-pointer">
        {projects.map((proj, idx) => (
          <motion.div
            key={idx}
            className="min-w-[85vw] md:min-w-[45vw] aspect-[4/3] relative group snap-center"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-full h-full overflow-hidden bg-stone-200 relative">
              <img
                src={proj.img}
                alt={proj.title}
                className="w-full h-full object-cover grayscale transition-all duration-1000 ease-out group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#C5A059]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />
            </div>

            <div className="mt-8 flex justify-between items-start opacity-60 group-hover:opacity-100 transition-opacity duration-500">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#C5A059] block mb-2">{proj.cat}</span>
                <h3 className="text-3xl font-serif text-stone-900 italic">{proj.title}</h3>
              </div>
              <p className="text-xs text-stone-500 mt-1 font-light tracking-wide">{proj.loc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// 4. Services
const Services = () => {
  const services = [
    { title: "Architecture", desc: "Form follows function in our comprehensive structural design process, ensuring timeless aesthetic appeal." },
    { title: "Interior Design", desc: "Curating sensory atmospheres through material, light, and spatial harmony for elevated living." },
    { title: "Construction", desc: "Turnkey execution with rigorous precision, managing every detail from foundation to finish." },
    { title: "Master Planning", desc: "Strategic development planning for large-scale residential and commercial communities." },
  ];

  return (
    <section className="py-40 bg-[#0a0a0a] text-white">
      <div className="px-6 md:px-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase">Expertise</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-8 leading-tight font-light text-white/90">
              Designing for people, <br />
              <span className="text-white/40 italic">purpose, and place.</span>
            </h2>
          </div>
          <div className="md:col-span-8 space-y-0">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                className="group border-t border-white/10 py-12 cursor-pointer transition-all duration-500 hover:bg-white/5 px-4 -mx-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                  <h3 className="text-3xl font-serif font-light text-white/80 group-hover:text-[#C5A059] transition-colors duration-500">
                    {service.title}
                  </h3>
                  <div className="flex items-center justify-between md:gap-12 mt-4 md:mt-0">
                    <p className="text-sm text-white/40 max-w-sm font-light leading-relaxed group-hover:text-white/70 transition-colors">
                      {service.desc}
                    </p>
                    <ArrowRight className="text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all duration-500 -ml-4 group-hover:ml-0" size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="border-t border-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

// 5. Careers Module
const Careers = () => {
  return (
    <section className="py-40 px-6 md:px-24 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 font-light">Join the Collective</h2>
          <div className="h-[1px] w-12 bg-[#C5A059] mx-auto my-8"></div>
          <p className="text-stone-500 font-light max-w-lg mx-auto leading-relaxed">
            We are looking for visionaries to help shape the future of our built environments.
          </p>
        </div>

        <div className="grid gap-6">
          {[
            { role: "Senior Architect", loc: "New York", type: "Full-Time" },
            { role: "Interior Designer", loc: "London", type: "Full-Time" },
            { role: "Site Engineer", loc: "Dubai", type: "Contract" }
          ].map((job, idx) => (
            <motion.div
              key={idx}
              className="group flex flex-col md:flex-row justify-between items-center p-8 border border-stone-100 hover:border-[#C5A059]/30 transition-colors duration-500 bg-stone-50 hover:bg-white cursor-pointer"
              whileHover={{ y: -5 }}
            >
              <div className="text-center md:text-left">
                <h3 className="text-xl font-serif text-stone-900 italic group-hover:text-[#C5A059] transition-colors">{job.role}</h3>
                <p className="text-xs tracking-widest uppercase text-stone-400 mt-2">{job.loc} — {job.type}</p>
              </div>
              <span className="mt-6 md:mt-0 text-xs font-bold underline decoration-stone-300 underline-offset-4 group-hover:decoration-[#C5A059] transition-all cursor-pointer">
                APPLY NOW
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. Lead Gen (Elegant Wizard)
const LeadGen = () => {
  const [step, setStep] = useState(1);
  return (
    <section className="py-40 px-6 md:px-24 bg-[#f4f4f4]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase">Inquire</span>
          <h2 className="text-4xl font-serif text-stone-900 mt-6 font-light">Create Something Exceptional</h2>
        </div>

        <div className="bg-white p-12 md:p-16 shadow-2xl shadow-stone-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#f4f4f4]">
            <motion.div
              className="h-full bg-[#C5A059]"
              initial={{ width: "0%" }}
              animate={{ width: step === 1 ? "50%" : "100%" }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-serif mb-8 text-center italic">Select Project Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {['Residential', 'Commercial', 'Hospitality', 'Retail'].map(opt => (
                  <button key={opt} className="py-6 border border-stone-100 hover:border-[#C5A059] hover:text-[#C5A059] transition-all text-stone-500 text-sm tracking-wide uppercase cursor-pointer">
                    {opt}
                  </button>
                ))}
              </div>
              <div className="text-center">
                <button onClick={() => setStep(2)} className="bg-[#0a0a0a] text-white px-12 py-4 text-xs tracking-[0.2em] hover:bg-[#C5A059] transition-colors cursor-pointer">
                  CONTINUE
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-serif mb-8 text-center italic">Your Details</h3>
              <div className="space-y-8 mb-12 max-w-md mx-auto">
                <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-stone-200 pb-4 focus:outline-none focus:border-[#C5A059] transition-colors text-center placeholder:text-stone-300" />
                <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-stone-200 pb-4 focus:outline-none focus:border-[#C5A059] transition-colors text-center placeholder:text-stone-300" />
              </div>
              <div className="flex justify-center gap-6 items-center">
                <button onClick={() => setStep(1)} className="text-xs text-stone-400 hover:text-stone-900 cursor-pointer">BACK</button>
                <button onClick={() => setStep(1)} className="bg-[#0a0a0a] text-white px-12 py-4 text-xs tracking-[0.2em] hover:bg-[#C5A059] transition-colors cursor-pointer">
                  SUBMIT
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// 7. Chatbot (Concierge)
const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-8 right-8 z-40 bg-[#0a0a0a] text-white p-4 rounded-full shadow-2xl cursor-pointer hover:bg-[#C5A059] transition-colors duration-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-8 z-40 w-80 bg-white shadow-2xl border border-stone-100"
          >
            <div className="p-6 border-b border-stone-100 bg-[#0a0a0a] text-white">
              <span className="text-[10px] tracking-widest uppercase text-[#C5A059]">Concierge</span>
              <p className="text-lg font-serif mt-1 italic">Adroit Assistant</p>
            </div>
            <div className="h-64 bg-stone-50 p-6">
              <div className="bg-white p-4 text-sm text-stone-600 shadow-sm border border-stone-100 inline-block rounded-tr-xl rounded-bl-xl rounded-br-xl">
                Welcome. How may I assist with your design inquiry today?
              </div>
            </div>
            <div className="p-4 bg-white">
              <input type="text" placeholder="Type a message..." className="w-full text-sm outline-none placeholder:text-stone-300" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 9. Footer
const Footer = ({ setPage }) => {
  return (
    <footer className="bg-[#050505] text-stone-500 py-32 px-6 md:px-24 border-t border-white/5 cursor-default">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
        <div className="md:col-span-1">
          <h2 className="text-white text-3xl font-serif mb-8 tracking-wide">ADROIT</h2>
        </div>

        {['Studio', 'Expertise', 'Connect'].map((col, i) => (
          <div key={i}>
            <h4 className="text-[#C5A059] text-[10px] uppercase tracking-[0.2em] mb-8">{col}</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="hover:text-white transition-colors cursor-pointer">Overview</li>
              <li className="hover:text-white transition-colors cursor-pointer">Philosophy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Awards</li>
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-stone-600">
        <p>© 2026 Adroit Design.</p>
        <div className="flex gap-8 mt-6 md:mt-0">
          <span className="cursor-pointer hover:text-[#C5A059] transition-colors">Instagram</span>
          <span className="cursor-pointer hover:text-[#C5A059] transition-colors">LinkedIn</span>
          <span className="cursor-pointer hover:text-[#C5A059] transition-colors">Legal</span>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---
const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('Home');

  return (
    <div className="font-sans bg-[#f4f4f4] min-h-screen selection:bg-[#C5A059] selection:text-white text-stone-900 cursor-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        body { cursor: none; } /* Hide default cursor */
      `}</style>

      {/* Intro Loader */}
      <AnimatePresence>
        {loading && <Preloader setLoading={setLoading} />}
      </AnimatePresence>

      {/* Custom Follower Cursor */}
      {!loading && <CustomCursor />}

      {/* Navbar - Glass/Minimal */}
      <motion.nav
        className="fixed top-0 w-full z-40 px-8 md:px-16 py-8 flex justify-between items-center text-white mix-blend-difference"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <div className="hidden md:flex gap-12 text-[10px] font-medium tracking-[0.2em] uppercase">
          <span onClick={() => setCurrentPage('Projects')} className="cursor-pointer hover:opacity-50 transition-opacity hover:text-[#C5A059]">Projects</span>
          <span onClick={() => setCurrentPage('Services')} className="cursor-pointer hover:opacity-50 transition-opacity hover:text-[#C5A059]">Expertise</span>
        </div>

        <div onClick={() => setCurrentPage('Home')} className="text-xl font-serif tracking-widest cursor-pointer font-bold md:absolute md:left-1/2 md:-translate-x-1/2 hover:text-[#C5A059] transition-colors">
          ADROIT
        </div>

        <div className="flex items-center gap-12 text-[10px] font-medium tracking-[0.2em] uppercase">
          <span className="hidden md:block cursor-pointer hover:opacity-50 transition-opacity hover:text-[#C5A059]">Contact</span>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsNavOpen(true)}>
            <span className="hidden md:block group-hover:opacity-50 transition-opacity group-hover:text-[#C5A059]">Menu</span>
            <Menu className="w-5 h-5 group-hover:text-[#C5A059] transition-colors" />
          </div>
        </div>
      </motion.nav>

      <Navigation isOpen={isNavOpen} setIsOpen={setIsNavOpen} setPage={setCurrentPage} />

      <main>
        {currentPage === 'Home' && (
          <>
            <Hero />
            <div className="relative z-10">
              <Services />
              <FeaturedProjects />
              <LeadGen />
            </div>
          </>
        )}
        {currentPage !== 'Home' && (
          <div className="pt-40 px-6 md:px-24 min-h-screen bg-stone-50">
            <h1 className="text-6xl font-serif text-stone-900 mb-12 italic">{currentPage}</h1>
            {currentPage === 'Projects' && <FeaturedProjects />}
            {currentPage === 'Services' && <Services />}
            {currentPage === 'Careers' && <Careers />}
            {currentPage === 'Contact' && <LeadGen />}
          </div>
        )}
      </main>

      <AIChatbot />
      <Footer setPage={setCurrentPage} />
    </div>
  );
};

export default App;
