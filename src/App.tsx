import React, { useState, useEffect, useRef } from 'react';
import { Language } from './utils/translations';
import { getCurrentPrayers } from './utils/prayerTimes';
import { Header } from './components/Header';
import { HeroAnnouncement } from './components/HeroAnnouncement';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { CardGenerator } from './components/CardGenerator';
import { MosquesDirectory } from './components/MosquesDirectory';
import { DuasAndQuranSection } from './components/DuasAndQuranSection';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { InstallAppModal, OfflineIndicator } from './components/InstallAppModal';

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
  const [prayerData, setPrayerData] = useState(() => getCurrentPrayers());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<AudioContext | null>(null);

  // Synchronize document language and direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Update prayer times periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setPrayerData(getCurrentPrayers());
    }, 1000);
    return () => clearInterval(timer);
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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (synthRef.current && synthRef.current.state !== 'closed') {
        synthRef.current.close().catch(() => {});
      }
      setIsPlayingAudio(false);
    } else {
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

      <main>
        {/* 1. Official Proclamation & Quranic Announcement */}
        <HeroAnnouncement
          lang={lang}
          isPlayingAudio={isPlayingAudio}
          onToggleAudio={toggleAudio}
          onOpenCardStudio={() => scrollTo('card-studio')}
          onOpenPrayerTimes={() => scrollTo('prayer-times')}
          onOpenShare={() => setShareModalOpen(true)}
          personalizedRecipient={personalizedRecipient}
        />

        {/* 2. Rostock Prayer Times & 10-Year Schedule */}
        <PrayerTimesSection lang={lang} />

        {/* 3. Luxury Personalized Greeting Card Generator (6 Designs) */}
        <CardGenerator lang={lang} />

        {/* 4. Mosques in Rostock */}
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

      {/* Offline Status Indicator */}
      <OfflineIndicator lang={lang} />
    </div>
  );
}
