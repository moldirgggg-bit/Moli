import { MapPin, Navigation, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export default function GoogleMap() {
  // Coordinates/Query for "Камила мейрамханасы, Қарағанды"
  const addressQuery = 'Камила мейрамханасы, Қарағанды, Қазақстан';
  const encodedQuery = encodeURIComponent(addressQuery);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

  // Embedded map showing Karaganda, Kamila Restaurant
  const iframeSrc = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div
        id="maps-card-container"
        className="relative rounded-3xl border border-yellow-500/15 bg-neutral-950/65 overflow-hidden shadow-2xl p-4 sm:p-6"
        style={{
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Soft radial golden background glow */}
        <div className="absolute inset-0 bg-radial from-yellow-500/5 via-transparent to-transparent pointer-events-none" />

        {/* Header Address Info */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-3 border border-yellow-500/25">
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
          <h4 className="font-serif text-xl font-light text-yellow-400">
            Мекенжайымыз
          </h4>
          <p className="font-sans text-sm text-neutral-200 mt-2 font-medium tracking-wide">
            Қарағанды қаласы, "Камила" мейрамханасы
          </p>
          <p className="font-sans text-xs text-neutral-400 mt-1">
            (Қарағанды қаласы, Мұстафин көшесі немесе Ермеков көшесі)
          </p>
        </div>

        {/* Responsive Map Frame Container */}
        <div className="relative aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-lg bg-neutral-900 mb-6">
          <iframe
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) opacity(85%) brightness(90%)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Камила мейрамханасы картасы"
          />
          {/* Compass layout icon */}
          <div className="absolute top-4 right-4 p-2 bg-black/80 rounded-full border border-yellow-500/30 text-yellow-500 animate-spin [animation-duration:15s] pointer-events-none">
            <Compass className="w-4 h-4" />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <motion.a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full sm:w-auto px-6 py-3 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-yellow-400/20 to-yellow-500/10 text-yellow-300 font-sans tracking-[0.1em] text-xs font-semibold flex items-center justify-center gap-2 overflow-hidden group shadow-md shadow-yellow-500/5 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer light effect */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer pointer-events-none" />

            <Navigation className="w-4 h-4 text-yellow-400" />
            <span>КАРТАНЫ АШУ (GOOGLE MAPS)</span>
          </motion.a>

          {/* Fallback 2GIS / Navigation message */}
          <p className="text-[10px] font-sans text-neutral-500 uppercase tracking-widest text-center mt-2 sm:mt-0">
            * Ұялы телефоннан навигация үшін басыңыз
          </p>
        </div>
      </div>
    </div>
  );
}
