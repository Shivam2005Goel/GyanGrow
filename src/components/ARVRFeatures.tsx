'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Play, Eye, Video, MapPin, Maximize, Orbit, Layers, Sparkles, X, Glasses } from 'lucide-react';

// Simulated 3D orb using mathematical rendering on canvas
const DynamicOrb = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 60;
      
      for (let i = 0; i < 40; i++) {
        for (let j = 0; j < 40; j++) {
          const u = i / 40 * Math.PI * 2;
          const v = j / 40 * Math.PI;
          
          const x = centerX + radius * Math.cos(u) * Math.sin(v) * (1 + 0.1 * Math.sin(u * 5 + time));
          const y = centerY + radius * Math.sin(u) * Math.sin(v) * (1 + 0.1 * Math.cos(v * 5 + time));
          
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${Math.abs(Math.sin(u + time)) * 0.5})`;
          ctx.fill();
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} width={200} height={200} className="w-full h-full object-contain mix-blend-screen opacity-70" />;
};

const vrExperiences = [
  {
    id: 'campus-tour',
    title: 'Virtual Campus Tour',
    description: 'Explore the entire VIT campus in immersive 3D/VR. Walk through buildings, hostels, and academic blocks.',
    icon: MapPin,
    color: 'from-cyan-500 to-blue-600',
    tags: ['WebXR', '360° View']
  },
  {
    id: 'virtual-labs',
    title: 'Interactive Virtual Labs',
    description: 'Perform complex experiments in physics, chemistry, and engineering safely in virtual reality.',
    icon: Layers,
    color: 'from-violet-500 to-purple-600',
    tags: ['Interactive', 'Simulation']
  },
  {
    id: 'mech-engineering',
    title: '3D Engine Assembly',
    description: 'Deconstruct and rebuild a V8 engine in AR to understand detailed mechanical operations.',
    icon: Orbit,
    color: 'from-amber-500 to-orange-600',
    tags: ['Augmented Reality', 'Mechanical']
  },
  {
    id: 'anatomy',
    title: 'Human Anatomy VR',
    description: 'Detailed interactive anatomical layers for biotechnology and bioengineering students.',
    icon: Eye,
    color: 'from-emerald-500 to-teal-600',
    tags: ['Biology', 'VR']
  }
];

export default function ARVRFeatures() {
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const launchExperience = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActiveExperience(id);
    }, 1500);
  };

  if (activeExperience) {
    const experience = vrExperiences.find(e => e.id === activeExperience);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8"
      >
        <div className="relative w-full max-w-6xl h-full max-h-[85vh] rounded-3xl overflow-hidden border border-white/10 bg-[#0a0f1d] shadow-2xl shadow-cyan-500/20 flex flex-col">
          {/* Header */}
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${experience?.color}`}>
                <Glasses size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{experience?.title}</h3>
                <p className="text-white/50 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Session
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveExperience(null)}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Simulation Area */}
          <div className="flex-1 relative flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            {/* Center interactive elements */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-64 h-64 mb-8">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[60px] animate-pulse" />
                <DynamicOrb />
              </div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white shadow-xl shadow-black/50"
              >
                <p className="text-sm font-medium tracking-wide">Initializing WebXR Environment...</p>
              </motion.div>
            </div>
            
            <div className="absolute bottom-6 inset-x-6 flex justify-between items-end">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-black/50 text-white/70 text-xs backdrop-blur-md border border-white/5">FPS: 60</div>
                  <div className="px-3 py-1.5 rounded-lg bg-black/50 text-white/70 text-xs backdrop-blur-md border border-white/5">Latency: 12ms</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition backdrop-blur-md border border-white/10 text-white">
                  <Video size={20} />
                </button>
                <button className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/30 text-white">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black border border-white/[0.08] p-8 md:p-12"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-fuchsia-500/10 to-blue-500/10 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            Immersive Learning
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Step into the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400">Future</span> of Education
          </h1>
          <p className="text-lg text-white/60 mb-8 leading-relaxed">
            Experience complex concepts in 3D, take virtual campus tours, and conduct safe experiments in our state-of-the-art WebXR environments right from your browser.
          </p>
          
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2">
              <Play size={18} /> Watch Demo
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition flex items-center gap-2">
              <Box size={18} /> Compatible Devices
            </button>
          </div>
        </div>
        
        {/* Abstract 3D illustration representation */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block opacity-80 pointer-events-none">
          <div className="w-64 h-64 relative">
             <DynamicOrb />
          </div>
        </div>
      </motion.div>

      {/* Modules Grid */}
      <h2 className="text-xl font-bold text-white mb-4 px-2">Available Experiences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {vrExperiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 backdrop-blur-xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-10 rounded-full blur-[40px] transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <exp.icon size={28} className="text-white" />
                  </div>
                  <div className="flex gap-2">
                    {exp.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white/50 bg-white/5 rounded-full border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
                <p className="text-sm text-white/50 mb-6 line-clamp-2">{exp.description}</p>
                
                <button 
                  onClick={() => launchExperience(exp.id)}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition border border-white/10 group-hover:border-white/20 flex justify-center items-center gap-2"
                >
                  {loading && activeExperience === null ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                    />
                  ) : (
                    <>Launch <Play size={16} /></>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Info Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Glasses size={24} />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Have a VR Headset?</h4>
            <p className="text-sm text-white/60">Connect your Oculus Quest or HTC Vive for the full WebXR experience.</p>
          </div>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 font-medium hover:bg-cyan-500/30 transition border border-cyan-500/30 whitespace-nowrap">
          Pair Device
        </button>
      </motion.div>
    </div>
  );
}
