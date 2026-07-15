import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageSquare, MapPin, ChevronUp, Sparkles, Heart } from 'lucide-react';

import CoverPage from './components/CoverPage';
import BackgroundEffects from './components/BackgroundEffects';
import AudioPlayer from './components/AudioPlayer';
import Countdown from './components/Countdown';
import Gallery from './components/Gallery';
import RSVPForm from './components/RSVPForm';
import GoogleMap from './components/GoogleMap';
import AdminPanel from './components/AdminPanel';
import { IMAGES } from './types';

export default function App() {
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Phone and WhatsApp contacts for the hosts (Kanat & Nargiz)
  const hostPhone = '+77015552026';
  const whatsappUrl = `https://wa.me/77015552026?text=${encodeURIComponent(
    'Сәлеметсіз бе! Азат пен Сабинаның үйлену тойына шақыру бойынша...'
  )}`;

  // Handle scroll detection for "Scroll to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
    setPlayMusic(true);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-yellow-500/30 selection:text-yellow-200">
      
      {/* Luxury Preloader / Cover screen */}
      <AnimatePresence>
        {!isCoverOpen && (
          <CoverPage onOpen={handleOpenInvitation} />
        )}
      </AnimatePresence>

      {/* Main Content (Revealed after opening the cover) */}
      {isCoverOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Animated Background Particles Canvas */}
          <BackgroundEffects />

          {/* Background Audio Engine */}
          <AudioPlayer shouldPlay={playMusic} onPlayStateChange={setPlayMusic} />

          {/* 1. HERO SECTION */}
          <section
            id="hero"
            className="relative h-screen w-full flex flex-col items-center justify-center text-center p-6 overflow-hidden"
          >
            {/* Cinematic background photo with slow Ken Burns zoom effect */}
            <div className="absolute inset-0 z-0">
              <motion.img
                src={IMAGES.COUPLE_HANDS_BOUQUET}
                alt="Азат пен Сабина"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.4] select-none"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1.02 }}
                transition={{ duration: 15, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black" />
            </div>

            {/* Central glass invite content */}
            <div className="relative z-10 max-w-2xl w-full flex flex-col items-center justify-center space-y-6">
              
              {/* Gold rings ornament */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-4xl sm:text-5xl drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                💍
              </motion.div>

              {/* Title label in Kazakh */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="font-serif text-xs sm:text-sm tracking-[0.3em] text-yellow-400 uppercase font-light"
              >
                ҮЙЛЕНУ ТОЙҒА ШАҚЫРУ
              </motion.p>

              {/* Invitation body */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="px-4 py-8 rounded-2xl border border-white/5 bg-black/45 backdrop-blur-md shadow-2xl space-y-6"
                style={{
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5)',
                }}
              >
                <p className="font-sans text-sm sm:text-base leading-relaxed text-neutral-300 font-light max-w-md mx-auto">
                  Құрметті ағайын-туыс, құда-жекжат, нағашы-жиен, дос-жарандар мен көршілер!
                </p>

                <p className="font-sans text-xs sm:text-sm text-neutral-400 uppercase tracking-widest">
                  Сіз(дер)ді ұлымыз
                </p>

                <div className="space-y-1">
                  <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-wider text-yellow-400">
                    АЗАТ ПЕН САБИНАНЫҢ
                  </h1>
                  <p className="font-script text-2xl sm:text-3xl text-yellow-100/70 tracking-wide">
                    үйлену тойына
                  </p>
                </div>

                <p className="font-sans text-sm sm:text-base text-neutral-300 leading-relaxed max-w-sm mx-auto font-light">
                  арнайы жайылған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!
                </p>
              </motion.div>

              {/* Scroll down prompt */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-12 cursor-pointer"
                onClick={() => scrollToSection('wisdom')}
              >
                <p className="font-sans text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                  Төмен қарай сырғытыңыз
                </p>
                <span className="inline-block w-1.5 h-1.5 border-b-2 border-r-2 border-yellow-500 rotate-45 mt-2" />
              </motion.div>

            </div>
          </section>

          {/* 2. WISDOM/QUOTE SECTION */}
          <section
            id="wisdom"
            className="relative py-24 px-6 bg-black flex flex-col items-center justify-center text-center overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="max-w-xl w-full p-8 rounded-3xl border border-yellow-500/10 bg-neutral-950/40 backdrop-blur-md relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-serif">
                ❝
              </div>

              <p className="font-serif text-lg sm:text-xl italic leading-relaxed text-yellow-100/90 font-light">
                «Бақыттың ең үлкені — жақын жандардың басын қосу.
              </p>
              <p className="font-serif text-lg sm:text-xl italic leading-relaxed text-yellow-100/90 font-light mt-2">
                Қуанышымыздың куәсі болып, ақ тілектеріңізді арнауға шақырамыз.»
              </p>

              <div className="flex items-center gap-2 justify-center w-24 mx-auto mt-6">
                <span className="h-[0.5px] bg-yellow-500/30 flex-1" />
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <span className="h-[0.5px] bg-yellow-500/30 flex-1" />
              </div>
            </motion.div>
          </section>

          {/* 3. COUNTDOWN TIMER SECTION */}
          <section
            id="countdown-section"
            className="relative py-20 bg-neutral-950/20 text-center overflow-hidden"
          >
            <Countdown />
          </section>

          {/* 4. EVENT DETAILS (Bento Glass Cards) */}
          <section
            id="details"
            className="relative py-24 px-6 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <p className="font-serif text-sm tracking-[0.2em] text-yellow-500 uppercase mb-2">
                  Той бағдарламасы
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-wider">
                  Күні мен Мекені
                </h2>
                <div className="h-[1px] w-12 bg-yellow-500/30 mx-auto mt-4" />
              </div>

              {/* Glass Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Date card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="p-6 rounded-2xl border border-white/5 bg-neutral-950/60 backdrop-blur-md text-center shadow-lg hover:border-yellow-500/25 transition-colors group"
                >
                  <p className="font-sans text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-4">КҮНІ</p>
                  <p className="font-serif text-5xl text-yellow-400 font-light group-hover:scale-105 transition-transform duration-300">
                    28
                  </p>
                  <p className="font-serif text-lg text-yellow-100 font-light mt-1">
                    қараша
                  </p>
                  <p className="font-sans text-xs text-neutral-400 mt-2">
                    2026 жыл, сенбі
                  </p>
                </motion.div>

                {/* Time card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="p-6 rounded-2xl border border-white/5 bg-neutral-950/60 backdrop-blur-md text-center shadow-lg hover:border-yellow-500/25 transition-colors group"
                >
                  <p className="font-sans text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-4">УАҚЫТЫ</p>
                  <p className="font-serif text-5xl text-yellow-400 font-light group-hover:scale-105 transition-transform duration-300">
                    17:00
                  </p>
                  <p className="font-serif text-lg text-yellow-100 font-light mt-1">
                    басталуы
                  </p>
                  <p className="font-sans text-xs text-neutral-400 mt-2">
                    Қонақтарды жинау
                  </p>
                </motion.div>

                {/* Restaurant card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="p-6 rounded-2xl border border-white/5 bg-neutral-950/60 backdrop-blur-md text-center shadow-lg hover:border-yellow-500/25 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <p className="font-sans text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-4">МЕКЕНЖАЙЫ</p>
                    <p className="font-serif text-2xl text-yellow-400 font-light group-hover:scale-105 transition-transform duration-300">
                      "Камила"
                    </p>
                    <p className="font-serif text-lg text-yellow-100 font-light mt-1">
                      мейрамханасы
                    </p>
                    <p className="font-sans text-xs text-neutral-400 mt-2 leading-relaxed">
                      Қарағанды қаласы
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('maps')}
                    className="mt-6 font-sans text-[10px] uppercase tracking-widest text-yellow-500 hover:text-white cursor-pointer transition-colors"
                  >
                    📍 Картадан көру
                  </button>
                </motion.div>

              </div>
            </div>
          </section>

          {/* 5. PHOTO GALLERY SECTION */}
          <section
            id="gallery"
            className="relative py-24 bg-neutral-950/20 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="font-serif text-sm tracking-[0.2em] text-yellow-500 uppercase mb-2">
                  Махаббат хикаясы
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-wider">
                  Галерея
                </h2>
                <div className="h-[1px] w-12 bg-yellow-500/30 mx-auto mt-4" />
              </div>

              <Gallery />
            </div>
          </section>

          {/* 6. RSVP FORM SECTION */}
          <section
            id="rsvp"
            className="relative py-24 px-6 overflow-hidden"
          >
            <RSVPForm />
          </section>

          {/* 7. GOOGLE MAPS LOCATION SECTION */}
          <section
            id="maps"
            className="relative py-24 px-6 bg-neutral-950/10 overflow-hidden"
          >
            <GoogleMap />
          </section>

          {/* 8. FOOTER SECTION */}
          <footer className="relative py-16 px-6 border-t border-white/5 bg-black text-center z-10 overflow-hidden">
            <div className="max-w-md mx-auto space-y-6">
              
              <div className="text-yellow-500 text-3xl">❤️</div>

              <div className="space-y-1">
                <p className="font-sans text-xs tracking-[0.25em] text-neutral-500 uppercase">
                  Той иелері:
                </p>
                <h4 className="font-serif text-2xl text-yellow-400 font-light tracking-widest">
                  Қанат – Наргиз
                </h4>
              </div>

              <p className="font-serif text-lg italic text-neutral-300 font-light">
                Сіздерді асыға күтеміз!
              </p>

              {/* Hidden Admin Trigger - Gold Heart Icon */}
              <div className="pt-6 flex justify-center">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="p-2 rounded-full text-yellow-500/20 hover:text-yellow-500/60 transition-colors cursor-pointer"
                  title="Администратор панелі"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <p className="font-sans text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
                © 2026 Азат пен Сабина. Барлық құқықтар қорғалған.
              </p>
            </div>
          </footer>

          {/* FLOATING ACTION UTILITY BUTTONS (Mobile & Desktop) */}
          <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-40">
            {/* Call button */}
            <motion.a
              href={`tel:${hostPhone}`}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-yellow-500/30 bg-black/75 text-yellow-500 shadow-lg backdrop-blur-md cursor-pointer hover:border-yellow-500/60 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Хабарласу"
            >
              <Phone className="w-4 h-4" />
            </motion.a>

            {/* WhatsApp button */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-green-500/30 bg-black/75 text-green-400 shadow-lg backdrop-blur-md cursor-pointer hover:border-green-500/60 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="WhatsApp жазу"
            >
              <MessageSquare className="w-4 h-4" />
            </motion.a>

            {/* Map scroll button */}
            <motion.button
              onClick={() => scrollToSection('maps')}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-yellow-500/30 bg-black/75 text-yellow-500 shadow-lg backdrop-blur-md cursor-pointer hover:border-yellow-500/60 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Мекенжай"
            >
              <MapPin className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Floating Scroll back to Top button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scrollToSection('hero')}
                className="fixed bottom-6 right-6 flex items-center justify-center w-11 h-11 rounded-full border border-yellow-500/30 bg-black/75 text-yellow-500 shadow-lg backdrop-blur-md cursor-pointer hover:border-yellow-500/60 transition-colors z-40"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Жоғарыға"
              >
                <ChevronUp className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* RSVP Admin Panel Overlay */}
          <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

        </motion.div>
      )}
    </div>
  );
}
