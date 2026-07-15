import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Trash2, Download, X, Lock, FileSpreadsheet, Smile, Frown } from 'lucide-react';

interface RSVP {
  name: string;
  phone: string;
  status: string;
  timestamp: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadRsvps();
    }
  }, [isOpen]);

  const loadRsvps = () => {
    try {
      const data = localStorage.getItem('wedding_rsvps') || '[]';
      setRsvps(JSON.parse(data));
    } catch (err) {
      console.error('Error loading RSVPs:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Қате құпия сөз. Қайталап көріңіз (той жылы).');
      setPasscode('');
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Бұл жазбаны өшіруге сенімдісіз бе?')) {
      const updated = [...rsvps];
      updated.splice(index, 1);
      localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
      setRsvps(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('ЕСКЕРТУ: Барлық жауаптарды өшіргіңіз келеді ме? Мұны қайтару мүмкін емес.')) {
      localStorage.removeItem('wedding_rsvps');
      setRsvps([]);
    }
  };

  const exportToCSV = () => {
    if (rsvps.length === 0) return;

    // CSV header and content
    const headers = ['Аты-жөні', 'Телефон нөмірі', 'Жауабы', 'Уақыты'];
    const csvRows = [
      headers.join(','),
      ...rsvps.map(row => [
        `"${row.name.replace(/"/g, '""')}"`,
        `"${row.phone.replace(/"/g, '""')}"`,
        `"${row.status.replace(/"/g, '""')}"`,
        `"${row.timestamp.replace(/"/g, '""')}"`
      ].join(','))
    ];

    const csvContent = '\uFEFF' + csvRows.join('\n'); // Add BOM for Excel UTF-8 support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RSVP_Azat_Sabina_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAttending = rsvps.filter(r => r.status.includes('Қуана')).length;
  const totalDeclined = rsvps.filter(r => r.status.includes('келе алмаймын')).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="admin-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-110 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {!isAuthenticated ? (
            /* Passcode Form */
            <motion.form
              onSubmit={handleLogin}
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-sm rounded-3xl border border-yellow-500/20 bg-neutral-950 p-6 sm:p-8 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mx-auto mb-4 border border-yellow-500/25">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-serif text-xl font-light text-yellow-400">
                Той иелеріне арналған
              </h3>
              <p className="font-sans text-xs text-neutral-400 mt-1 mb-6">
                Жауаптар тізімін көру үшін құпия сөзді енгізіңіз
              </p>

              <div className="space-y-4 text-left">
                <input
                  type="password"
                  placeholder="Құпия сөзді жазыңыз (мыс: 2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-center text-white placeholder-neutral-500 focus:border-yellow-500/50 outline-none"
                  autoFocus
                />
                {error && <p className="text-xs text-red-400 text-center">{error}</p>}
                
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/15 to-yellow-500/10 text-yellow-400 font-sans tracking-wider text-xs font-semibold cursor-pointer hover:bg-yellow-500/20 active:scale-[0.98]"
                >
                  КІРУ
                </button>
              </div>
            </motion.form>
          ) : (
            /* RSVP Database Board */
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl border border-yellow-500/20 bg-neutral-950/95 p-6 shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 mb-6 gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-light text-yellow-400 flex items-center gap-2">
                    <Users className="w-6 h-6 text-yellow-500" /> Қонақтар тізімі
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 mt-1">
                    Азат пен Сабинаның үйлену тойына RSVP жауаптары
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={exportToCSV}
                    disabled={rsvps.length === 0}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Excel/CSV
                  </button>
                  <button
                    onClick={handleClearAll}
                    disabled={rsvps.length === 0}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Тізімді тазалау
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                  <p className="font-sans text-[10px] text-neutral-400 uppercase tracking-widest">Барлығы</p>
                  <p className="font-serif text-xl sm:text-2xl text-white font-medium mt-1">{rsvps.length}</p>
                </div>
                <div className="p-3 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.02] text-center flex flex-col items-center justify-center">
                  <span className="font-sans text-[10px] text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                    <Smile className="w-3 h-3" /> Келетіндер
                  </span>
                  <p className="font-serif text-xl sm:text-2xl text-yellow-400 font-semibold mt-1">{totalAttending}</p>
                </div>
                <div className="p-3 rounded-xl border border-red-500/10 bg-red-500/[0.02] text-center flex flex-col items-center justify-center">
                  <span className="font-sans text-[10px] text-red-400 uppercase tracking-widest flex items-center gap-1">
                    <Frown className="w-3 h-3" /> Келе алмайтындар
                  </span>
                  <p className="font-serif text-xl sm:text-2xl text-red-400 font-semibold mt-1">{totalDeclined}</p>
                </div>
              </div>

              {/* Table / List area */}
              <div className="flex-1 overflow-y-auto pr-1 text-sm text-neutral-300">
                {rsvps.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-sans text-sm">Әзірге RSVP жауаптары түскен жоқ.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rsvps.map((rsvp, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-neutral-900/40 hover:border-yellow-500/10 transition-colors"
                      >
                        <div className="space-y-1 pr-4">
                          <p className="font-sans font-medium text-white">{rsvp.name}</p>
                          <p className="font-sans text-xs text-neutral-400">{rsvp.phone}</p>
                          <p className="text-[10px] text-neutral-500">{rsvp.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            rsvp.status.includes('Қуана')
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {rsvp.status.includes('Қуана') ? 'Келеді' : 'Келмейді'}
                          </span>
                          <button
                            onClick={() => handleDelete(idx)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick note */}
              <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-[11px] text-neutral-500 font-sans">
                <span>Passcode: 2026</span>
                <span>* Жауаптар жергілікті дерекқорда сақталады</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
