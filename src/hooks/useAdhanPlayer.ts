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

const TRIGGERED_MAP_KEY = 'ib_rostock_adhan_triggered_map_v2';
// Ultra-short 0.05s silent PCM WAV used solely to bless the persistent HTMLAudioElement on user gesture
const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

function hasTriggeredPrayer(isoDate: string, key: ObligatoryPrayerKey): boolean {
  try {
    const raw = window.localStorage.getItem(TRIGGERED_MAP_KEY);
    if (!raw) return false;
    const map = JSON.parse(raw) as Record<string, boolean>;
    return Boolean(map[`${isoDate}_${key}`]);
  } catch {
    return false;
  }
}

function markTriggeredPrayer(isoDate: string, key: ObligatoryPrayerKey): void {
  try {
    const raw = window.localStorage.getItem(TRIGGERED_MAP_KEY);
    const map: Record<string, boolean> = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    map[`${isoDate}_${key}`] = true;
    // Prune entries older than today/recent days to keep storage tiny
    const keys = Object.keys(map);
    if (keys.length > 25) {
      for (const k of keys) {
        if (!k.startsWith(isoDate)) {
          delete map[k];
        }
      }
    }
    window.localStorage.setItem(TRIGGERED_MAP_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage errors
  }
}

function getNotificationPermissionState(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return 'unsupported';
  }
  return Notification.permission;
}

export function useAdhanPlayer(
  prayers: PrayerTime[],
  isoDate: string,
  lang: Language,
  onBeforePlay?: () => void
) {
  const [settings, setSettings] = useState<AdhanSettings>(() => loadAdhanSettings());
  const [activeAdhan, setActiveAdhan] = useState<ActiveAdhanState | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [audioNeedsUnlock, setAudioNeedsUnlock] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(
    () => getNotificationPermissionState()
  );
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Single persistent HTMLAudioElement reused across session so user-gesture unlock persists on mobile
  const persistentAudioRef = useRef<HTMLAudioElement | null>(null);
  const chimeCtxRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const onBeforePlayRef = useRef(onBeforePlay);
  onBeforePlayRef.current = onBeforePlay;

  const getOrCreateAudioElement = useCallback((): HTMLAudioElement => {
    if (!persistentAudioRef.current) {
      const el = new Audio();
      el.preload = 'auto';
      persistentAudioRef.current = el;
    }
    return persistentAudioRef.current;
  }, []);

  // Persist settings changes
  useEffect(() => {
    saveAdhanSettings(settings);
  }, [settings]);

  // Apply live volume updates
  useEffect(() => {
    if (persistentAudioRef.current) {
      persistentAudioRef.current.volume = settings.volume;
    }
  }, [settings.volume]);

  // Sync notification permission state when page regains focus
  useEffect(() => {
    const refreshPerm = () => setNotificationPermission(getNotificationPermissionState());
    document.addEventListener('visibilitychange', refreshPerm);
    window.addEventListener('focus', refreshPerm);
    return () => {
      document.removeEventListener('visibilitychange', refreshPerm);
      window.removeEventListener('focus', refreshPerm);
    };
  }, []);

  const stopAdhan = useCallback(() => {
    if (persistentAudioRef.current) {
      persistentAudioRef.current.pause();
      try {
        persistentAudioRef.current.currentTime = 0;
      } catch {
        // Ignore seek errors on uninitialized src
      }
    }
    if (chimeCtxRef.current && chimeCtxRef.current.state !== 'closed') {
      chimeCtxRef.current.close().catch(() => {});
      chimeCtxRef.current = null;
    }
    setActiveAdhan(null);
  }, []);

  // Gentle melodic chime fallback if network audio fails offline
  const playMelodicChimeFallback = useCallback((volume: number) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      chimeCtxRef.current = ctx;

      const notes = [293.66, 349.23, 440.0, 523.25, 440.0];
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

      const audio = getOrCreateAudioElement();
      audio.src = resolvedVoice.url;
      audio.volume = settings.volume;

      audio.ontimeupdate = () => {
        if (audio.duration && isFinite(audio.duration)) {
          const pct = Math.min(100, Math.round((audio.currentTime / audio.duration) * 100));
          setActiveAdhan(prev => (prev ? { ...prev, progress: pct } : null));
        }
      };

      audio.onended = () => {
        setActiveAdhan(null);
      };

      audio.onerror = () => {
        playMelodicChimeFallback(settings.volume);
      };

      try {
        await audio.play();
        setAudioUnlocked(true);
        setAudioNeedsUnlock(false);
      } catch (err) {
        const isNotAllowed = err instanceof DOMException && err.name === 'NotAllowedError';
        if (isNotAllowed && !(options?.isPreview ?? true)) {
          setAudioNeedsUnlock(true);
          setAudioUnlocked(false);
          setActiveAdhan(null);
        } else {
          playMelodicChimeFallback(settings.volume);
        }
      }
    },
    [
      getOrCreateAudioElement,
      playMelodicChimeFallback,
      settings.muezzinId,
      settings.useDedicatedFajrAdhan,
      settings.volume,
      stopAdhan
    ]
  );

  // Unlock browser autoplay policy cleanly via user interaction (blesses persistent audio element + AudioContext)
  const unlockAudio = useCallback(async () => {
    try {
      const audio = getOrCreateAudioElement();
      // Only play silent primer if nothing is currently actively playing
      if (audio.paused) {
        audio.src = SILENT_WAV_DATA_URI;
        audio.volume = 0.01;
        await audio.play().catch(() => {});
        audio.pause();
        audio.currentTime = 0;
        audio.volume = settings.volume;
      }

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

      setAudioUnlocked(true);
      setAudioNeedsUnlock(false);

      // Warm up selected Muezzin & Fajr Adhan files quietly into browser/Workbox cache
      const selected = getMuezzinById(settings.muezzinId);
      fetch(selected.url, { mode: 'cors' }).catch(() => {});
      if (settings.useDedicatedFajrAdhan) {
        fetch(FAJR_SPECIAL_ADHAN.url, { mode: 'cors' }).catch(() => {});
      }
    } catch {
      setAudioUnlocked(true);
      setAudioNeedsUnlock(false);
    }
  }, [getOrCreateAudioElement, settings.muezzinId, settings.useDedicatedFajrAdhan, settings.volume]);

  // Single-command permission grant: Audio unlock + Browser Notifications + Persistent Storage + Enable all 5 prayers
  const requestAllPermissions = useCallback(async (): Promise<{
    audioOk: boolean;
    notifPerm: NotificationPermission | 'unsupported';
  }> => {
    await unlockAudio();

    let perm: NotificationPermission | 'unsupported' = getNotificationPermissionState();
    if (typeof Notification !== 'undefined') {
      if (Notification.permission === 'default') {
        try {
          perm = await Notification.requestPermission();
        } catch {
          perm = Notification.permission;
        }
      } else {
        perm = Notification.permission;
      }
    }
    setNotificationPermission(perm);

    // Ask browser to retain PWA cached schedules & audio reliably
    if (navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {});
    }

    setSettings(prev => ({
      ...prev,
      enabled: true,
      notificationsEnabled: perm === 'granted' ? true : prev.notificationsEnabled,
      enabledPrayers: {
        Fajr: true,
        Dhuhr: true,
        Asr: true,
        Maghrib: true,
        Isha: true
      }
    }));

    return { audioOk: true, notifPerm: perm };
  }, [unlockAudio]);

  // Helper to dispatch system/PWA notification cleanly
  const dispatchPrayerNotification = useCallback(
    async (prayer: PrayerTime) => {
      if (
        !settings.notificationsEnabled ||
        typeof Notification === 'undefined' ||
        Notification.permission !== 'granted'
      ) {
        return;
      }
      const title =
        lang === 'ar'
          ? `حان الآن موعد أذان ${prayer.nameAr} في روستوك (${prayer.time})`
          : `Gebetszeit in Rostock: ${prayer.nameDe} (${prayer.time})`;
      const body =
        lang === 'ar'
          ? 'الرابطة الإسلامية في مدينة روستوك • حي على الصلاة'
          : 'Islamischer Bund Rostock e.V. • Auf zum Gebet';

      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          if (reg && typeof reg.showNotification === 'function') {
            await reg.showNotification(title, {
              body,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: `adhan-${isoDate}-${prayer.name}`,
              renotify: true
            } as NotificationOptions);
            return;
          }
        }
        new Notification(title, { body, icon: '/pwa-192x192.png', tag: `adhan-${isoDate}-${prayer.name}` });
      } catch {
        // Ignore notification errors
      }
    },
    [isoDate, lang, settings.notificationsEnabled]
  );

  // Screen Wake Lock toggle (optional: keeps home/mosque tablet awake so Adhan plays uninterrupted)
  const toggleWakeLock = useCallback(async () => {
    const navWithWakeLock = navigator as unknown as {
      wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void>; addEventListener: (e: string, cb: () => void) => void }> };
    };
    if (!navWithWakeLock.wakeLock) return;

    if (wakeLockActive && wakeLockRef.current) {
      await wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
      setWakeLockActive(false);
      return;
    }

    try {
      const sentinel = await navWithWakeLock.wakeLock.request('screen');
      wakeLockRef.current = sentinel;
      setWakeLockActive(true);
      sentinel.addEventListener('release', () => {
        setWakeLockActive(false);
        wakeLockRef.current = null;
      });
    } catch {
      setWakeLockActive(false);
    }
  }, [wakeLockActive]);

  // Automatically check every second (plus catch-up up to 120s for throttled background tabs) if any obligatory prayer arrived
  useEffect(() => {
    if (!settings.enabled) return;

    const nowMs = Date.now();
    const obligatoryKeys: ObligatoryPrayerKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const p of prayers) {
      if (!obligatoryKeys.includes(p.name as ObligatoryPrayerKey)) continue;
      const key = p.name as ObligatoryPrayerKey;
      if (!settings.enabledPrayers[key]) continue;

      const diffMs = nowMs - p.timestampMs;
      // Trigger within first 2 minutes (120,000ms) so background tab throttling never misses Adhan
      if (diffMs >= 0 && diffMs < 120000) {
        if (!hasTriggeredPrayer(isoDate, key)) {
          markTriggeredPrayer(isoDate, key);
          void dispatchPrayerNotification(p);
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
    dispatchPrayerNotification,
    isoDate,
    playAdhan,
    prayers,
    settings.enabled,
    settings.enabledPrayers
  ]);

  // Silently bless audio element on first pointer interaction anywhere on page as fallback
  useEffect(() => {
    if (audioUnlocked) return;
    const handleFirstGesture = () => {
      void unlockAudio();
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    return () => window.removeEventListener('pointerdown', handleFirstGesture);
  }, [audioUnlocked, unlockAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (persistentAudioRef.current) {
        persistentAudioRef.current.pause();
      }
      if (chimeCtxRef.current && chimeCtxRef.current.state !== 'closed') {
        chimeCtxRef.current.close().catch(() => {});
      }
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
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
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
      }
    } else {
      setSettings(prev => ({ ...prev, notificationsEnabled: false }));
    }
  };

  const permissionsReady =
    audioUnlocked && (notificationPermission === 'granted' || notificationPermission === 'unsupported');

  return {
    settings,
    activeAdhan,
    audioUnlocked,
    audioNeedsUnlock,
    notificationPermission,
    permissionsReady,
    wakeLockActive,
    playAdhan,
    stopAdhan,
    unlockAudio,
    requestAllPermissions,
    toggleMasterEnabled,
    selectMuezzin,
    toggleDedicatedFajrAdhan,
    setVolume,
    togglePrayerAdhan,
    toggleNotifications,
    toggleWakeLock
  };
}
