import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export default function Countdown() {
  const targetDate = new Date('2026-11-28T17:00:00+05:00'); // Karaganda/Kazakhstan time zone is UTC+5

  const calculateTimeLeft = (): TimeLeft => {
    const difference = targetDate.getTime() - Date.now();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isCompleted: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const timeItems = [
    { label: 'Күн', value: timeLeft.days, id: 'days' },
    { label: 'Сағат', value: timeLeft.hours, id: 'hours' },
    { label: 'Минут', value: timeLeft.minutes, id: 'minutes' },
    { label: 'Секунд', value: timeLeft.seconds, id: 'seconds' },
  ];

  if (timeLeft.isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-yellow-500/20 bg-black/40 backdrop-blur-md rounded-2xl">
        <p className="font-serif text-2xl text-yellow-400 font-medium tracking-widest uppercase">
          Той басталды!
        </p>
        <p className="font-sans text-sm text-gray-300 mt-2">
          Азат пен Сабинаға бақыт тілейміз!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Small heading */}
      <div className="text-center mb-6">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-yellow-500/80">
          Салтанатты сәтке дейін:
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4 justify-center items-center">
        {timeItems.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center justify-center aspect-square rounded-2xl border border-yellow-500/15 bg-neutral-950/50 backdrop-blur-md shadow-xl p-2 sm:p-3 overflow-hidden"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Soft inner golden glow */}
            <div className="absolute inset-0 bg-radial from-yellow-500/5 to-transparent pointer-events-none" />

            {/* Time Number */}
            <div className="relative font-serif text-2xl sm:text-4xl font-normal tracking-tight text-yellow-400 select-none">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={item.value}
                  initial={{ y: 25, opacity: 0, filter: 'blur(2px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -25, opacity: 0, filter: 'blur(2px)' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="inline-block"
                >
                  {formatNumber(item.value)}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Label in Kazakh */}
            <span className="relative font-sans text-[10px] sm:text-xs tracking-[0.1em] text-neutral-400 uppercase mt-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
