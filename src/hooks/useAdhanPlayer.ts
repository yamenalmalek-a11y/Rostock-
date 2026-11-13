import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AdhanSettings,
  FAJR_SPECIAL_ADHAN,
  ObligatoryPrayerKey,
  getMuezzinById,
  loadAdhanSettings,
  saveAdhanSettings
} from '../utils/adhanAudio';
import { PrayerTime } from '../utils/prayerTimes';
import { Language } from '../utils/translations';

export interface ActiveAdhanState {
  muezzinId: string;
  muezzinNameAr: string;
  muezzinNameDe: string;
  prayerNameAr: string;
  prayerNameDe: string;
  isPreview: boolean;
  progress: number; // 0..100
}

const TRIGGERED_KEY = 'ib_rostock_last_adhan_trigger';

export function useAdhanPlayer(
  prayers: PrayerTime[],
  isoDate: string,
  lang: Language,
  onBeforePlay?: () => void
) {
  const [settings, setSettings] = useState<AdhanSettings>(() => loadAdhanSettings());
  const [activeAdhan, setActiveAdhan] = useState<ActiveAdhanState | null>(null);
  const [audioNeedsUnlock, setAudioNeedsUnlock] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chimeCtxRef = useRef<AudioContext | null>(null);
  const onBeforePlayRef = useRef(onBeforePlay);
  onBeforePlayRef.current = onBeforePlay;

  // Persist settings changes
  useEffect(() => {
    saveAdhanSettings(settings);
  }, [settings]);

  // Apply live volume updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume;
    }
  }, [settings.volume]);

  const stopAdhan = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (chimeCtxRef.current && chimeCtxRef.current.state !== 'closed') {
      chimeCtxRef.current.close().catch(() => {});
      chimeCtxRef.current = null;
    }
    setActiveAdhan(null);
  }, []);

  // Gentle melodic chime fallback if network audio fails or is blocked offline
  const playMelodicChimeFallback = useCallback((volume: number) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      chimeCtxRef.current = ctx;

      const notes = [293.66, 349.23, 440.0, 523.25, 440.0]; // Hijaz-inspired peaceful sequence
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.55;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(Math.max(0.05, volume * 0.22), start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 1.25);
      });

      setTimeout(() => {
        if (chimeCtxRef.current === ctx) {
          ctx.close().catch(() => {});
          chimeCtxRef.current = null;
          setActiveAdhan(null);
        }
      }, 3600);
    } catch {
      setActiveAdhan(null);
    }
  }, []);

  const playAdhan = useCallback(
    async (options?: {
      muezzinId?: string;
      prayerKey?: ObligatoryPrayerKey;
      prayerNameAr?: string;
      prayerNameDe?: string;
      isPreview?: boolean;
    }) => {
      onBeforePlayRef.current?.();
      stopAdhan();

      const prayerKey = options?.prayerKey;
      const resolvedVoice =
        options?.muezzinId
          ? getMuezzinById(options.muezzinId)
          : prayerKey === 'Fajr' && settings.useDedicatedFajrAdhan
          ? FAJR_SPECIAL_ADHAN
          : getMuezzinById(settings.muezzinId);

      const stateInfo: ActiveAdhanState = {
        muezzinId: resolvedVoice.id,
        muezzinNameAr: resolvedVoice.nameAr,
        muezzinNameDe: resolvedVoice.nameDe,
        prayerNameAr: options?.prayerNameAr || 'معاينة صوت الأذان',
        prayerNameDe: options?.prayerNameDe || 'Adhan-Vorschau',
        isPreview: options?.isPreview ?? true,
        progress: 0
      };

      setActiveAdhan(stateInfo);

      const audio = new Audio(resolvedVoice.url);
      audio.volume = settings.volume;
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        if (audio.duration && isFinite(audio.duration)) {
          const pct = Math.min(100, Math.round((audio.currentTime / audio.duration) * 100));
          setActiveAdhan(prev => (prev ? { ...prev, progress: pct } : null));
        }
      };

      audio.onended = () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
        setActiveAdhan(null);
      };

      audio.onerror = () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
        playMelodicChimeFallback(settings.volume);
      };

      try {
        await audio.play();
        setAudioNeedsUnlock(false);
      } catch (err) {
        const isNotAllowed = err instanceof DOMException && err.name === 'NotAllowedError';
        if (isNotAllowed && !(options?.isPreview ?? true)) {
          setAudioNeedsUnlock(true);
          setActiveAdhan(null);
          audioRef.current = null;
        } else {
          playMelodicChimeFallback(settings.volume);
        }
      }
    },
    [playMelodicChimeFallback, settings.muezzinId, settings.useDedicatedFajrAdhan, settings.volume, stopAdhan]
  );

  // Unlock browser autoplay policy via user click
  const unlockAudio = useCallback(async () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
        setTimeout(() => ctx.close().catch(() => {}), 120);
      }
      setAudioNeedsUnlock(false);
    } catch {
      setAudioNeedsUnlock(false);
    }
  }, []);

  // Automatically check every second if an obligatory prayer time has just arrived in Rostock (CET/CEST accurate)
  useEffect(() => {
    if (!settings.enabled) return;

    const nowMs = Date.now();
    const obligatoryKeys: ObligatoryPrayerKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const p of prayers) {
      if (!obligatoryKeys.includes(p.name as ObligatoryPrayerKey)) continue;
      const key = p.name as ObligatoryPrayerKey;
      if (!settings.enabledPrayers[key]) continue;

      const diffMs = nowMs - p.timestampMs;
      // Trigger strictly within the first 45 seconds of prayer start
      if (diffMs >= 0 && diffMs < 45000) {
        const triggerStamp = `${isoDate}_${key}`;
        let alreadyTriggered = false;
        try {
          alreadyTriggered = window.localStorage.getItem(TRIGGERED_KEY) === triggerStamp;
        } catch {
          alreadyTriggered = false;
        }

        if (!alreadyTriggered) {
          try {
            window.localStorage.setItem(TRIGGERED_KEY, triggerStamp);
          } catch {
            // Ignore storage errors
          }

          // Optional browser notification
          if (
            settings.notificationsEnabled &&
            typeof Notification !== 'undefined' &&
            Notification.permission === 'granted'
          ) {
            try {
              const title =
                lang === 'ar'
                  ? `حان الآن موعد أذان ${p.nameAr} في روستوك (${p.time})`
                  : `Gebetszeit in Rostock: ${p.nameDe} (${p.time})`;
              const body =
                lang === 'ar'
                  ? 'الرابطة الإسلامية في مدينة روستوك • حي على الصلاة'
                  : 'Islamischer Bund Rostock e.V.';
              new Notification(title, { body, icon: '/pwa-192x192.png' });
            } catch {
              // Ignore notification error
            }
          }

          void playAdhan({
            prayerKey: key,
            prayerNameAr: `أذان ${p.nameAr} (${p.time})`,
            prayerNameDe: `${p.nameDe}-Adhan (${p.time})`,
            isPreview: false
          });
        }
      }
    }
  }, [
    isoDate,
    lang,
    playAdhan,
    prayers,
    settings.enabled,
    settings.enabledPrayers,
    settings.notificationsEnabled
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (chimeCtxRef.current && chimeCtxRef.current.state !== 'closed') {
        chimeCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleMasterEnabled = () => {
    void unlockAudio();
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const selectMuezzin = (muezzinId: string) => {
    void unlockAudio();
    setSettings(prev => ({ ...prev, muezzinId }));
  };

  const toggleDedicatedFajrAdhan = () => {
    void unlockAudio();
    setSettings(prev => ({ ...prev, useDedicatedFajrAdhan: !prev.useDedicatedFajrAdhan }));
  };

  const setVolume = (volume: number) => {
    setSettings(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  };

  const togglePrayerAdhan = (prayer: ObligatoryPrayerKey) => {
    void unlockAudio();
    setSettings(prev => ({
      ...prev,
      enabledPrayers: {
        ...prev.enabledPrayers,
        [prayer]: !prev.enabledPrayers[prayer]
      }
    }));
  };

  const toggleNotifications = async () => {
    if (typeof Notification === 'undefined') return;
    if (!settings.notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
      }
    } else {
      setSettings(prev => ({ ...prev, notificationsEnabled: false }));
    }
  };

  return {
    settings,
    activeAdhan,
    audioNeedsUnlock,
    playAdhan,
    stopAdhan,
    unlockAudio,
    toggleMasterEnabled,
    selectMuezzin,
    toggleDedicatedFajrAdhan,
    setVolume,
    togglePrayerAdhan,
    toggleNotifications
  };
}
