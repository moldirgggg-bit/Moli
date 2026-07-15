import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

interface CoverPageProps {
  onOpen: () => void;
}

export default function CoverPage({ onOpen }: CoverPageProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    // Let the flip/fade animation play before notifying parent to render the full app
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <motion.div
      id="invitation-cover-wrapper"
      className="fixed inset-0 z-99 flex items-center justify-center overflow-hidden bg-radial from-neutral-900 via-neutral-950 to-black select-none"
      initial={{ opacity: 1 }}
      animate={isOpening ? { opacity: 0, scale: 1.05, filter: 'blur(10px)' } : { opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      style={{ perspective: 1500 }}
    >
      {/* Luxury Golden Spotlight Radial Light behind */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_60%)] animate-pulse" />

      {/* Luxury Sparkling Starfield Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIxIiBmaWxsPSIjZDRhZjM3IiBmaWxsLW9wYWNpdHk9IjAuMTUiLz48L3N2Zz4=')] opacity-80" />

      {/* Extra floating golden sparks purely for cover screen */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-yellow-500/40 blur-[0.5px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 3D Folding Cover Page Left / Right Flaps to simulate opening a physical luxury card */}
      <motion.div
        id="luxury-card-container"
        className="relative flex flex-col items-center justify-center w-[90%] max-w-md aspect-[3/4] rounded-3xl border border-yellow-500/25 bg-neutral-950/75 p-8 shadow-2xl shadow-black/90 backdrop-blur-xl transition-all duration-300"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 40px rgba(212,175,55,0.05)',
        }}
        whileHover={{ scale: isOpening ? 1 : 1.01, rotateX: isOpening ? 0 : 2, rotateY: isOpening ? 0 : -2 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        {/* Ornate Gold Border Filigree */}
        <div className="absolute inset-3 border border-yellow-500/10 rounded-[22px] pointer-events-none" />
        <div className="absolute inset-4 border border-yellow-500/20 rounded-[20px] pointer-events-none">
          {/* Filigree corner brackets */}
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-500/40 rounded-tl-md" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-500/40 rounded-tr-md" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-500/40 rounded-bl-md" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-500/40 rounded-br-md" />
        </div>

        {/* Outer subtle glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-yellow-500/10 via-transparent to-yellow-500/5 blur-lg pointer-events-none" />

        {/* Top rings iconography */}
        <motion.div
          id="cover-wedding-rings"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative text-yellow-500 text-5xl mb-6 select-none flex justify-center drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          💍
        </motion.div>

        {/* Central 3D Glass frame */}
        <motion.div
          id="glass-frame"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative flex flex-col items-center justify-center py-8 px-6 my-2 w-full border border-white/10 bg-gradient-to-b from-white/5 to-white/0 rounded-2xl shadow-xl shadow-black/45 backdrop-blur-md"
        >
          {/* Title - "ҮЙЛЕНУ ТОЙҒА ШԱҚЫРУ" */}
          <h2 className="font-serif text-3xl font-light tracking-[0.2em] text-center text-yellow-400 drop-shadow-md leading-relaxed">
            ҮЙЛЕНУ ТОЙҒА
          </h2>
          <div className="flex items-center gap-3 w-32 my-3">
            <span className="h-[1px] bg-gradient-to-r from-transparent to-yellow-500/40 flex-1" />
            <Sparkles className="w-3.5 h-3.5 text-yellow-500/60 animate-pulse" />
            <span className="h-[1px] bg-gradient-to-l from-transparent to-yellow-500/40 flex-1" />
          </div>
          <h1 className="font-serif text-4xl font-normal tracking-[0.25em] text-center text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
            ШАҚЫРУ
          </h1>
        </motion.div>

        {/* Lower Ring Iconography ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6 }}
          className="text-yellow-500/50 font-serif text-lg tracking-[0.3em] mt-3"
        >
          ✧ ✦ ✧
        </motion.div>

        {/* Interactivity/Button area */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            onClick={handleOpen}
            disabled={isOpening}
            className="relative px-8 py-3 rounded-full border border-yellow-500/40 bg-gradient-to-r from-yellow-500/15 via-yellow-400/25 to-yellow-500/15 text-yellow-100 font-sans tracking-[0.15em] text-sm font-medium shadow-lg hover:shadow-yellow-500/20 active:scale-95 cursor-pointer flex items-center gap-2 overflow-hidden group transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Shimmer light sweep */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer pointer-events-none" />
            
            <span>АШУ ҮШІН ТҮРТІҢІЗ</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              ✦
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Bottom copyright/aesthetic credits */}
        <p className="absolute bottom-6 font-sans text-[10px] tracking-[0.25em] text-neutral-500 text-center uppercase">
          Azat & Sabina • 2026
        </p>
      </motion.div>
    </motion.div>
  );
}
