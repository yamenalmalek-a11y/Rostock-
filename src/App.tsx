import React, { useState, useEffect, useRef } from 'react';
import { Language } from './utils/translations';
import { getCurrentPrayers } from './utils/prayerTimes';
import { Header } from './components/Header';
import { HeroAnnouncement } from './components/HeroAnnouncement';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { CardGenerator } from './components/CardGenerator';
import { JanazahNoticeStudio } from './components/JanazahNoticeStudio';
import { MosquesDirectory } from './components/MosquesDirectory';
import { DuasAndQuranSection } from './components/DuasAndQuranSection';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { InstallAppModal, OfflineIndicator } from './components/InstallAppModal';
import { ActiveAdhanBanner, AdhanPermissionPrompt } from './components/AdhanControls';
import { useAdhanPlayer } from './hooks/useAdhanPlayer';
import { syncDailyPrayerSchedule, DailySyncRecord } from './utils/dailySync';
import { Clock, Volume2, Palette, FileText, MapPin, BookOpen } from 'lucide-react';

function getInitialUrlParams(): { lang: Language; recipient: string; openInstall: boolean } {
  if (typeof window === 'undefined') return { lang: 'ar', recipient: '', openInstall: false };
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang') === 'de' ? 'de' : 'ar';
  const to = params.get('to')?.trim() || '';
  const openInstall = params.get('install') === '1' || params.get('install') === 'true';
  return { lang: urlLang, recipient: to, openInstall };
}

export default function App() {
  const initialParams = getInitialUrlParams();
  const [lang, setLang] = useState<Language>(initialParams.lang);
  const [personalizedRecipient] = useState<string>(initialParams.recipient);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(initialParams.openInstall);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [permissionBannerDismissed, setPermissionBannerDismissed] = useState(false);
  const [prayerData, setPrayerData] = useState(() => getCurrentPrayers());
  const [syncRecord, setSyncRecord] = useState<DailySyncRecord>(() => syncDailyPrayerSchedule());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<AudioContext | null>(null);

  const stopQuranAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (synthRef.current && synthRef.current.state !== 'closed') {
      synthRef.current.close().catch(() => {});
    }
    setIsPlayingAudio(false);
  };

  const adhanController = useAdhanPlayer(
    prayerData.prayers,
    prayerData.rostockNow.isoDate,
    lang,
    stopQuranAudio
  );

  // Synchronize document language and direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Manual or automatic daily sync refresh
  const handleForceSyncNow = () => {
    const now = new Date();
    setPrayerData(getCurrentPrayers(now));
    setSyncRecord(syncDailyPrayerSchedule(true, now));
  };

  // Update prayer times every second + auto-sync immediately when day rolls over or app wakes from sleep
  useEffect(() => {
    const refreshTimesAndSync = (force = false) => {
      const now = new Date();
      const fresh = getCurrentPrayers(now);
      setPrayerData(fresh);
      setSyncRecord(prev => {
        if (force || prev.syncedIsoDate !== fresh.rostockNow.isoDate) {
          return syncDailyPrayerSchedule(force || prev.syncedIsoDate !== fresh.rostockNow.isoDate, now);
        }
        return prev;
      });
    };

    const timer = setInterval(() => {
      refreshTimesAndSync(false);
    }, 1000);

    const handleWakeOrOnline = () => refreshTimesAndSync(false);
    document.addEventListener('visibilitychange', handleWakeOrOnline);
    window.addEventListener('focus', handleWakeOrOnline);
    window.addEventListener('online', handleWakeOrOnline);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleWakeOrOnline);
      window.removeEventListener('focus', handleWakeOrOnline);
      window.removeEventListener('online', handleWakeOrOnline);
    };
  }, []);

  // Web Audio Synthesizer Fallback
  const playHarmonicAmbient = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      synthRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(146.83, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      return () => {
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        setTimeout(() => {
          osc.stop();
          ctx.close();
        }, 500);
      };
    } catch {
      return () => {};
    }
  };

  // Toggle Audio Recitation
  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopQuranAudio();
    } else {
      adhanController.stopAdhan();
      setIsPlayingAudio(true);
      const audio = new Audio('https://everyayah.com/data/Alafasy_128kbps/002185.mp3');
      audioRef.current = audio;

      audio.play().catch(() => {
        playHarmonicAmbient();
      });

      audio.onended = () => {
        setIsPlayingAudio(false);
      };

      audio.onerror = () => {
        playHarmonicAmbient();
      };
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (synthRef.current && synthRef.current.state !== 'closed') {
        synthRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleToggleLang = () => {
    setLang(prev => (prev === 'ar' ? 'de' : 'ar'));
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const nextPrayerName = lang === 'ar' ? prayerData.nextPrayer.nameAr : prayerData.nextPrayer.nameDe;
  const timeRemainingStr = `${pad(prayerData.timeUntilNext.hours)}:${pad(prayerData.timeUntilNext.minutes)}`;

  return (
    <div className={`min-h-screen bg-islamic-pattern text-[#f1f5f0] ${lang === 'ar' ? 'font-cairo' : 'font-sans-de'}`}>
      {/* Top Bar */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={toggleAudio}
        nextPrayerName={nextPrayerName}
        timeRemainingStr={timeRemainingStr}
        onOpenShare={() => setShareModalOpen(true)}
        onOpenInstall={() => setInstallModalOpen(true)}
      />

      {/* Proactive Permission Prompt for Auto-Adhan & Prayer Notifications */}
      <AdhanPermissionPrompt
        lang={lang}
        visible={adhanController.settings.enabled && !adhanController.permissionsReady && !permissionBannerDismissed}
        onGrant={adhanController.requestAllPermissions}
        onDismiss={() => setPermissionBannerDismissed(true)}
      />

      <main>
        {/* 1. Official Proclamation & Greeting (Compact on Mobile) */}
        <HeroAnnouncement
          lang={lang}
          isPlayingAudio={isPlayingAudio}
          onToggleAudio={toggleAudio}
          onOpenCardStudio={() => scrollTo('card-studio')}
          onOpenPrayerTimes={() => scrollTo('prayer-times')}
          onOpenShare={() => setShareModalOpen(true)}
          personalizedRecipient={personalizedRecipient}
        />

        {/* 2. Rostock Prayer Times, Adhan Voices & 10-Year Schedule */}
        <PrayerTimesSection
          lang={lang}
          data={prayerData}
          syncRecord={syncRecord}
          onSyncNow={handleForceSyncNow}
          adhan={adhanController}
        />

        {/* 3. Personalized Greeting Card Studio (Custom Text & Preview-First on Mobile) */}
        <CardGenerator lang={lang} />

        {/* 4. Official Janazah & Obituary Notice Studio */}
        <JanazahNoticeStudio lang={lang} />

        {/* 5. Official Mosques in Rostock */}
        <MosquesDirectory lang={lang} />

        {/* 5. Authentic Ramadan Duas */}
        <DuasAndQuranSection lang={lang} />
      </main>

      {/* Institutional Footer */}
      <Footer
        lang={lang}
        onOpenShare={() => setShareModalOpen(true)}
        onOpenInstall={() => setInstallModalOpen(true)}
      />

      {/* Mobile Bottom Quick-Jump Dock */}
      <nav
        aria-label={lang === 'ar' ? 'التنقل السريع' : 'Schnellnavigation'}
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#05140f]/95 backdrop-blur-md border-t border-[#d4af37]/40 px-2 py-1.5 shadow-[0_-6px_25px_rgba(0,0,0,0.45)]"
      >
        <div className="grid grid-cols-6 gap-0.5">
          <button
            type="button"
            onClick={() => scrollTo('prayer-times')}
            className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[#cbe2d7] hover:text-[#f6e09f] hover:bg-[#0e2e23] transition-colors"
          >
            <Clock className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">
              {lang === 'ar' ? 'المواقيت' : 'Zeiten'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('adhan-settings')}
            className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[#cbe2d7] hover:text-[#f6e09f] hover:bg-[#0e2e23] transition-colors"
          >
            <Volume2 className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">
              {lang === 'ar' ? 'الأذان' : 'Adhan'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('card-studio')}
            className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[#cbe2d7] hover:text-[#f6e09f] hover:bg-[#0e2e23] transition-colors"
          >
            <Palette className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">
              {lang === 'ar' ? 'البطاقة' : 'Karte'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('janazah-notice')}
            className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[#cbe2d7] hover:text-[#f6e09f] hover:bg-[#0e2e23] transition-colors"
          >
            <FileText className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">
              {lang === 'ar' ? 'النعوة' : 'Janazah'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('mosques')}
            className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[#cbe2d7] hover:text-[#f6e09f] hover:bg-[#0e2e23] transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">
              {lang === 'ar' ? 'المساجد' : 'Moscheen'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('duas')}
            className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[#cbe2d7] hover:text-[#f6e09f] hover:bg-[#0e2e23] transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">
              {lang === 'ar' ? 'الأدعية' : 'Duas'}
            </span>
          </button>
        </div>
      </nav>

      {/* Share Website & App Install Link Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        lang={lang}
        onOpenInstall={() => setInstallModalOpen(true)}
      />

      {/* Android & iPhone PWA Install Modal */}
      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        lang={lang}
      />

      {/* Active Adhan Now Playing Banner */}
      <ActiveAdhanBanner
        lang={lang}
        activeAdhan={adhanController.activeAdhan}
        onStop={adhanController.stopAdhan}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator lang={lang} />
    </div>
  );
}
