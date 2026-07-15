import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Send, Heart, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RSVPFormProps {
  onSuccess?: (data: { name: string; status: string }) => void;
}

export default function RSVPForm({ onSuccess }: RSVPFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'will_attend' | 'cannot_attend' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scriptUrl, setScriptUrl] = useState(() => {
    return localStorage.getItem('google_apps_script_url') || '';
  });
  const [showConfig, setShowConfig] = useState(false);

  // Trigger luxury confetti and fireworks
  const triggerCelebration = () => {
    // Left/Right splash confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Fireworks explosions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#F4E8C1', '#C58991', '#FFFFFF'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#F4E8C1', '#C58991', '#FFFFFF'],
      });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!phone.trim()) return;
    if (!status) return;

    setIsSubmitting(true);

    const rsvpData = {
      name: name.trim(),
      phone: phone.trim(),
      status: status === 'will_attend' ? 'Қуана келемін' : 'Өкінішке қарай келе алмаймын',
      timestamp: new Date().toLocaleString('kk-KZ'),
    };

    // 1. Save locally in localStorage for local dashboard/tracking
    const existingRsvpsRaw = localStorage.getItem('wedding_rsvps') || '[]';
    try {
      const rsvps = JSON.parse(existingRsvpsRaw);
      rsvps.push(rsvpData);
      localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));
    } catch (err) {
      console.error('Error saving RSVP locally:', err);
    }

    // 2. Submit to Google Apps Script if provided
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', // standard Apps Script setup
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rsvpData),
        });
      } catch (err) {
        console.error('Google Sheets submission error:', err);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      triggerCelebration();
      if (onSuccess) {
        onSuccess({ name: rsvpData.name, status: rsvpData.status });
      }
    }, 1200);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('google_apps_script_url', scriptUrl);
    setShowConfig(false);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div
        id="rsvp-card-container"
        className="relative rounded-3xl border border-yellow-500/15 bg-neutral-950/65 p-6 sm:p-8 shadow-2xl backdrop-blur-lg overflow-hidden"
        style={{
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Soft radial golden background glow */}
        <div className="absolute inset-0 bg-radial from-yellow-500/5 via-transparent to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="rsvp-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Settings button to connect to Google Sheets */}
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="absolute top-0 right-0 p-1 text-neutral-500 hover:text-yellow-400 cursor-pointer transition-colors z-20"
                title="Синхрондау баптаулары"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl font-light tracking-wider text-yellow-400">
                  Қатысуыңызды растаңыз
                </h3>
                <p className="font-sans text-xs text-neutral-400 mt-2 tracking-wide leading-relaxed">
                  Құрметті қонақ, дастарханымыздың жауапты ұйымдастырылуы үшін жиынға келуіңізді 20 қарашаға дейін растауыңызды сұраймыз.
                </p>
              </div>

              {/* Google Sheets Config Drawer */}
              <AnimatePresence>
                {showConfig && (
                  <motion.form
                    onSubmit={handleSaveConfig}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6 p-4 rounded-xl border border-yellow-500/10 bg-black/60 overflow-hidden"
                  >
                    <p className="text-[11px] font-sans text-yellow-400 font-medium tracking-wider uppercase mb-2">
                      Google Sheets интеграциясы:
                    </p>
                    <p className="text-[10px] text-neutral-400 mb-3 leading-normal">
                      Google Apps Script Web App сілтемесін енгізіңіз. RSVP жауаптары сол таблицаға бірден жазылады.
                    </p>
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={scriptUrl}
                      onChange={(e) => setScriptUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-mono text-neutral-200 focus:border-yellow-500/50 outline-none"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setShowConfig(false)}
                        className="px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-900 text-[10px] tracking-wider uppercase text-neutral-400 hover:text-white"
                      >
                        Болдырмау
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-md bg-yellow-500 text-black text-[10px] tracking-wider uppercase font-semibold hover:bg-yellow-400"
                      >
                        Сақтау
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Main Fields Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="block font-sans text-xs tracking-wider text-neutral-400 uppercase">
                    Аты-жөніңіз
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="Мысалы: Асан Саматов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:border-yellow-500/50 focus:bg-white/[0.08] text-white placeholder-neutral-500 font-sans text-sm tracking-wide outline-none transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone-input" className="block font-sans text-xs tracking-wider text-neutral-400 uppercase">
                    Телефон нөміріңіз
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    required
                    placeholder="Мысалы: +7 (707) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:border-yellow-500/50 focus:bg-white/[0.08] text-white placeholder-neutral-500 font-sans text-sm tracking-wide outline-none transition-all"
                  />
                </div>

                {/* Attendance Status Radios */}
                <div className="space-y-2">
                  <span className="block font-sans text-xs tracking-wider text-neutral-400 uppercase">
                    Қатысу шешіміңіз
                  </span>
                  <div className="grid grid-cols-1 gap-3">
                    {/* Attend option */}
                    <button
                      type="button"
                      onClick={() => setStatus('will_attend')}
                      className={`flex items-center gap-3 w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        status === 'will_attend'
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 font-medium'
                          : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        status === 'will_attend'
                          ? 'border-yellow-500 bg-yellow-500 text-black'
                          : 'border-neutral-500 bg-transparent'
                      }`}>
                        {status === 'will_attend' && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <span className="font-sans text-sm">✅ Қуана келемін</span>
                    </button>

                    {/* Cannot attend option */}
                    <button
                      type="button"
                      onClick={() => setStatus('cannot_attend')}
                      className={`flex items-center gap-3 w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        status === 'cannot_attend'
                          ? 'border-red-500/50 bg-red-500/10 text-red-400 font-medium'
                          : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        status === 'cannot_attend'
                          ? 'border-red-500 bg-red-500 text-black'
                          : 'border-neutral-500 bg-transparent'
                      }`}>
                        {status === 'cannot_attend' && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <span className="font-sans text-sm">❌ Өкінішке қарай келе алмаймын</span>
                    </button>
                  </div>
                </div>

                {/* Gold Submission Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !status || !name || !phone}
                  className={`w-full relative py-3.5 rounded-xl font-sans tracking-[0.1em] text-sm font-semibold flex items-center justify-center gap-2 overflow-hidden group transition-all cursor-pointer ${
                    !status || !name || !phone
                      ? 'bg-neutral-800 text-neutral-500 border border-neutral-700/50 cursor-not-allowed'
                      : 'border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-yellow-400/20 to-yellow-500/10 text-yellow-300 hover:border-yellow-500/60 shadow-lg shadow-yellow-500/5 active:scale-[0.98]'
                  }`}
                  whileHover={!status || !name || !phone ? {} : { scale: 1.02 }}
                  whileTap={!status || !name || !phone ? {} : { scale: 0.98 }}
                >
                  {/* Light sweep animation */}
                  {status && name && phone && (
                    <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                  )}

                  {isSubmitting ? (
                    <span className="w-5 h-5 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>ЖАУАБЫМДЫ ЖІБЕРУ</span>
                      <Send className="w-4 h-4 text-yellow-400" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            /* Celebration Screen */
            <motion.div
              key="rsvp-submitted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-20 h-20 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-4xl text-yellow-400 mb-6 shadow-xl shadow-yellow-500/5"
              >
                🎉
              </motion.div>

              <h3 className="font-serif text-3xl font-light text-yellow-400">
                Рақмет!
              </h3>
              
              <div className="flex items-center gap-2 justify-center w-24 my-3 text-yellow-500/40">
                <Heart className="w-3 h-3 fill-current animate-pulse" />
                <span className="h-[1px] bg-yellow-500/20 flex-1" />
                <Heart className="w-3 h-3 fill-current animate-pulse" />
              </div>

              <p className="font-sans text-base text-neutral-200 font-medium tracking-wide">
                Жауабыңыз сәтті қабылданды.
              </p>
              
              <p className="font-sans text-sm text-neutral-400 mt-2 max-w-xs leading-relaxed">
                {status === 'will_attend'
                  ? 'Сізді салтанатты мерекемізде асыға күтеміз!'
                  : 'Түсіністік танытқаныңызға рақмет! Тілегіңізге алғыс білдіреміз.'}
              </p>

              <motion.button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-8 font-sans text-xs uppercase tracking-widest text-neutral-500 hover:text-yellow-400 cursor-pointer transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                ← Жауапты өзгерту
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
