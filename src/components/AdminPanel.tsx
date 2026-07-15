import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Trash2, Download, X, Lock, FileSpreadsheet, Smile, Frown, 
  Mail, Send, Check, AlertCircle, LogOut, CheckCircle2, RefreshCw
} from 'lucide-react';
import { initAuth, googleSignIn, logout, setAccessTokenInMemory } from '../lib/firebase';
import { sendEmail, getGmailProfile } from '../lib/gmailService';
import { User } from 'firebase/auth';

interface RSVP {
  name: string;
  phone: string;
  status: string;
  timestamp: string;
}

interface SentEmailLog {
  name: string;
  email: string;
  date: string;
  status: 'Жіберілді' | 'Қате';
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

  // Tabs: 'rsvps' | 'gmail'
  const [activeTab, setActiveTab] = useState<'rsvps' | 'gmail'>('rsvps');

  // Google & Gmail States
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [gmailProfile, setGmailProfile] = useState<{ emailAddress: string } | null>(null);
  const [isGmailLoading, setIsGmailLoading] = useState(false);

  // Invitation Form States
  const [guestName, setGuestName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailLang, setEmailLang] = useState<'kk' | 'ru'>('kk');
  const [customMessage, setCustomMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [mailError, setMailError] = useState('');

  // Sent logs list
  const [sentLogs, setSentLogs] = useState<SentEmailLog[]>([]);

  // Confirmation state
  const [showConfirmSend, setShowConfirmSend] = useState(false);
  const [showConfirmReport, setShowConfirmReport] = useState(false);

  // Initialize Auth listeners and load lists
  useEffect(() => {
    if (isOpen) {
      loadRsvps();
      loadSentLogs();
      
      // Initialize Firebase Auth
      const unsubscribe = initAuth(
        async (user, token) => {
          setGoogleUser(user);
          setGoogleToken(token);
          const profile = await getGmailProfile(token);
          if (profile) setGmailProfile(profile);
        },
        () => {
          setGoogleUser(null);
          setGoogleToken(null);
          setGmailProfile(null);
        }
      );
      return () => unsubscribe();
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

  const loadSentLogs = () => {
    try {
      const data = localStorage.getItem('wedding_sent_emails') || '[]';
      setSentLogs(JSON.parse(data));
    } catch (err) {
      console.error('Error loading sent email logs:', err);
    }
  };

  const saveSentLog = (log: SentEmailLog) => {
    try {
      const updated = [log, ...sentLogs];
      localStorage.setItem('wedding_sent_emails', JSON.stringify(updated));
      setSentLogs(updated);
    } catch (err) {
      console.error('Error saving sent email log:', err);
    }
  };

  const handleClearSentLogs = () => {
    if (window.confirm('Барлық жіберілген хаттар тарихын өшіргіңіз келеді ме?')) {
      localStorage.removeItem('wedding_sent_emails');
      setSentLogs([]);
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

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RSVP_Azat_Sabina_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google OAuth flow
  const handleGoogleSignIn = async () => {
    setIsGmailLoading(true);
    setMailError('');
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        const profile = await getGmailProfile(result.accessToken);
        if (profile) setGmailProfile(profile);
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setMailError('Google-мен кіру сәтсіз аяқталды.');
    } finally {
      setIsGmailLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setGoogleToken(null);
      setGmailProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Email template builder
  const getInvitationHtml = (name: string, lang: 'kk' | 'ru', message: string) => {
    const title = lang === 'kk' ? 'ҮЙЛЕНУ ТОЙҒА ШАҚЫРУ' : 'ПРИГЛАШЕНИЕ НА СВАДЬБУ';
    const greeting = lang === 'kk' ? `Құрметті ${name || '[Қонақтың аты]' }!` : `Дорогой(ая) ${name || '[Имя гостя]' }!`;
    const mainText = lang === 'kk' 
      ? 'Сіз(дер)ді ұлымыз <strong>АЗАТ</strong> пен келініміз <strong>САБИНАНЫҢ</strong> үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!'
      : 'Приглашаем Вас разделить с нами радость знаменательного события — свадьбы нашего сына <strong>АЗАТА</strong> и нашей невесты <strong>САБИНЫ</strong>! Будем рады видеть Вас среди наших почетных гостей!';
    const dateLabel = lang === 'kk' ? 'Той күні:' : 'Дата свадьбы:';
    const dateValue = lang === 'kk' ? '2026 жыл' : '2026 год';
    const descText = lang === 'kk'
      ? 'Интерактивті шақыруды ашу, жауап беру (RSVP), тойдың орналасқан жерін картадан көру және әсем әуенді тыңдау үшін төмендегі батырманы басыңыз:'
      : 'Чтобы открыть интерактивное приглашение, подтвердить свое присутствие (RSVP), посмотреть место проведения на карте и послушать праздничную музыку, нажмите на кнопку ниже:';
    const buttonLabel = lang === 'kk' ? 'ШАҚЫРУДЫ АШУ' : 'ОТКРЫТЬ ПРИГЛАШЕНИЕ';
    const hostsLabel = lang === 'kk' ? 'Той иелері: Қанат & Наргиз' : 'Хозяева торжества: Канат & Наргиз';

    return `
      <div style="background-color: #09090b; color: #ffffff; font-family: 'Georgia', serif; padding: 40px 20px; text-align: center; max-width: 550px; margin: 0 auto; border: 1px solid rgba(234,179,8,0.2); border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.85);">
        <div style="font-size: 36px; margin-bottom: 20px; text-shadow: 0 0 15px rgba(234,179,8,0.4);">💍</div>
        <h2 style="color: #eab308; font-weight: 300; letter-spacing: 4px; font-size: 18px; margin: 0 0 10px 0; text-transform: uppercase;">${title}</h2>
        <div style="width: 80px; height: 1px; background-color: rgba(234,179,8,0.4); margin: 15px auto;"></div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #e5e7eb; font-style: italic; margin-bottom: 25px;">
          ${greeting}
        </p>
        
        <p style="font-size: 14px; line-height: 1.7; color: #9ca3af; margin-bottom: 30px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          ${mainText}
        </p>

        <div style="background-color: #18181b; padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 30px;">
          <p style="margin: 0 0 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #eab308;">${dateLabel}</p>
          <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: bold;">${dateValue}</p>
        </div>

        ${message ? `<p style="font-size: 14px; color: #f3f4f6; font-style: italic; border-left: 2px solid #eab308; padding-left: 15px; text-align: left; margin: 20px 10px 30px 10px; line-height: 1.6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">"${message}"</p>` : ''}

        <p style="font-size: 12px; color: #6b7280; margin-bottom: 25px; line-height: 1.5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          ${descText}
        </p>

        <a href="https://ais-pre-2l3rct6zo5cfdakvtsccbu-186713857580.asia-east1.run.app" style="display: inline-block; background: linear-gradient(to right, #eab308, #ca8a04); color: #000000; text-decoration: none; padding: 14px 35px; font-size: 12px; font-weight: bold; border-radius: 12px; box-shadow: 0 4px 20px rgba(234,179,8,0.25); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          ${buttonLabel}
        </a>

        <div style="font-size: 11px; color: #4b5563; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          ${hostsLabel}
        </div>
      </div>
    `;
  };

  // Send single invitation
  const triggerSendEmail = () => {
    if (!guestName.trim()) {
      setMailError('Қонақтың атын енгізіңіз.');
      return;
    }
    if (!recipientEmail.trim() || !recipientEmail.includes('@')) {
      setMailError('Дұрыс электронды пошта енгізіңіз.');
      return;
    }
    setMailError('');
    setShowConfirmSend(true);
  };

  const handleSendInvitation = async () => {
    setShowConfirmSend(false);
    if (!googleToken) {
      setMailError('Google арқылы кіру қажет.');
      return;
    }

    setIsSendingEmail(true);
    setSuccessMessage('');
    setMailError('');

    const subject = emailLang === 'kk' 
      ? `Үйлену тойына шақыру: Азат пен Сабина` 
      : `Приглашение на свадьбу: Азат и Сабина`;
    
    const bodyHtml = getInvitationHtml(guestName, emailLang, customMessage);

    try {
      await sendEmail(googleToken, {
        to: recipientEmail,
        subject,
        bodyHtml
      });

      // Record in logs
      saveSentLog({
        name: guestName,
        email: recipientEmail,
        date: new Date().toLocaleString(),
        status: 'Жіберілді'
      });

      setSuccessMessage(`${guestName} үшін шақыру хаты сәтті жіберілді!`);
      setGuestName('');
      setRecipientEmail('');
      setCustomMessage('');
    } catch (err: any) {
      console.error('Failed to send email:', err);
      setMailError(`Хат жіберу сәтсіз аяқталды: ${err.message || err}`);
      
      saveSentLog({
        name: guestName,
        email: recipientEmail,
        date: new Date().toLocaleString(),
        status: 'Қате'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Send report to self
  const getReportHtml = (rsvpsList: RSVP[]) => {
    const total = rsvpsList.length;
    const attending = rsvpsList.filter(r => r.status.includes('Қуана')).length;
    const declined = rsvpsList.filter(r => r.status.includes('келе алмаймын')).length;

    const rows = rsvpsList.map((rsvp, idx) => `
      <tr style="border-bottom: 1px solid #27272a;">
        <td style="padding: 12px; color: #ffffff;">${idx + 1}</td>
        <td style="padding: 12px; color: #ffffff; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${rsvp.name}</td>
        <td style="padding: 12px; color: #9ca3af; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${rsvp.phone}</td>
        <td style="padding: 12px;">
          <span style="padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; ${
            rsvp.status.includes('Қуана') 
              ? 'background-color: rgba(234,179,8,0.15); color: #eab308; border: 1px solid rgba(234,179,8,0.2);' 
              : 'background-color: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.2);'
          }">
            ${rsvp.status.includes('Қуана') ? 'Келеді' : 'Келмейді'}
          </span>
        </td>
        <td style="padding: 12px; color: #6b7280; font-size: 11px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${rsvp.timestamp}</td>
      </tr>
    `).join('');

    return `
      <div style="background-color: #09090b; color: #ffffff; font-family: Arial, sans-serif; padding: 40px 20px; max-width: 650px; margin: 0 auto; border: 1px solid rgba(234,179,8,0.2); border-radius: 20px;">
        <h2 style="color: #eab308; font-weight: bold; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; margin-bottom: 20px;">
          📊 RSVP жауаптары бойынша есеп
        </h2>
        
        <p style="font-size: 14px; color: #9ca3af; margin-bottom: 25px;">
          Азат пен Сабинаның үйлену тойына жиналған RSVP жауаптарының соңғы тізімі.
        </p>

        <div style="display: table; width: 100%; margin-bottom: 30px; border-spacing: 10px 0;">
          <div style="display: table-cell; background-color: #18181b; padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
            <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Жалпы саны</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #ffffff;">${total}</p>
          </div>
          <div style="display: table-cell; background-color: #18181b; padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
            <p style="margin: 0; font-size: 11px; color: #eab308; text-transform: uppercase; letter-spacing: 1px;">Келетіндер</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #eab308;">${attending}</p>
          </div>
          <div style="display: table-cell; background-color: #18181b; padding: 15px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
            <p style="margin: 0; font-size: 11px; color: #ef4444; text-transform: uppercase; letter-spacing: 1px;">Келмейтіндер</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #ef4444;">${declined}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 2px solid rgba(255,255,255,0.05); color: #eab308;">
              <th style="padding: 12px;">#</th>
              <th style="padding: 12px;">Аты-жөні</th>
              <th style="padding: 12px;">Телефон</th>
              <th style="padding: 12px;">Жауап</th>
              <th style="padding: 12px;">Уақыты</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length > 0 ? rows : `<tr><td colspan="5" style="text-align: center; padding: 30px; color: #4b5563;">Әзірге RSVP жауаптары түскен жоқ.</td></tr>`}
          </tbody>
        </table>

        <div style="font-size: 11px; color: #4b5563; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; text-align: center;">
          Шақыру хаттары Gmail арқылы жіберілді • Қанат & Наргиз
        </div>
      </div>
    `;
  };

  const triggerSendReport = () => {
    if (rsvps.length === 0) {
      setMailError('Жіберетін RSVP жауаптары жоқ.');
      return;
    }
    setMailError('');
    setShowConfirmReport(true);
  };

  const handleSendReport = async () => {
    setShowConfirmReport(false);
    if (!googleToken || !gmailProfile) {
      setMailError('Google арқылы кіру қажет.');
      return;
    }

    setIsSendingReport(true);
    setSuccessMessage('');
    setMailError('');

    try {
      await sendEmail(googleToken, {
        to: gmailProfile.emailAddress,
        subject: `📊 RSVP Есеп: Азат пен Сабинаның үйлену тойы`,
        bodyHtml: getReportHtml(rsvps)
      });
      setSuccessMessage(`RSVP есебі өз поштаңызға (${gmailProfile.emailAddress}) сәтті жіберілді!`);
    } catch (err: any) {
      console.error('Failed to send report:', err);
      setMailError(`Есеп жіберу сәтсіз аяқталды: ${err.message || err}`);
    } finally {
      setIsSendingReport(false);
    }
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
          className="fixed inset-0 z-110 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white cursor-pointer z-20"
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
                Жауаптар мен Gmail шақыруларды басқару үшін құпия сөзді енгізіңіз
              </p>

              <div className="space-y-4 text-left">
                <input
                  type="password"
                  placeholder="Құпия сөзді жазыңыз (мыс: 2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-center text-white placeholder-neutral-500 focus:border-yellow-500/50 outline-none font-sans"
                  autoFocus
                />
                {error && <p className="text-xs text-red-400 text-center font-sans">{error}</p>}
                
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/15 to-yellow-500/10 text-yellow-400 font-sans tracking-wider text-xs font-semibold cursor-pointer hover:bg-yellow-500/20 active:scale-[0.98]"
                >
                  КІРУ
                </button>
              </div>
            </motion.form>
          ) : (
            /* Main Administrative Dashboard Panel */
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-3xl rounded-3xl border border-yellow-500/20 bg-neutral-950/95 p-4 sm:p-6 shadow-2xl flex flex-col h-[90vh] sm:h-[85vh] overflow-hidden"
            >
              {/* Tab Selector & Header */}
              <div className="flex flex-col border-b border-white/10 pb-4 mb-4 gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-light text-yellow-400">
                      Басқару панелі
                    </h3>
                    <p className="font-sans text-[11px] sm:text-xs text-neutral-400">
                      Азат пен Сабинаның үйлену тойының ұйымдастыру орталығы
                    </p>
                  </div>
                </div>

                {/* Elegant Navigation Tabs */}
                <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'rsvps'
                        ? 'bg-yellow-500 text-neutral-950 font-semibold shadow-lg'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Users className="w-4 h-4" /> Қонақтар тізімі ({rsvps.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('gmail')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'gmail'
                        ? 'bg-yellow-500 text-neutral-950 font-semibold shadow-lg'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Mail className="w-4 h-4" /> Gmail Шақырулар
                  </button>
                </div>
              </div>

              {/* Dynamic Tab Body */}
              <div className="flex-1 overflow-y-auto pr-1">
                {activeTab === 'rsvps' ? (
                  /* TAB 1: RSVPs LIST */
                  <div className="space-y-4">
                    {/* Actions and Export */}
                    <div className="flex justify-between items-center gap-2 bg-neutral-900/60 p-3 rounded-2xl border border-white/5">
                      <span className="font-sans text-xs text-neutral-400">Деректерді сақтау және тазалау:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={exportToCSV}
                          disabled={rsvps.length === 0}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-[11px] font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Excel/CSV
                        </button>
                        <button
                          onClick={handleClearAll}
                          disabled={rsvps.length === 0}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[11px] font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Барлығын өшіру
                        </button>
                      </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                        <p className="font-sans text-[9px] text-neutral-400 uppercase tracking-widest">Барлығы</p>
                        <p className="font-serif text-xl sm:text-2xl text-white font-medium mt-0.5">{rsvps.length}</p>
                      </div>
                      <div className="p-3 rounded-2xl border border-yellow-500/10 bg-yellow-500/[0.02] text-center flex flex-col items-center justify-center">
                        <span className="font-sans text-[9px] text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                          <Smile className="w-3 h-3" /> Келетіндер
                        </span>
                        <p className="font-serif text-xl sm:text-2xl text-yellow-400 font-semibold mt-0.5">{totalAttending}</p>
                      </div>
                      <div className="p-3 rounded-2xl border border-red-500/10 bg-red-500/[0.02] text-center flex flex-col items-center justify-center">
                        <span className="font-sans text-[9px] text-red-400 uppercase tracking-widest flex items-center gap-1">
                          <Frown className="w-3 h-3" /> Келмейтіндер
                        </span>
                        <p className="font-serif text-xl sm:text-2xl text-red-400 font-semibold mt-0.5">{totalDeclined}</p>
                      </div>
                    </div>

                    {/* RSVP List Table */}
                    <div className="text-sm text-neutral-300">
                      {rsvps.length === 0 ? (
                        <div className="text-center py-16 text-neutral-500">
                          <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-20 text-yellow-400" />
                          <p className="font-sans text-xs">Әзірге RSVP жауаптары түскен жоқ.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {rsvps.map((rsvp, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-neutral-900/40 hover:border-yellow-500/10 transition-all"
                            >
                              <div className="space-y-0.5 pr-4">
                                <p className="font-sans font-medium text-white text-sm">{rsvp.name}</p>
                                <p className="font-sans text-xs text-neutral-400">{rsvp.phone}</p>
                                <p className="text-[10px] text-neutral-500 font-sans">{rsvp.timestamp}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-sans ${
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
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* TAB 2: GMAIL INTEGRATION */
                  <div className="space-y-6">
                    {/* OAuth Connection Status card */}
                    <div className="border border-white/5 bg-neutral-900/60 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      {googleUser && gmailProfile ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="font-sans text-xs text-neutral-400">Қосылған Gmail аккаунт:</p>
                            <p className="font-sans text-sm font-semibold text-white">{gmailProfile.emailAddress}</p>
                            <p className="font-sans text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Шақыру жіберуге дайын
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-left flex-1">
                          <p className="font-serif text-base text-yellow-400 font-light">Gmail арқылы шақыру жіберу</p>
                          <p className="font-sans text-xs text-neutral-400 mt-1">
                            Қонақтарға өз атыңыздан Gmail арқылы жеке интерактивті шақыру хаттарын жіберіңіз және RSVP есебін өз поштаңызға алыңыз.
                          </p>
                        </div>
                      )}

                      <div>
                        {googleUser ? (
                          <div className="flex gap-2">
                            <button
                              onClick={triggerSendReport}
                              disabled={isSendingReport || rsvps.length === 0}
                              className="px-3 py-1.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-semibold cursor-pointer flex items-center gap-1"
                            >
                              {isSendingReport ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
                              Есепті поштаға жіберу
                            </button>
                            <button
                              onClick={handleGoogleLogout}
                              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                              title="Выйти"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={handleGoogleSignIn}
                            disabled={isGmailLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-neutral-950 rounded-xl font-sans text-xs font-semibold cursor-pointer hover:bg-yellow-400 transition-all shadow-lg active:scale-95"
                          >
                            {isGmailLoading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                              </svg>
                            )}
                            Google аккаунтты қосу
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Messages Banner */}
                    {successMessage && (
                      <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2 font-sans">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{successMessage}</span>
                      </div>
                    )}

                    {mailError && (
                      <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-center gap-2 font-sans">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{mailError}</span>
                      </div>
                    )}

                    {googleUser && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Send Invitation Form */}
                        <div className="space-y-4 border border-white/5 bg-neutral-900/40 p-4 rounded-2xl text-left">
                          <h4 className="font-serif text-sm text-yellow-400 uppercase tracking-widest border-b border-white/5 pb-2">
                            Жаңа шақыру хат
                          </h4>
                          
                          <div className="space-y-3 font-sans text-xs">
                            <div>
                              <label className="block text-neutral-400 mb-1">Қонақтың аты-жөні:</label>
                              <input
                                type="text"
                                placeholder="Мысалы: Бауыржан мырза"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder-neutral-500 focus:border-yellow-500/50 outline-none text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-neutral-400 mb-1">Қонақтың Эл. поштасы:</label>
                              <input
                                type="email"
                                placeholder="guest@example.com"
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder-neutral-500 focus:border-yellow-500/50 outline-none text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-neutral-400 mb-1">Хат тілі:</label>
                                <select
                                  value={emailLang}
                                  onChange={(e) => setEmailLang(e.target.value as 'kk' | 'ru')}
                                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/40 text-white focus:border-yellow-500/50 outline-none text-xs"
                                >
                                  <option value="kk">Қазақша (kk)</option>
                                  <option value="ru">Русский (ru)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-neutral-400 mb-1">Шақыру түрі:</label>
                                <select
                                  onChange={(e) => {
                                    if (e.target.value === '1') {
                                      setCustomMessage(emailLang === 'kk' ? 'Отбасымызбен салтанатты жиынның қадірлі қонағы болуға шақырамыз.' : 'Семьей приглашаем вас стать почетным гостем.');
                                    } else if (e.target.value === '2') {
                                      setCustomMessage(emailLang === 'kk' ? 'Сіздерді тойымыздың қуанышты сәтін бірге бөлісуге асыға күтеміз!' : 'Ждем вас с нетерпением, чтобы разделить моменты нашего счастья!');
                                    } else {
                                      setCustomMessage('');
                                    }
                                  }}
                                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/40 text-white focus:border-yellow-500/50 outline-none text-xs"
                                >
                                  <option value="">Еркін хабарлама</option>
                                  <option value="1">Ресми шақыру</option>
                                  <option value="2">Ыстық лебіз</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-neutral-400 mb-1">Арнайы ыстық лебіз немесе ескерту (міндетті емес):</label>
                              <textarea
                                placeholder="Мысалы: Бауырлар, сағат 18:00-ден кешікпей келіңіздер!"
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/40 text-white placeholder-neutral-500 focus:border-yellow-500/50 outline-none text-xs resize-none"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={triggerSendEmail}
                              disabled={isSendingEmail}
                              className="w-full mt-2 py-2.5 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/15 to-yellow-500/10 text-yellow-400 font-sans tracking-wider text-xs font-semibold cursor-pointer hover:bg-yellow-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                              {isSendingEmail ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                              GMAIL-МЕН ШАҚЫРУ ЖІБЕРУ
                            </button>
                          </div>
                        </div>

                        {/* Real-time Email Preview card */}
                        <div className="space-y-4 flex flex-col h-full">
                          <h4 className="font-serif text-xs text-neutral-400 uppercase tracking-widest text-left">
                            Хаттың сыртқы түрі (Превью)
                          </h4>
                          
                          <div className="flex-1 border border-white/5 bg-neutral-950 p-4 rounded-2xl overflow-y-auto max-h-[300px] text-xs shadow-inner">
                            {/* Embedded HTML rendering simulation inside iframe */}
                            <div 
                              className="bg-black/90 p-4 rounded-xl border border-white/5 text-left text-neutral-200"
                              dangerouslySetInnerHTML={{ __html: getInvitationHtml(guestName, emailLang, customMessage) }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sent emails log table */}
                    <div className="border border-white/5 bg-neutral-900/20 p-4 rounded-2xl text-left">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                        <h4 className="font-serif text-sm text-yellow-400 uppercase tracking-widest">
                          Жіберілген хаттар тарихы ({sentLogs.length})
                        </h4>
                        {sentLogs.length > 0 && (
                          <button
                            onClick={handleClearSentLogs}
                            className="text-[10px] text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            Тарихты тазалау
                          </button>
                        )}
                      </div>

                      {sentLogs.length === 0 ? (
                        <div className="text-center py-6 text-neutral-500 font-sans text-xs">
                          Жіберілген хаттар тізімі бос.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 text-xs">
                          {sentLogs.map((log, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 rounded-lg border border-white/5 bg-black/20">
                              <div className="font-sans">
                                <p className="font-medium text-white">{log.name}</p>
                                <p className="text-[10px] text-neutral-400">{log.email} • {log.date}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-semibold font-sans ${
                                log.status === 'Жіберілді' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {log.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick note footer */}
              <div className="border-t border-white/5 pt-3 mt-3 flex items-center justify-between text-[10px] text-neutral-500 font-sans">
                <span>Құпия сөз: 2026</span>
                <span>Қанат & Наргиз • Азат & Сабина</span>
              </div>
            </motion.div>
          )}

          {/* Explicit User Confirmation Modal for Mutating Email Action */}
          {showConfirmSend && (
            <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm rounded-2xl border border-yellow-500/30 bg-neutral-900 p-6 shadow-2xl text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto border border-yellow-500/25">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-yellow-400">Шақыру хатты жіберуді растау</h4>
                <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                  Сіз <strong>{guestName}</strong> қонағына ({recipientEmail}) Gmail аккаунтыңыз арқылы ресми үйлену тойына шақыру хатын жіберуді растайсыз ба?
                </p>
                <div className="flex gap-2 font-sans text-xs pt-2">
                  <button
                    onClick={() => setShowConfirmSend(false)}
                    className="flex-1 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors"
                  >
                    Бас тарту
                  </button>
                  <button
                    onClick={handleSendInvitation}
                    className="flex-1 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-semibold cursor-pointer transition-colors"
                  >
                    Растаймын
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Explicit User Confirmation Modal for RSVP Report */}
          {showConfirmReport && (
            <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm rounded-2xl border border-yellow-500/30 bg-neutral-900 p-6 shadow-2xl text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto border border-yellow-500/25">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-yellow-400">Есепті жіберуді растау</h4>
                <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                  Барлық {rsvps.length} RSVP жауаптары жинақталған толық кестені өз поштаңызға ({gmailProfile?.emailAddress}) жіберуді растайсыз ба?
                </p>
                <div className="flex gap-2 font-sans text-xs pt-2">
                  <button
                    onClick={() => setShowConfirmReport(false)}
                    className="flex-1 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors"
                  >
                    Бас тарту
                  </button>
                  <button
                    onClick={handleSendReport}
                    className="flex-1 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-semibold cursor-pointer transition-colors"
                  >
                    Растаймын
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
