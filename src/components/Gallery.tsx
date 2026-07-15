import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { IMAGES } from '../types';

interface GalleryItem {
  id: number;
  url: string;
  title: string;
}

export default function Gallery() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      url: IMAGES.COUPLE_BOUTONNIERE,
      title: 'Махаббат салтанаты',
    },
    {
      id: 2,
      url: IMAGES.COUPLE_HANDS_BOUQUET,
      title: 'Бірге мәңгілікке',
    },
    {
      id: 3,
      url: IMAGES.WEDDING_RINGS,
      title: 'Неке жүзіктері',
    },
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) =>
        prev === 0 ? galleryItems.length - 1 : (prev as number) - 1
      );
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) =>
        prev === galleryItems.length - 1 ? 0 : (prev as number) + 1
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Photo Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            onClick={() => setActivePhotoIndex(index)}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-yellow-500/15 bg-black/40 shadow-xl cursor-pointer"
          >
            {/* Soft gold highlight border */}
            <div className="absolute inset-0 border border-transparent group-hover:border-yellow-500/35 rounded-2xl transition-all duration-500 z-10 pointer-events-none" />

            {/* Hover reflection light sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer pointer-events-none z-10" />

            {/* Photo background */}
            <motion.img
              src={item.url}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-[0.95]"
            />

            {/* Bottom Glass Content Reveal */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end h-24 z-10">
              <span className="font-serif text-sm tracking-widest text-yellow-100/90 font-light truncate">
                {item.title}
              </span>
              <span className="font-sans text-[10px] tracking-[0.2em] text-yellow-500/70 uppercase mt-1 flex items-center gap-1">
                <Maximize2 className="w-2.5 h-2.5" /> Толық өлшемде көру
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox / Fullscreen Gallery Viewer */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            id="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActivePhotoIndex(null)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
          >
            {/* Close button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white cursor-pointer z-110"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left navigation arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white cursor-pointer z-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white cursor-pointer z-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Active image display with slide animation */}
            <div className="relative max-w-3xl w-full max-h-[80vh] flex flex-col items-center justify-center">
              <motion.img
                key={activePhotoIndex}
                src={galleryItems[activePhotoIndex].url}
                alt={galleryItems[activePhotoIndex].title}
                referrerPolicy="no-referrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="max-w-full max-h-[75vh] object-contain rounded-xl border border-yellow-500/20 shadow-2xl select-none"
              />

              {/* Caption */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-center"
              >
                <p className="font-serif text-lg tracking-wider text-yellow-400">
                  {galleryItems[activePhotoIndex].title}
                </p>
                <p className="font-sans text-xs text-neutral-400 mt-1 uppercase tracking-widest">
                  {activePhotoIndex + 1} / {galleryItems.length}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
