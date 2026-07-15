import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MUSIC_URL } from '../types';

interface AudioPlayerProps {
  shouldPlay: boolean;
  onPlayStateChange?: (playing: boolean) => void;
}

export default function AudioPlayer({ shouldPlay, onPlayStateChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Synchronize play state with parent request (e.g. when opening the invitation)
  useEffect(() => {
    if (shouldPlay && audioRef.current) {
      attemptPlay();
    }
  }, [shouldPlay]);

  const attemptPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setShowPrompt(false);
        if (onPlayStateChange) onPlayStateChange(true);
      })
      .catch((error) => {
        console.warn('Autoplay blocked by browser:', error);
        setShowPrompt(true);
        setIsPlaying(false);
        if (onPlayStateChange) onPlayStateChange(false);
      });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    } else {
      attemptPlay();
    }
  };

  // Close prompt when user taps anywhere on screen to trigger music
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (showPrompt && !isPlaying) {
        attemptPlay();
      }
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [showPrompt, isPlaying]);

  return (
    <>
      {/* Hidden Audio elements (music.mp3 with fallback to MUSIC_URL) */}
      <audio id="bgMusic" ref={audioRef} loop preload="auto">
        <source src="music.mp3" type="audio/mpeg" />
        <source src={MUSIC_URL} type="audio/mpeg" />
        Таспаны ойнату браузеріңізде қолданылмайды.
      </audio>

      {/* Floating Visualizer/Control Button */}
      <div id="audio-control" className="fixed top-6 right-6 z-50">
        <motion.button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-12 h-12 rounded-full border border-yellow-500/30 bg-black/60 text-yellow-500 shadow-lg shadow-yellow-500/10 backdrop-blur-md cursor-pointer hover:border-yellow-500/60 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="relative"
            >
              <Volume2 className="w-5 h-5" />
              {/* Spectrum visualizer rays around button */}
              <span className="absolute -inset-2 rounded-full border border-yellow-500/20 animate-ping" />
            </motion.div>
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}

          {/* Luxury visual spectrum bar indicator inside */}
          {isPlaying && (
            <div className="absolute bottom-1.5 flex gap-0.5 justify-center items-end h-2 w-5">
              <span className="w-[1.5px] bg-yellow-500 rounded-full animate-bounce [animation-duration:0.6s]" />
              <span className="w-[1.5px] bg-yellow-500 rounded-full animate-bounce [animation-duration:0.4s]" />
              <span className="w-[1.5px] bg-yellow-500 rounded-full animate-bounce [animation-duration:0.8s]" />
              <span className="w-[1.5px] bg-yellow-500 rounded-full animate-bounce [animation-duration:0.5s]" />
            </div>
          )}
        </motion.button>
      </div>

      {/* Autoplay Blocked Floating Banner */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            id="autoplay-prompt"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-80 p-4 z-50 rounded-2xl border border-yellow-500/30 bg-black/90 text-yellow-100 shadow-2xl shadow-yellow-500/10 backdrop-blur-lg flex items-center gap-3 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/15 flex items-center justify-center text-yellow-500">
              <Music className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 text-sm font-sans">
              <p className="font-medium text-yellow-400">🎵 Әуен өшірулі тұр</p>
              <p className="text-xs text-gray-300 mt-0.5">Музыканы қосу үшін экранды бір рет түртіңіз немесе осы жерді басыңыз.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
