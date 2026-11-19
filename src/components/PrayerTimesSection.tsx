import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import {
  getCurrentPrayers,
  generateMonthlyPrayerCalendar,
  generateRamadanImsakiyaByHijriYear,
  getUpcomingRamadans,
  ROSTOCK_COORDS,
  GREGORIAN_MONTHS_AR,
  GREGORIAN_MONTHS_DE
} from '../utils/prayerTimes';
import { DailySyncRecord, downloadPrayerAlarmsICS } from '../utils/dailySync';
import {
  POSTER_THEMES,
  POSTER_LAYOUTS,
  PosterThemeId,
  PosterLayoutId,
  drawSchedulePosterToCanvas,
  downloadSchedulePosterPng
} from '../utils/scheduleExporter';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Calendar,
  Utensils,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Printer,
  Search,
  RotateCcw,
  Sparkles,
  Download,
  Image as ImageIcon,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { AdhanSettingsPanel } from './AdhanControls';
import { AdhanSettings, ObligatoryPrayerKey } from '../utils/adhanAudio';
import { ActiveAdhanState } from '../hooks/useAdhanPlayer';

export interface AdhanControllerProps {
  settings: AdhanSettings;
  activeAdhan: ActiveAdhanState | null;
  audioUnlocked: boolean;
  audioNeedsUnlock: boolean;
  notificationPermission: NotificationPermission | 'unsupported';
  permissionsReady: boolean;
  wakeLockActive: boolean;
  playAdhan: (opts?: {
    muezzinId?: string;
    prayerKey?: ObligatoryPrayerKey;
    prayerNameAr?: string;
    prayerNameDe?: string;
    isPreview?: boolean;
  }) => void;
  stopAdhan: () => void;
  unlockAudio: () => void;
  requestAllPermissions: () => Promise<{ audioOk: boolean; notifPerm: NotificationPermission | 'unsupported' }>;
  toggleMasterEnabled: () => void;
  selectMuezzin: (id: string) => void;
  toggleDedicatedFajrAdhan: () => void;
  setVolume: (vol: number) => void;
  togglePrayerAdhan: (prayer: ObligatoryPrayerKey) => void;
  toggleNotifications: () => void;
  toggleWakeLock: () => void;
}

interface PrayerTimesSectionProps {
  lang: Language;
  data: ReturnType<typeof getCurrentPrayers>;
  syncRecord: DailySyncRecord;
  onSyncNow: () => void;
  adhan: AdhanControllerProps;
}

type ScheduleTab = 'monthly' | 'ramadan10y';

export const PrayerTimesSection: React.FC<PrayerTimesSectionProps> = ({
  lang,
  data,
  syncRecord,
  onSyncNow,
  adhan
}) => {
  const t = TRANSLATIONS[lang];

  // Automatically track current Rostock year/month so it rolls over month-by-month
  const currentRostockYear = data.rostockNow.year;
  const currentRostockMonth = data.rostockNow.month;

  const [calendarOpen, setCalendarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [activeTab, setActiveTab] = useState<ScheduleTab>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(currentRostockYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentRostockMonth);
  const [calendarSearch, setCalendarSearch] = useState('');
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [posterTheme, setPosterTheme] = useState<PosterThemeId>('emerald');
  const [posterLayout, setPosterLayout] = useState<PosterLayoutId>('arch_lanterns');
  const [isExporting, setIsExporting] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectScheduleTab = (tab: ScheduleTab) => {
    setActiveTab(tab);
    setPosterLayout(tab === 'ramadan10y' ? 'ramadan_imsakiya' : 'arch_lanterns');
  };

  // Auto-rollover year & month whenever Rostock local date crosses into a new month/year
  useEffect(() => {
    setSelectedYear(prevY => (prevY < currentRostockYear ? currentRostockYear : prevY));
    setSelectedMonth(prevM => {
      if (selectedYear < currentRostockYear) return currentRostockMonth;
      if (selectedYear === currentRostockYear && prevM < currentRostockMonth) return currentRostockMonth;
      return prevM;
    });
  }, [currentRostockYear, currentRostockMonth, selectedYear]);

  // 10-year upcoming Ramadans (11 Hijri years from current/upcoming)
  const ramadanOverview = useMemo(
    () => getUpcomingRamadans(new Date(), 11),
    // Recompute only when Rostock day changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.rostockNow.isoDate]
  );

  const [selectedRamadanHijriYear, setSelectedRamadanHijriYear] = useState<number>(
    () => ramadanOverview.currentOrNext.hijriYear
  );

  // 10-year Gregorian range: from current year up to +10 years
  const minYear = currentRostockYear;
  const maxYear = currentRostockYear + 10;
  const availableYears = useMemo(() => {
    const arr: number[] = [];
    for (let y = minYear; y <= maxYear; y++) arr.push(y);
    return arr;
  }, [minYear, maxYear]);

  // Compute schedule rows based on active tab
  const scheduleRows = useMemo(() => {
    if (activeTab === 'monthly') {
      return generateMonthlyPrayerCalendar(selectedYear, selectedMonth);
    }
    return generateRamadanImsakiyaByHijriYear(selectedRamadanHijriYear);
  }, [activeTab, selectedYear, selectedMonth, selectedRamadanHijriYear, data.rostockNow.isoDate]);

  // Filter rows by search query
  const filteredRows = useMemo(() => {
    if (!calendarSearch.trim()) return scheduleRows;
    const q = calendarSearch.trim().toLowerCase();
    return scheduleRows.filter(row => {
      return (
        row.dayNumber.toString().includes(q) ||
        row.gregorianDate.includes(q) ||
        row.dayNameAr.includes(q) ||
        row.dayNameDe.toLowerCase().includes(q) ||
        row.hijri.day.toString().includes(q) ||
        row.hijri.monthNameAr.includes(q) ||
        row.hijri.monthNameDe.toLowerCase().includes(q)
      );
    });
  }, [scheduleRows, calendarSearch]);

  const isAtMinMonth = selectedYear === minYear && selectedMonth === currentRostockMonth;
  const isAtMaxMonth = selectedYear === maxYear && selectedMonth === 12;

  const handlePrevMonth = () => {
    if (isAtMinMonth) return;
    if (selectedMonth === 1) {
      setSelectedYear(y => y - 1);
      setSelectedMonth(12);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (isAtMaxMonth) return;
    if (selectedMonth === 12) {
      setSelectedYear(y => y + 1);
      setSelectedMonth(1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  const handleResetToCurrentMonth = () => {
    setSelectedYear(currentRostockYear);
    setSelectedMonth(currentRostockMonth);
    setCalendarSearch('');
  };

  const handleJumpToUpcomingRamadan = () => {
    selectScheduleTab('ramadan10y');
    setSelectedRamadanHijriYear(ramadanOverview.currentOrNext.hijriYear);
    setCalendarOpen(true);
  };

  const { prayers, timeUntilIftar, timeUntilSuhoor, rostockNow, todayHijri, dstInfo } = data;
  const pad = (n: number) => n.toString().padStart(2, '0');
  const nextRamadan = ramadanOverview.currentOrNext;
  const selectedRamadanMeta = ramadanOverview.list.find(r => r.hijriYear === selectedRamadanHijriYear) || nextRamadan;
  const monthsList = lang === 'ar' ? GREGORIAN_MONTHS_AR : GREGORIAN_MONTHS_DE;

  const posterOptions = useMemo(() => {
    if (activeTab === 'monthly') {
      const mNameAr = GREGORIAN_MONTHS_AR[selectedMonth - 1];
      const mNameDe = GREGORIAN_MONTHS_DE[selectedMonth - 1];
      return {
        rows: scheduleRows,
        titleAr: `مواقيت الصلاة لشهر ${mNameAr} ${selectedYear}`,
        titleDe: `Gebetszeiten ${mNameDe} ${selectedYear} — Rostock`,
        subtitleAr: `الجدول الشهري الكامل لمدينة روستوك (${scheduleRows.length} يوماً)`,
        subtitleDe: `Vollständiger Monatsplan für Rostock (${scheduleRows.length} Tage)`,
        mode: 'monthly' as const,
        themeId: posterTheme,
        layoutId: posterLayout,
        lang
      };
    }
    return {
      rows: scheduleRows,
      titleAr: `إمساكية شهر رمضان المبارك ${selectedRamadanMeta.hijriYear} هـ`,
      titleDe: `Ramadan-Imsakiya ${selectedRamadanMeta.hijriYear} n.H. — Rostock`,
      subtitleAr: `من ${selectedRamadanMeta.startGregorianFormatted} إلى ${selectedRamadanMeta.endGregorianFormatted} (${selectedRamadanMeta.daysCount} يوماً)`,
      subtitleDe: `Vom ${selectedRamadanMeta.startGregorianFormatted} bis ${selectedRamadanMeta.endGregorianFormatted} (${selectedRamadanMeta.daysCount} Tage)`,
      mode: 'ramadan10y' as const,
      themeId: posterTheme,
      layoutId: posterLayout,
      lang
    };
  }, [activeTab, selectedMonth, selectedYear, scheduleRows, selectedRamadanMeta, posterTheme, posterLayout, lang]);

  // Render preview canvas whenever modal opens or theme/data changes
  useEffect(() => {
    if (posterModalOpen && previewCanvasRef.current) {
      drawSchedulePosterToCanvas(previewCanvasRef.current, posterOptions);
    }
  }, [posterModalOpen, posterOptions]);

  const handleDownloadPoster = async (overrideTheme?: PosterThemeId, overrideLayout?: PosterLayoutId) => {
    setIsExporting(true);
    try {
      const targetOpts = {
        ...posterOptions,
        themeId: overrideTheme ?? posterOptions.themeId,
        layoutId: overrideLayout ?? posterOptions.layoutId
      };
      const fileName =
        activeTab === 'monthly'
          ? `Rostock_Prayer_Times_${selectedYear}_${pad(selectedMonth)}_${targetOpts.themeId}.png`
          : `Rostock_Ramadan_${selectedRamadanMeta.hijriYear}_Imsakiya_${targetOpts.themeId}.png`;
      await downloadSchedulePosterPng(targetOpts, fileName);
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#d4af37', '#10b981', '#f6e09f', '#ffffff']
      });
    } finally {
      setIsExporting(false);
    }
  };

  const rostockClockStr = `${pad(rostockNow.hour)}:${pad(rostockNow.minute)}:${pad(rostockNow.second)}`;
  const todayFormatted = `${pad(rostockNow.day)}.${pad(rostockNow.month)}.${rostockNow.year}`;

  return (
    <section id="prayer-times" className="py-10 md:py-16 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#0c2a20] text-[#d4af37] text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.currentLocation} ({ROSTOCK_COORDS.latitude.toFixed(2)}° N, {ROSTOCK_COORDS.longitude.toFixed(2)}° E)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-cairo">
            {t.prayerTimesTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#b4ccc1]">
            {t.prayerTimesSubtitle}
          </p>
        </div>

        {/* Today in Rostock & True Ramadan Start Status Strip */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0c2b21] via-[#113a2d] to-[#0c2b21] border border-[#d4af37]/45 p-5 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-start">
            <div className="space-y-1">
              <div className="text-xs text-[#d4af37] font-semibold flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span>{lang === 'ar' ? 'التاريخ اليوم في روستوك:' : 'Heutiges Datum in Rostock:'}</span>
                <span className="font-mono text-white">{todayFormatted}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#f6e09f]">
                  {todayHijri.day} {lang === 'ar' ? todayHijri.monthNameAr : todayHijri.monthNameDe} {todayHijri.year}{' '}
                  {lang === 'ar' ? 'هـ' : 'n.H.'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[#9ee7cf]">
                  {rostockClockStr} {dstInfo.abbr} (UTC+{dstInfo.offsetHours}{' '}
                  {dstInfo.isDST
                    ? (lang === 'ar' ? 'صيفي' : 'Sommerzeit')
                    : (lang === 'ar' ? 'شتوي' : 'Winterzeit')}
                  )
                </span>
              </div>

              {nextRamadan.isCurrent ? (
                <p className="text-base sm:text-lg font-bold text-white font-cairo">
                  {lang === 'ar'
                    ? `نحن الآن في اليوم ${todayHijri.day} من شهر رمضان المبارك ${todayHijri.year} هـ`
                    : `Heute ist Tag ${todayHijri.day} des gesegneten Ramadan ${todayHijri.year} n.H.`}
                </p>
              ) : (
                <p className="text-sm sm:text-base font-bold text-white font-cairo">
                  {lang === 'ar'
                    ? `موعد بداية رمضان ${nextRamadan.hijriYear} هـ فلكياً في روستوك: يوم ${nextRamadan.startGregorianFormatted} (متبقي ${nextRamadan.daysUntilStart} يوماً)`
                    : `Astronomischer Beginn des Ramadan ${nextRamadan.hijriYear} n.H. in Rostock: ${nextRamadan.startGregorianFormatted} (in ${nextRamadan.daysUntilStart} Tagen)`}
                </p>
              )}

              <p className="text-[11px] text-[#9ec2b4]">
                {lang === 'ar'
                  ? 'الحسابات وفق تقويم أم القرى والفلك المعتمد؛ التثبيت النهائي لبداية الشهر يخضع للرؤية الشرعية للهلال.'
                  : 'Astronomische Berechnung nach Umm-al-Qura; der offizielle Monatsbeginn richtet sich nach der Mondsichtung.'}
              </p>
            </div>

            <button
              onClick={handleJumpToUpcomingRamadan}
              className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e3be46] text-[#061510] font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shrink-0 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? `عرض إمساكية رمضان ${nextRamadan.hijriYear} هـ`
                  : `Ramadan ${nextRamadan.hijriYear} Imsakiya öffnen`}
              </span>
            </button>
          </div>
        </div>

        {/* Live Countdown Banners (Iftar & Suhoor) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          {/* Maghrib / Iftar Countdown Box */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#12382c] to-[#081e17] border border-[#d4af37]/50 p-6 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3 text-[#f6e09f]">
              <Utensils className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-bold text-sm sm:text-base font-cairo">
                {t.iftarCountdown}
              </h3>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-2 text-3xl sm:text-4xl font-bold font-mono tracking-wider text-white">
                <span className="tabular-nums">{pad(timeUntilIftar.hours)}</span>
                <span className="text-[#d4af37]">:</span>
                <span className="tabular-nums">{pad(timeUntilIftar.minutes)}</span>
                <span className="text-[#d4af37]">:</span>
                <span className="tabular-nums text-2xl sm:text-3xl text-[#d4af37]">{pad(timeUntilIftar.seconds)}</span>
              </div>
              <span className="text-xs text-[#a9c9bc] font-sans">
                {lang === 'ar' ? 'ساعة : دقيقة : ثانية' : 'Std : Min : Sek'}
              </span>
            </div>
            <p className="text-xs text-[#c6dbd2] mt-3">
              {lang === 'ar' ? 'موعد أذان المغرب اليوم في روستوك:' : 'Heutiger Adhan al-Maghrib in Rostock:'}{' '}
              <strong className="text-[#f6e09f] font-mono font-bold text-sm">
                {prayers.find(p => p.name === 'Maghrib')?.time || '--:--'}
              </strong>
            </p>
          </div>

          {/* Fajr / Suhoor Countdown Box */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0c2920] to-[#051510] border border-[#1e4e3f] p-6 shadow-xl overflow-hidden">
            <div className="flex items-center gap-3 mb-3 text-[#a8d3c2]">
              <Moon className="w-5 h-5 text-[#86bfab]" />
              <h3 className="font-bold text-sm sm:text-base font-cairo">
                {t.suhoorCountdown}
              </h3>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-2 text-3xl sm:text-4xl font-bold font-mono tracking-wider text-[#e6f3ee]">
                <span className="tabular-nums">{pad(timeUntilSuhoor.hours)}</span>
                <span className="text-[#86bfab]">:</span>
                <span className="tabular-nums">{pad(timeUntilSuhoor.minutes)}</span>
                <span className="text-[#86bfab]">:</span>
                <span className="tabular-nums text-2xl sm:text-3xl text-[#86bfab]">{pad(timeUntilSuhoor.seconds)}</span>
              </div>
              <span className="text-xs text-[#8aa99d] font-sans">
                {lang === 'ar' ? 'ساعة : دقيقة : ثانية' : 'Std : Min : Sek'}
              </span>
            </div>
            <p className="text-xs text-[#a3c4b7] mt-3">
              {lang === 'ar' ? 'موعد أذان الفجر اليوم في روستوك:' : 'Heutiger Adhan al-Fajr in Rostock:'}{' '}
              <strong className="text-white font-mono font-bold text-sm">
                {prayers.find(p => p.name === 'Fajr')?.time || '--:--'}
              </strong>
            </p>
          </div>

        </div>

        {/* 6 Daily Prayer Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {prayers.map((prayer) => {
            const isNext = prayer.isNext;
            const isMaghrib = prayer.name === 'Maghrib';
            const isFajr = prayer.name === 'Fajr';
            const isObligatory = prayer.name !== 'Sunrise';
            const prayerKey = prayer.name as ObligatoryPrayerKey;
            const adhanOnForPrayer = isObligatory && adhan.settings.enabled && adhan.settings.enabledPrayers[prayerKey];

            return (
              <div
                key={prayer.name}
                className={`relative rounded-xl p-4 transition-all border text-center ${
                  isNext
                    ? 'bg-gradient-to-b from-[#184c3c] to-[#0c2e23] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 scale-[1.02]'
                    : isMaghrib
                    ? 'bg-[#0f3227] border-[#d4af37]/50'
                    : 'bg-[#081e16] border-[#184235] hover:border-[#2b6452]'
                }`}
              >
                {isNext && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#d4af37] text-[#061510] text-[10px] font-bold tracking-wide uppercase whitespace-nowrap">
                    {t.nextPrayer}
                  </span>
                )}

                {isObligatory && (
                  <button
                    type="button"
                    onClick={() => adhan.togglePrayerAdhan(prayerKey)}
                    className={`absolute top-2.5 end-2.5 p-1.5 rounded-lg border transition-colors ${
                      adhanOnForPrayer
                        ? 'bg-[#123d2e] border-[#d4af37]/40 text-[#d4af37] hover:bg-[#1a523e]'
                        : 'bg-[#05140f] border-[#193b2e] text-[#5e8073] hover:text-white'
                    }`}
                    title={
                      adhanOnForPrayer
                        ? (lang === 'ar' ? 'الأذان مفعّل لهذه الصلاة (اضغط للإيقاف)' : 'Adhan für dieses Gebet aktiv')
                        : (lang === 'ar' ? 'الأذان متوقف لهذه الصلاة (اضغط للتفعيل)' : 'Adhan für dieses Gebet stumm')
                    }
                  >
                    {adhanOnForPrayer ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                )}

                <div className="text-xs font-medium text-[#9fc0b2] mb-1">
                  {lang === 'ar' ? prayer.nameAr : prayer.nameDe}
                </div>

                <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
                  {prayer.time}
                </div>

                <div className="mt-2 text-[11px] text-[#7da494]">
                  {isMaghrib ? (
                    <span className="text-[#f6e09f] font-semibold">{lang === 'ar' ? 'المغرب (الإفطار)' : 'Salat al-Maghrib (Iftar)'}</span>
                  ) : isFajr ? (
                    <span className="text-[#b1e0d0]">{lang === 'ar' ? 'الفجر (الصبح)' : 'Salat al-Fajr (Subh)'}</span>
                  ) : prayer.name === 'Sunrise' ? (
                    <span>{lang === 'ar' ? 'شروق الشمس' : 'Ash-Shuruq'}</span>
                  ) : prayer.name === 'Dhuhr' ? (
                    <span>{lang === 'ar' ? 'صلاة الظهر' : 'Salat al-Dhuhr'}</span>
                  ) : prayer.name === 'Asr' ? (
                    <span>{lang === 'ar' ? 'صلاة العصر' : 'Salat al-Asr'}</span>
                  ) : (
                    <span>{lang === 'ar' ? 'صلاة العشاء' : 'Salat al-Isha'}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Adhan & Muezzin Settings Panel (with CET/CEST Daylight Saving Awareness) */}
        <AdhanSettingsPanel
          lang={lang}
          dstInfo={dstInfo}
          settings={adhan.settings}
          activeAdhan={adhan.activeAdhan}
          audioUnlocked={adhan.audioUnlocked}
          audioNeedsUnlock={adhan.audioNeedsUnlock}
          notificationPermission={adhan.notificationPermission}
          permissionsReady={adhan.permissionsReady}
          wakeLockActive={adhan.wakeLockActive}
          syncRecord={syncRecord}
          onSyncNow={onSyncNow}
          onExportICS={() => downloadPrayerAlarmsICS(lang, 30)}
          onPlayAdhan={adhan.playAdhan}
          onStopAdhan={adhan.stopAdhan}
          onUnlockAudio={adhan.unlockAudio}
          onRequestAllPermissions={adhan.requestAllPermissions}
          onToggleMaster={adhan.toggleMasterEnabled}
          onSelectMuezzin={adhan.selectMuezzin}
          onToggleDedicatedFajr={adhan.toggleDedicatedFajrAdhan}
          onChangeVolume={adhan.setVolume}
          onTogglePrayer={adhan.togglePrayerAdhan}
          onToggleNotifications={adhan.toggleNotifications}
          onToggleWakeLock={adhan.toggleWakeLock}
        />

        {/* Always-Visible Monthly Poster Styles & Ramadan Imsakiya Download Studio */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#0a261d] to-[#061812] border border-[#d4af37]/40 p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#184234]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-cairo flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                <span>
                  {lang === 'ar'
                    ? 'أنماط تحميل مواقيت الصلاة الشهرية ونموذج إمساكية رمضان (A4 PNG)'
                    : 'Monatsplan-Stile & Ramadan-Imsakiya herunterladen (A4 PNG)'}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-[#9ec2b4] mt-0.5">
                {lang === 'ar'
                  ? 'اختر النوع ونمط التصميم واللون بشعار الرابطة، ثم اضغط معاينة أو تحميل مباشر'
                  : 'Wählen Sie Typ, Layout & Farbdesign inkl. Vereinslogo zum Herunterladen'}
              </p>
            </div>

            {/* Monthly vs Ramadan Imsakiya Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-[#04120d] border border-[#1b4335] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => selectScheduleTab('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'monthly'
                    ? 'bg-[#d4af37] text-[#061510] shadow'
                    : 'text-[#a8c9bc] hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'المواقيت الشهرية' : 'Monatsplan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  selectScheduleTab('ramadan10y');
                  setSelectedRamadanHijriYear(ramadanOverview.currentOrNext.hijriYear);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'ramadan10y'
                    ? 'bg-[#d4af37] text-[#061510] shadow'
                    : 'text-[#a8c9bc] hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'نموذج إمساكية رمضان' : 'Ramadan-Imsakiya'}
              </button>
            </div>
          </div>

          {/* 6 Color Themes & 3 Layout Models */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
            <div className="lg:col-span-7 space-y-1.5">
              <div className="text-[11px] font-bold text-[#d4af37]">
                {lang === 'ar' ? '1. اختر نمط الألوان (6 أنماط):' : '1. Farbdesign wählen (6 Stile):'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POSTER_THEMES.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setPosterTheme(th.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
                      posterTheme === th.id
                        ? 'border-[#d4af37] bg-[#144434] text-white ring-1 ring-[#d4af37]/50'
                        : 'border-[#193f32] bg-[#04120d] text-[#a7c6b9] hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                      style={{ backgroundColor: th.bgTop }}
                    />
                    <span>{lang === 'ar' ? th.nameAr : th.nameDe}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-1.5">
              <div className="text-[11px] font-bold text-[#d4af37]">
                {lang === 'ar' ? '2. اختر نموذج التخطيط (3 نماذج):' : '2. Layout-Modell wählen (3 Modelle):'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POSTER_LAYOUTS.map((lay) => (
                  <button
                    key={lay.id}
                    type="button"
                    onClick={() => setPosterLayout(lay.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                      posterLayout === lay.id
                        ? 'border-[#d4af37] bg-[#1b4e3c] text-[#f6e09f]'
                        : 'border-[#193f32] bg-[#04120d] text-[#9bbbae] hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? lay.nameAr : lay.nameDe}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Period + Direct Preview / Download Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#163a2e]">
            <div className="flex flex-wrap items-center gap-2">
              {activeTab === 'monthly' ? (
                <>
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      setSelectedMonth(selectedYear === minYear && m < currentRostockMonth ? currentRostockMonth : m);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#04120d] border border-[#1e4e3f] text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {monthsList.map((mName, idx) => {
                      const mVal = idx + 1;
                      return (
                        <option key={mVal} value={mVal} disabled={selectedYear === minYear && mVal < currentRostockMonth}>
                          {mName}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      const y = Number(e.target.value);
                      setSelectedYear(y);
                      if (y === minYear && selectedMonth < currentRostockMonth) {
                        setSelectedMonth(currentRostockMonth);
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#04120d] border border-[#1e4e3f] text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                  >
                    {availableYears.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </>
              ) : (
                <select
                  value={selectedRamadanHijriYear}
                  onChange={(e) => setSelectedRamadanHijriYear(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-lg bg-[#04120d] border border-[#d4af37]/40 text-xs text-[#f6e09f] focus:outline-none focus:border-[#d4af37]"
                >
                  {ramadanOverview.list.map((item) => (
                    <option key={item.hijriYear} value={item.hijriYear}>
                      {lang === 'ar'
                        ? `رمضان ${item.hijriYear} هـ (${item.startGregorianFormatted})`
                        : `Ramadan ${item.hijriYear} n.H.`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPosterModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0e3529] hover:bg-[#164b3b] text-[#f6e09f] border border-[#d4af37]/50 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'معاينة البوستر' : 'Vorschau'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadPoster()}
                disabled={isExporting}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] hover:brightness-110 text-[#061510] text-xs font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {isExporting
                    ? (lang === 'ar' ? 'جارٍ التجهيز...' : 'Erstelle...')
                    : activeTab === 'monthly'
                    ? (lang === 'ar' ? 'تحميل الشهر (PNG)' : 'Monat (PNG)')
                    : (lang === 'ar' ? 'تحميل الإمساكية (PNG)' : 'Imsakiya (PNG)')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="px-3.5 py-2 rounded-xl bg-[#04120d] hover:bg-[#0c2920] text-[#cbe2d7] border border-[#1d4638] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>
                  {calendarOpen
                    ? (lang === 'ar' ? 'إخفاء الجدول' : 'Tabelle ausblenden')
                    : (lang === 'ar' ? 'عرض جدول 10 سنوات' : '10-Jahres-Tabelle')}
                </span>
                {calendarOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 10-Year Monthly & Ramadan Schedule Explorer */}
        {calendarOpen && (
          <div className="mt-4 rounded-2xl bg-[#081e17] border border-[#d4af37]/30 p-4 sm:p-6 shadow-2xl transition-all">
            
            {/* Mode Switcher Tabs & Search */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1b4335]">
              <div className="inline-flex p-1 rounded-xl bg-[#04120d] border border-[#1b4335]">
                <button
                  onClick={() => selectScheduleTab('monthly')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'monthly'
                      ? 'bg-[#d4af37] text-[#061510] shadow'
                      : 'text-[#a8c9bc] hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'المواقيت الشهرية (10 سنوات قادمة)' : 'Monatliche Gebetszeiten (10 Jahre)'}
                </button>
                <button
                  onClick={() => selectScheduleTab('ramadan10y')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'ramadan10y'
                      ? 'bg-[#d4af37] text-[#061510] shadow'
                      : 'text-[#a8c9bc] hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'إمساكية رمضان (10 سنوات هجرية)' : 'Ramadan-Imsakiya (10 Jahre)'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={calendarSearch}
                    onChange={(e) => setCalendarSearch(e.target.value)}
                    placeholder={lang === 'ar' ? 'بحث باليوم أو التاريخ...' : 'Tag oder Datum suchen...'}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#05140f] border border-[#1d4638] text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-[#0e2e23] hover:bg-[#154132] text-[#b4d4c6] border border-[#1d4638] text-xs font-medium flex items-center gap-1.5 shrink-0"
                  title={lang === 'ar' ? 'طباعة' : 'Drucken'}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === 'ar' ? 'طباعة' : 'Drucken'}</span>
                </button>
              </div>
            </div>

            {/* Tab Controls */}
            {activeTab === 'monthly' ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5 bg-[#05140f] p-4 rounded-xl border border-[#173e31]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-cairo">
                    {monthsList[selectedMonth - 1]} {selectedYear} — {lang === 'ar' ? 'مواقيت الصلاة في روستوك' : 'Gebetszeiten Rostock'}
                  </h3>
                  <p className="text-xs text-[#9bbbae]">
                    {lang === 'ar'
                      ? `يتجدد الجدول تلقائياً كل شهر بشهره، ويشمل حسابات دقيقة من ${minYear} حتى ${maxYear} بتوقيت ألمانيا (CET/CEST).`
                      : `Automatisch monatlich aktualisiert für Rostock von ${minYear} bis ${maxYear} inkl. Sommer-/Winterzeit.`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    disabled={isAtMinMonth}
                    className="p-2 rounded-lg bg-[#0c2920] border border-[#1e4e3f] text-[#f6e09f] hover:border-[#d4af37] disabled:opacity-35 disabled:cursor-not-allowed"
                    title={lang === 'ar' ? 'الشهر السابق' : 'Vorheriger Monat'}
                  >
                    {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>

                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      if (selectedYear === minYear && m < currentRostockMonth) {
                        setSelectedMonth(currentRostockMonth);
                      } else {
                        setSelectedMonth(m);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0c2920] border border-[#1e4e3f] text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {monthsList.map((mName, idx) => {
                      const mVal = idx + 1;
                      const disabled = selectedYear === minYear && mVal < currentRostockMonth;
                      return (
                        <option key={mVal} value={mVal} disabled={disabled}>
                          {mName}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      const y = Number(e.target.value);
                      setSelectedYear(y);
                      if (y === minYear && selectedMonth < currentRostockMonth) {
                        setSelectedMonth(currentRostockMonth);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0c2920] border border-[#1e4e3f] text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#d4af37]"
                  >
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleNextMonth}
                    disabled={isAtMaxMonth}
                    className="p-2 rounded-lg bg-[#0c2920] border border-[#1e4e3f] text-[#f6e09f] hover:border-[#d4af37] disabled:opacity-35 disabled:cursor-not-allowed"
                    title={lang === 'ar' ? 'الشهر التالي' : 'Nächster Monat'}
                  >
                    {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  {!(selectedYear === currentRostockYear && selectedMonth === currentRostockMonth) && (
                    <button
                      onClick={handleResetToCurrentMonth}
                      className="px-3 py-1.5 rounded-lg bg-[#123c2f] hover:bg-[#19503f] text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'الشهر الحالي' : 'Aktueller Monat'}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5 bg-[#05140f] p-4 rounded-xl border border-[#173e31]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-cairo">
                    {lang === 'ar'
                      ? `إمساكية رمضان ${selectedRamadanMeta.hijriYear} هـ (${selectedRamadanMeta.startGregorianFormatted} - ${selectedRamadanMeta.endGregorianFormatted})`
                      : `Ramadan-Imsakiya ${selectedRamadanMeta.hijriYear} n.H. (${selectedRamadanMeta.startGregorianFormatted} - ${selectedRamadanMeta.endGregorianFormatted})`}
                  </h3>
                  <p className="text-xs text-[#9bbbae]">
                    {lang === 'ar'
                      ? `عدد الأيام الفلكي: ${selectedRamadanMeta.daysCount} يوماً • بداية الشهر حسب تقويم أم القرى في روستوك.`
                      : `Astronomische Dauer: ${selectedRamadanMeta.daysCount} Tage • Berechnet für Rostock inkl. Ortszeit.`}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <label className="text-xs text-[#d4af37] font-semibold whitespace-nowrap">
                    {lang === 'ar' ? 'اختر السنة:' : 'Jahr wählen:'}
                  </label>
                  <select
                    value={selectedRamadanHijriYear}
                    onChange={(e) => setSelectedRamadanHijriYear(Number(e.target.value))}
                    className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-[#0c2920] border border-[#d4af37]/40 text-xs sm:text-sm text-white font-cairo focus:outline-none focus:border-[#d4af37]"
                  >
                    {ramadanOverview.list.map((item) => (
                      <option key={item.hijriYear} value={item.hijriYear}>
                        {lang === 'ar'
                          ? `رمضان ${item.hijriYear} هـ (${item.startGregorianFormatted})`
                          : `Ramadan ${item.hijriYear} n.H. (ab ${item.startGregorianFormatted})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Table Container */}
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto rounded-xl border border-[#1b4335]">
              <table className="w-full text-left text-xs sm:text-sm text-[#e2ede8]">
                <thead className="bg-[#0e3529] text-[#f6e09f] font-semibold sticky top-0 z-10 border-b border-[#1b4335]">
                  <tr>
                    <th className="px-3 py-3 text-center">
                      {activeTab === 'ramadan10y'
                        ? (lang === 'ar' ? 'رمضان' : 'Ramadan')
                        : (lang === 'ar' ? 'اليوم' : 'Tag')}
                    </th>
                    <th className="px-3 py-3 text-center">{lang === 'ar' ? 'التاريخ الميلادي' : 'Datum'}</th>
                    <th className="px-3 py-3 text-center">{lang === 'ar' ? 'التاريخ الهجري' : 'Hijri-Datum'}</th>
                    <th className="px-3 py-3 text-center text-[#9ee7cf]">{t.imsak}</th>
                    <th className="px-3 py-3 text-center">{t.fajr}</th>
                    <th className="px-3 py-3 text-center text-[#9bbbae]">{t.sunrise}</th>
                    <th className="px-3 py-3 text-center">{t.dhuhr}</th>
                    <th className="px-3 py-3 text-center">{t.asr}</th>
                    <th className="px-3 py-3 text-center text-[#f6e09f] font-bold bg-[#144737]">
                      {activeTab === 'ramadan10y'
                        ? (lang === 'ar' ? 'المغرب (الإفطار)' : 'Maghrib (Iftar)')
                        : t.maghrib}
                    </th>
                    <th className="px-3 py-3 text-center">{t.isha}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#13382c]">
                  {filteredRows.map((row) => (
                    <tr
                      key={row.isoDate}
                      className={`hover:bg-[#103a2e]/60 transition-colors ${
                        row.isToday
                          ? 'bg-[#1a5543] font-bold text-white ring-1 ring-[#d4af37]'
                          : row.isRamadan && activeTab === 'monthly'
                          ? 'bg-[#183924]/50'
                          : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <span className="font-mono font-bold text-[#d4af37] me-1.5">
                          {row.dayNumber}
                        </span>
                        <span className="text-xs text-[#c5ded2]">
                          {lang === 'ar' ? row.dayNameAr : row.dayNameDe}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-xs whitespace-nowrap text-[#a7c5b9]">
                        {row.gregorianDate}
                      </td>
                      <td className="px-3 py-2.5 text-center text-xs whitespace-nowrap">
                        <span className={row.isRamadan ? 'text-[#f6e09f] font-bold' : 'text-[#cbe0d6]'}>
                          {row.hijri.day} {lang === 'ar' ? row.hijri.monthNameAr : row.hijri.monthNameDe} {row.hijri.year}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-[#9ee7cf]">
                        {row.imsak}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">
                        {row.fajr}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-[#8aa99d]">
                        {row.sunrise}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">
                        {row.dhuhr}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">
                        {row.asr}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold text-[#f6e09f] bg-[#10382b]/70">
                        {row.maghrib}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">
                        {row.isha}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#86a89b]">
              <span>
                * {lang === 'ar'
                  ? 'المواقيت محسوبة فلكياً لإحداثيات روستوك (54.09° شمالاً، 12.10° شرقاً) وتتكيف تلقائياً مع التوقيت الشتوي والصيفي في ألمانيا.'
                  : 'Berechnet für Rostock (54.09° N, 12.10° O) mit automatischer CET/CEST-Zeitumstellung.'}
              </span>
              <span>
                * {lang === 'ar'
                  ? 'الإمساك قبل أذان الفجر بـ 10 دقائق احتياطاً.'
                  : 'Imsak liegt vorsorglich 10 Minuten vor Fajr.'}
              </span>
            </div>

          </div>
        )}

      </div>

      {/* Interactive Schedule Poster Preview & Download Modal */}
      {posterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#081e17] border border-[#d4af37]/50 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1b4335]">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-cairo">
                  {lang === 'ar'
                    ? 'تصميم وتحميل بوستر المواقيت / الإمساكية بشعار الرابطة'
                    : 'Design-Poster herunterladen (mit Vereinslogo)'}
                </h3>
                <p className="text-xs text-[#9bbbae]">
                  {lang === 'ar'
                    ? 'تصميم عالي الدقة (A4 PNG) جاهز للطباعة والنشر على واتساب ولوحة إعلانات المسجد.'
                    : 'Hochauflösendes A4-Poster (PNG) zum Ausdrucken oder Teilen über WhatsApp.'}
                </p>
              </div>
              <button
                onClick={() => setPosterModalOpen(false)}
                className="p-2 rounded-lg bg-[#0d2e23] hover:bg-[#164636] text-[#c7ddd3] hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme & Layout Model Picker + Download */}
            <div className="space-y-3 py-4 border-b border-[#14392c]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {POSTER_THEMES.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setPosterTheme(th.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                        posterTheme === th.id
                          ? 'border-[#d4af37] bg-[#144434] text-white ring-1 ring-[#d4af37]'
                          : 'border-[#1d4638] bg-[#04120d] text-[#a9c9bc] hover:border-[#2e6955]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: th.bgTop }}
                      />
                      <span>{lang === 'ar' ? th.nameAr : th.nameDe}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleDownloadPoster()}
                  disabled={isExporting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#061510] font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg flex items-center gap-2 disabled:opacity-60"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isExporting
                      ? (lang === 'ar' ? 'جارٍ التجهيز...' : 'Wird erstellt...')
                      : (lang === 'ar' ? 'تحميل البوستر بدقة عالية (PNG)' : 'Poster herunterladen (PNG)')}
                  </span>
                </button>
              </div>

              {/* Layout Model & Month/Year Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex p-0.5 rounded-lg bg-[#04120d] border border-[#1d4638]">
                    <button
                      type="button"
                      onClick={() => selectScheduleTab('monthly')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                        activeTab === 'monthly' ? 'bg-[#d4af37] text-[#061510]' : 'text-[#a9c9bc] hover:text-white'
                      }`}
                    >
                      {lang === 'ar' ? 'شهري' : 'Monat'}
                    </button>
                    <button
                      type="button"
                      onClick={() => selectScheduleTab('ramadan10y')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                        activeTab === 'ramadan10y' ? 'bg-[#d4af37] text-[#061510]' : 'text-[#a9c9bc] hover:text-white'
                      }`}
                    >
                      {lang === 'ar' ? 'إمساكية رمضان' : 'Ramadan'}
                    </button>
                  </div>

                  {activeTab === 'monthly' ? (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={selectedMonth}
                        onChange={(e) => {
                          const m = Number(e.target.value);
                          setSelectedMonth(selectedYear === minYear && m < currentRostockMonth ? currentRostockMonth : m);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#04120d] border border-[#1d4638] text-[11px] text-white focus:outline-none focus:border-[#d4af37]"
                      >
                        {monthsList.map((mName, idx) => {
                          const mVal = idx + 1;
                          return (
                            <option key={mVal} value={mVal} disabled={selectedYear === minYear && mVal < currentRostockMonth}>
                              {mName}
                            </option>
                          );
                        })}
                      </select>
                      <select
                        value={selectedYear}
                        onChange={(e) => {
                          const y = Number(e.target.value);
                          setSelectedYear(y);
                          if (y === minYear && selectedMonth < currentRostockMonth) {
                            setSelectedMonth(currentRostockMonth);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#04120d] border border-[#1d4638] text-[11px] text-white font-mono focus:outline-none focus:border-[#d4af37]"
                      >
                        {availableYears.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <select
                      value={selectedRamadanHijriYear}
                      onChange={(e) => setSelectedRamadanHijriYear(Number(e.target.value))}
                      className="px-2.5 py-1 rounded-lg bg-[#04120d] border border-[#d4af37]/40 text-[11px] text-[#f6e09f] focus:outline-none focus:border-[#d4af37]"
                    >
                      {ramadanOverview.list.map((item) => (
                        <option key={item.hijriYear} value={item.hijriYear}>
                          {lang === 'ar'
                            ? `رمضان ${item.hijriYear} هـ (${item.startGregorianFormatted})`
                            : `Ramadan ${item.hijriYear} n.H.`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#d4af37]">
                    {lang === 'ar' ? 'نموذج التصميم:' : 'Layout:'}
                  </span>
                  {POSTER_LAYOUTS.map((lay) => {
                    const isActive = posterLayout === lay.id;
                    return (
                      <button
                        key={lay.id}
                        type="button"
                        onClick={() => setPosterLayout(lay.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          isActive
                            ? 'border-[#d4af37] bg-[#1a523f] text-[#f6e09f]'
                            : 'border-[#1d4638] bg-[#04120d] text-[#a9c9bc] hover:text-white'
                        }`}
                      >
                        {lang === 'ar' ? lay.nameAr : lay.nameDe}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Canvas Preview */}
            <div className="flex-1 overflow-y-auto py-4 flex justify-center bg-[#04100c] rounded-xl mt-4 border border-[#14392c]">
              <canvas
                ref={previewCanvasRef}
                className="max-w-full max-h-[60vh] w-auto h-auto rounded-lg shadow-2xl border border-[#d4af37]/30"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
