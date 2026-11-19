import React, { useState } from 'react';
import { Language } from '../utils/translations';
import {
  AdhanSettings,
  FAJR_SPECIAL_ADHAN,
  MUEZZIN_VOICES,
  ObligatoryPrayerKey,
  getMuezzinById
} from '../utils/adhanAudio';
import { ActiveAdhanState } from '../hooks/useAdhanPlayer';
import { BerlinDSTInfo } from '../utils/prayerTimes';
import { DailySyncRecord } from '../utils/dailySync';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Bell,
  BellOff,
  Sun,
  Snowflake,
  Sliders,
  Check,
  ChevronDown,
  ChevronUp,
  Sunrise,
  ShieldCheck,
  RefreshCw,
  Smartphone,
  CalendarPlus,
  X
} from 'lucide-react';

interface AdhanPanelProps {
  lang: Language;
  dstInfo: BerlinDSTInfo;
  settings: AdhanSettings;
  activeAdhan: ActiveAdhanState | null;
  audioUnlocked: boolean;
  audioNeedsUnlock: boolean;
  notificationPermission: NotificationPermission | 'unsupported';
  permissionsReady: boolean;
  wakeLockActive: boolean;
  syncRecord: DailySyncRecord;
  onSyncNow: () => void;
  onExportICS: () => void;
  onPlayAdhan: (opts?: {
    muezzinId?: string;
    prayerKey?: ObligatoryPrayerKey;
    prayerNameAr?: string;
    prayerNameDe?: string;
    isPreview?: boolean;
  }) => void;
  onStopAdhan: () => void;
  onUnlockAudio: () => void;
  onRequestAllPermissions: () => Promise<{ audioOk: boolean; notifPerm: NotificationPermission | 'unsupported' }>;
  onToggleMaster: () => void;
  onSelectMuezzin: (id: string) => void;
  onToggleDedicatedFajr: () => void;
  onChangeVolume: (vol: number) => void;
  onTogglePrayer: (key: ObligatoryPrayerKey) => void;
  onToggleNotifications: () => void;
  onToggleWakeLock: () => void;
}

const PRAYER_LABELS: { key: ObligatoryPrayerKey; ar: string; de: string }[] = [
  { key: 'Fajr', ar: 'الفجر', de: 'Fajr' },
  { key: 'Dhuhr', ar: 'الظهر', de: 'Dhuhr' },
  { key: 'Asr', ar: 'العصر', de: 'Asr' },
  { key: 'Maghrib', ar: 'المغرب', de: 'Maghrib' },
  { key: 'Isha', ar: 'العشاء', de: 'Isha' }
];

export const AdhanSettingsPanel: React.FC<AdhanPanelProps> = ({
  lang,
  dstInfo,
  settings,
  activeAdhan,
  audioUnlocked,
  audioNeedsUnlock,
  notificationPermission,
  permissionsReady,
  wakeLockActive,
  syncRecord,
  onSyncNow,
  onExportICS,
  onPlayAdhan,
  onStopAdhan,
  onUnlockAudio,
  onRequestAllPermissions,
  onToggleMaster,
  onSelectMuezzin,
  onToggleDedicatedFajr,
  onChangeVolume,
  onTogglePrayer,
  onToggleNotifications,
  onToggleWakeLock
}) => {
  const [expanded, setExpanded] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [justGranted, setJustGranted] = useState(false);
  const [justSynced, setJustSynced] = useState(false);
  const selectedMuezzin = getMuezzinById(settings.muezzinId);
  const isPlayingAny = Boolean(activeAdhan);

  const handleTestSelected = () => {
    if (isPlayingAny) {
      onStopAdhan();
    } else {
      onPlayAdhan({
        muezzinId: settings.muezzinId,
        prayerNameAr: lang === 'ar' ? 'تجربة صوت الأذان المختار' : 'Adhan-Test',
        prayerNameDe: 'Adhan-Klangtest',
        isPreview: true
      });
    }
  };

  return (
    <div id="adhan-settings" className="mb-8 rounded-2xl bg-[#081e17] border border-[#d4af37]/40 shadow-2xl overflow-hidden scroll-mt-24">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0d2d22] via-[#123b2d] to-[#0d2d22] border-b border-[#1b4335] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
            settings.enabled
              ? 'bg-[#d4af37]/20 border-[#d4af37]/60 text-[#f6e09f]'
              : 'bg-[#071812] border-[#1f4a3b] text-[#7ca091]'
          }`}>
            {settings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white font-cairo">
                {lang === 'ar' ? 'الأذان التلقائي واختيار صوت المؤذن' : 'Automatischer Adhan & Muezzin-Auswahl'}
              </h3>

              {/* Live DST Summer / Winter Time Indicator */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                dstInfo.isDST
                  ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
                  : 'bg-sky-500/15 border-sky-400/40 text-sky-200'
              }`}>
                {dstInfo.isDST ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Snowflake className="w-3.5 h-3.5 text-sky-300" />}
                <span>
                  {dstInfo.isDST
                    ? (lang === 'ar' ? `التوقيت الصيفي CEST (UTC+${dstInfo.offsetHours})` : `Sommerzeit CEST (UTC+${dstInfo.offsetHours})`)
                    : (lang === 'ar' ? `التوقيت الشتوي CET (UTC+${dstInfo.offsetHours})` : `Winterzeit CET (UTC+${dstInfo.offsetHours})`)}
                </span>
              </span>
            </div>

            <p className="text-xs text-[#9ec2b4]">
              {lang === 'ar'
                ? `المؤذن المختار: ${selectedMuezzin.nameAr} · التحول القادم ${dstInfo.nextTransitionType === 'toSummer' ? 'للتوقيت الصيفي' : 'للتوقيت الشتوي'}: ${dstInfo.nextTransitionDateFormatted}`
                : `Aktueller Muezzin: ${selectedMuezzin.nameDe} · Nächste Zeitumstellung (${dstInfo.nextTransitionType === 'toSummer' ? 'Sommerzeit' : 'Winterzeit'}): ${dstInfo.nextTransitionDateFormatted}`}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleMaster}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 whitespace-nowrap ${
              settings.enabled
                ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200 hover:bg-emerald-500/30'
                : 'bg-[#071812] border-[#214b3c] text-[#9ab5aa] hover:text-white'
            }`}
          >
            {settings.enabled ? <Bell className="w-4 h-4 text-emerald-400" /> : <BellOff className="w-4 h-4" />}
            <span>
              {settings.enabled
                ? (lang === 'ar' ? 'الأذان التلقائي مفعّل' : 'Auto-Adhan aktiv')
                : (lang === 'ar' ? 'الأذان التلقائي متوقف' : 'Auto-Adhan pausiert')}
            </span>
          </button>

          <button
            type="button"
            onClick={handleTestSelected}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow ${
              isPlayingAny
                ? 'bg-rose-500/90 hover:bg-rose-500 text-white'
                : 'bg-gradient-to-r from-[#d4af37] to-[#b38f22] hover:brightness-110 text-[#061510]'
            }`}
          >
            {isPlayingAny ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>
              {isPlayingAny
                ? (lang === 'ar' ? 'إيقاف الأذان' : 'Adhan stoppen')
                : (lang === 'ar' ? 'تجربة صوت الأذان' : 'Adhan anhören')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl bg-[#071812] hover:bg-[#103428] border border-[#1d4638] text-[#d4af37]"
            aria-label="Toggle Adhan Options"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Browser Autoplay & Notifications Permission Bar */}
      {(audioNeedsUnlock || !permissionsReady || justGranted) && (
        <div className={`px-4 sm:px-5 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          justGranted
            ? 'bg-emerald-500/15 border-emerald-400/35 text-emerald-100'
            : 'bg-amber-500/15 border-amber-400/35 text-amber-100'
        }`}>
          <div className="flex items-start sm:items-center gap-2.5">
            <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 sm:mt-0 ${justGranted ? 'text-emerald-300' : 'text-[#d4af37]'}`} />
            <div>
              {justGranted ? (
                <span className="font-bold">
                  {lang === 'ar'
                    ? 'تم منح صلاحيات الصوت والإشعارات! سيؤذن التطبيق تلقائياً عند كل صلاة في وقتها.'
                    : 'Berechtigungen erteilt! Der Adhan ertönt automatisch zu jeder Gebetszeit.'}
                </span>
              ) : (
                <span>
                  {lang === 'ar'
                    ? 'لتشغيل الأذان تلقائياً عند كل صلاة (الفجر، الظهر، العصر، المغرب، العشاء) وإرسال تنبيه، يرجى منح الصلاحيات:'
                    : 'Für automatischen Adhan zu allen 5 Gebeten & Benachrichtigungen bitte einmalig Berechtigung erteilen:'}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!permissionsReady && (
              <button
                type="button"
                onClick={async () => {
                  await onRequestAllPermissions();
                  setJustGranted(true);
                  setTimeout(() => setJustGranted(false), 5000);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#d4af37] text-[#061510] font-bold hover:brightness-110 whitespace-nowrap shadow"
              >
                {lang === 'ar' ? 'منح الصلاحيات وتفعيل الأذان' : 'Berechtigungen jetzt erteilen'}
              </button>
            )}
            {audioNeedsUnlock && (
              <button
                type="button"
                onClick={() => {
                  onUnlockAudio();
                  onPlayAdhan({
                    muezzinId: settings.muezzinId,
                    prayerNameAr: 'تفعيل صوت الأذان',
                    prayerNameDe: 'Audio aktiviert',
                    isPreview: true
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0e3226] text-[#f6e09f] border border-[#d4af37]/50 font-semibold whitespace-nowrap"
              >
                {lang === 'ar' ? 'تشغيل تجريبي' : 'Test abspielen'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Daily Sync & Permissions Live Status Strip (Always visible even when collapsed on mobile) */}
      <div className="px-4 sm:px-5 py-2.5 bg-[#05150f] border-b border-[#163a2d] flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#b4d2c5]">
          <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
            <RefreshCw className={`w-3.5 h-3.5 ${justSynced ? 'animate-spin' : ''}`} />
            <span>
              {lang === 'ar'
                ? `متزامن يومياً تلقائياً • آخر تحديث (${syncRecord.syncedTimeFormatted} ${syncRecord.tzAbbr})`
                : `Täglich synchronisiert • Stand (${syncRecord.syncedTimeFormatted} ${syncRecord.tzAbbr})`}
            </span>
          </span>

          <span className="text-[#406b5c]" aria-hidden="true">|</span>

          <span className={audioUnlocked ? 'text-emerald-300' : 'text-amber-300'}>
            {lang === 'ar'
              ? `الصوت: ${audioUnlocked ? 'مفعل' : 'بانتظار التفعيل'}`
              : `Audio: ${audioUnlocked ? 'Bereit' : 'Tippen zum Aktivieren'}`}
          </span>

          <span className="text-[#406b5c]" aria-hidden="true">|</span>

          <span className={notificationPermission === 'granted' ? 'text-emerald-300' : notificationPermission === 'denied' ? 'text-rose-300' : 'text-amber-300'}>
            {lang === 'ar'
              ? `الإشعارات: ${notificationPermission === 'granted' ? 'ممنوحة' : notificationPermission === 'denied' ? 'محظورة' : 'غير ممنوحة'}`
              : `Meldungen: ${notificationPermission === 'granted' ? 'Erlaubt' : notificationPermission === 'denied' ? 'Blockiert' : 'Ausstehend'}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              onSyncNow();
              setJustSynced(true);
              setTimeout(() => setJustSynced(false), 1200);
            }}
            className="px-2.5 py-1 rounded-md bg-[#0e3226] hover:bg-[#154837] text-[#f6e09f] border border-[#1f5140] font-semibold flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{justSynced ? (lang === 'ar' ? 'تم التحديث!' : 'Aktualisiert!') : (lang === 'ar' ? 'مزامنة الآن' : 'Jetzt syncen')}</span>
          </button>

          <button
            type="button"
            onClick={onExportICS}
            className="px-2.5 py-1 rounded-md bg-[#0e3226] hover:bg-[#154837] text-[#cbe2d7] border border-[#1f5140] font-semibold flex items-center gap-1 transition-colors"
            title={lang === 'ar' ? 'إضافة منبهات 30 يوماً لتقويم الهاتف' : '30-Tage Gebetsalarme in Kalender speichern'}
          >
            <CalendarPlus className="w-3 h-3 text-[#d4af37]" />
            <span>{lang === 'ar' ? 'منبهات التقويم (.ics)' : 'Kalender-Alarm (.ics)'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleWakeLock}
            className={`px-2.5 py-1 rounded-md border font-semibold flex items-center gap-1 transition-colors ${
              wakeLockActive
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                : 'bg-[#081f17] border-[#1b4637] text-[#9ebfb1] hover:text-white'
            }`}
            title={lang === 'ar' ? 'منع إغلاق الشاشة لتشغيل الأذان باستمرار' : 'Bildschirm aktiv halten'}
          >
            <Smartphone className="w-3 h-3" />
            <span>
              {wakeLockActive
                ? (lang === 'ar' ? 'الشاشة نشطة' : 'Display wach')
                : (lang === 'ar' ? 'إبقاء الشاشة نشطة' : 'Wach halten')}
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Configuration Area */}
      {expanded && (
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Top Row: Prayer Selection, Volume, Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#05140f] p-4 rounded-xl border border-[#173e31]">
            
            {/* Which Prayers play Adhan */}
            <div className="lg:col-span-6 space-y-2">
              <div className="text-xs font-semibold text-[#d4af37] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الصلوات التي يُرفع فيها الأذان تلقائياً:' : 'Adhan aktivieren für:'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRAYER_LABELS.map((p) => {
                  const active = settings.enabledPrayers[p.key];
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => onTogglePrayer(p.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        active
                          ? 'bg-[#123d2f] border-[#d4af37]/70 text-[#f6e09f]'
                          : 'bg-[#04100c] border-[#18382d] text-[#6d8f82] hover:text-white'
                      }`}
                    >
                      {active ? <Volume2 className="w-3 h-3 text-[#d4af37]" /> : <VolumeX className="w-3 h-3" />}
                      <span>{lang === 'ar' ? p.ar : p.de}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Control */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#b9d6c9]">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{lang === 'ar' ? 'مستوى صوت الأذان:' : 'Lautstärke:'}</span>
                </span>
                <span className="font-mono text-[#f6e09f]">{Math.round(settings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={settings.volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
            </div>

            {/* Browser Notifications */}
            <div className="lg:col-span-2 flex lg:justify-end">
              <button
                type="button"
                onClick={onToggleNotifications}
                className={`w-full lg:w-auto px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  settings.notificationsEnabled
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                    : 'bg-[#092119] border-[#1d4638] text-[#b4d2c6] hover:border-[#d4af37]/60'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>
                  {settings.notificationsEnabled
                    ? (lang === 'ar' ? 'الإشعارات مفعلة' : 'Benachrichtigung an')
                    : (lang === 'ar' ? 'تفعيل الإشعارات' : 'Benachrichtigung')}
                </span>
              </button>
            </div>
          </div>

          {/* Dedicated Fajr Adhan Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0b2920] to-[#071c15] border border-[#1f4d3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#134232] border border-[#d4af37]/40 text-[#f6e09f] shrink-0">
                <Sunrise className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white font-cairo">
                  {lang === 'ar' ? FAJR_SPECIAL_ADHAN.nameAr : FAJR_SPECIAL_ADHAN.nameDe}
                </div>
                <p className="text-xs text-[#9ec2b4] mt-0.5">
                  {lang === 'ar' ? FAJR_SPECIAL_ADHAN.styleAr : FAJR_SPECIAL_ADHAN.styleDe}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (activeAdhan?.muezzinId === FAJR_SPECIAL_ADHAN.id) {
                    onStopAdhan();
                  } else {
                    onPlayAdhan({
                      muezzinId: FAJR_SPECIAL_ADHAN.id,
                      prayerKey: 'Fajr',
                      prayerNameAr: 'أذان الفجر الخاص',
                      prayerNameDe: 'Spezieller Fajr-Adhan',
                      isPreview: true
                    });
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeAdhan?.muezzinId === FAJR_SPECIAL_ADHAN.id
                    ? 'bg-rose-500/80 border-rose-400 text-white'
                    : 'bg-[#10382b] border-[#d4af37]/40 text-[#f6e09f] hover:bg-[#174d3b]'
                }`}
              >
                {activeAdhan?.muezzinId === FAJR_SPECIAL_ADHAN.id ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>{lang === 'ar' ? 'إيقاف' : 'Stopp'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>{lang === 'ar' ? 'استماع' : 'Anhören'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onToggleDedicatedFajr}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
                  settings.useDedicatedFajrAdhan
                    ? 'bg-[#d4af37] border-[#d4af37] text-[#061510]'
                    : 'bg-[#05140f] border-[#1f4a3b] text-[#9cb8ad] hover:text-white'
                }`}
              >
                {settings.useDedicatedFajrAdhan
                  ? (lang === 'ar' ? 'مفعّل عند الفجر' : 'Für Fajr aktiv')
                  : (lang === 'ar' ? 'استخدام المؤذن العام' : 'Standard-Muezzin')}
              </button>
            </div>
          </div>

          {/* Muezzin Voices Grid */}
          <div>
            <div className="text-xs font-bold text-[#d4af37] mb-3">
              {lang === 'ar'
                ? 'اختر صوت المؤذن المفضل للصلوات الخمس (اضغط على «استماع» للمعاينة قبل الاختيار):'
                : 'Wählen Sie Ihren bevorzugten Muezzin für die täglichen Gebete:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MUEZZIN_VOICES.map((voice) => {
                const isSelected = settings.muezzinId === voice.id;
                const isThisPlaying = activeAdhan?.muezzinId === voice.id;

                return (
                  <div
                    key={voice.id}
                    onClick={() => onSelectMuezzin(voice.id)}
                    className={`cursor-pointer rounded-xl p-3.5 border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#144334] to-[#0b271e] border-[#d4af37] shadow-lg shadow-[#d4af37]/10 ring-1 ring-[#d4af37]/50'
                        : 'bg-[#05140f] border-[#183e31] hover:border-[#2e6b56]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-white font-cairo flex items-center gap-1.5">
                          <span>{lang === 'ar' ? voice.nameAr : voice.nameDe}</span>
                        </div>
                        <div className="text-[11px] text-[#d4af37] font-medium mt-0.5">
                          {lang === 'ar' ? voice.originAr : voice.originDe}
                        </div>
                        <p className="text-[11px] text-[#9ec2b4] mt-1 leading-relaxed">
                          {lang === 'ar' ? voice.styleAr : voice.styleDe}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-[#d4af37] border-[#d4af37] text-[#061510]'
                          : 'border-[#2c5d4d]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#15392c]">
                      <span className="text-[11px] text-[#84a99a]">
                        {isSelected
                          ? (lang === 'ar' ? 'المؤذن المختار حالياً' : 'Ausgewählt')
                          : (lang === 'ar' ? 'اضغط للاختيار' : 'Zum Auswählen klicken')}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isThisPlaying) {
                            onStopAdhan();
                          } else {
                            onPlayAdhan({
                              muezzinId: voice.id,
                              prayerNameAr: lang === 'ar' ? voice.nameAr : voice.nameDe,
                              prayerNameDe: voice.nameDe,
                              isPreview: true
                            });
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isThisPlaying
                            ? 'bg-rose-500 text-white'
                            : 'bg-[#10382b] hover:bg-[#184f3d] text-[#f6e09f] border border-[#d4af37]/35'
                        }`}
                      >
                        {isThisPlaying ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>{lang === 'ar' ? 'إيقاف' : 'Stopp'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>{lang === 'ar' ? 'استماع' : 'Hören'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export const ActiveAdhanBanner: React.FC<{
  lang: Language;
  activeAdhan: ActiveAdhanState | null;
  onStop: () => void;
}> = ({ lang, activeAdhan, onStop }) => {
  if (!activeAdhan) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] z-50 rounded-2xl bg-[#072017]/95 backdrop-blur-md border border-[#d4af37] p-4 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-[#061510] flex items-center justify-center shrink-0 animate-pulse">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#f6e09f] truncate">
              {lang === 'ar' ? activeAdhan.prayerNameAr : activeAdhan.prayerNameDe}
            </div>
            <div className="text-xs text-[#cde2d9] truncate">
              {lang === 'ar' ? activeAdhan.muezzinNameAr : activeAdhan.muezzinNameDe}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onStop}
          className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>{lang === 'ar' ? 'إيقاف' : 'Stopp'}</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-[#03100b] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#d4af37] to-emerald-400 transition-all duration-300"
          style={{ width: `${Math.max(4, activeAdhan.progress)}%` }}
        />
      </div>
    </div>
  );
};

// Proactive Top-Level Permission Prompt so users are clearly asked on arrival to grant Audio & Notification permissions
export const AdhanPermissionPrompt: React.FC<{
  lang: Language;
  visible: boolean;
  onGrant: () => Promise<unknown>;
  onDismiss: () => void;
}> = ({ lang, visible, onGrant, onDismiss }) => {
  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-[#133d2f] via-[#19503d] to-[#133d2f] border-b border-[#d4af37]/50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-[#061510] flex items-center justify-center shrink-0 shadow">
            <Bell className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-[#f6e09f] block sm:inline">
              {lang === 'ar'
                ? 'صلاحيات الأذان التلقائي لكل صلاة: '
                : 'Auto-Adhan Berechtigung: '}
            </span>
            <span className="text-[#dcece4]">
              {lang === 'ar'
                ? 'اضغط لمنح صلاحية الصوت والإشعارات كي يرفع الأذان تلقائياً عند كل صلاة وتتزامن المواقيت يومياً.'
                : 'Tippen Sie hier, um Audio & Benachrichtigungen für alle 5 Gebetszeiten zu aktivieren.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => void onGrant()}
            className="px-3.5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#e5bf44] text-[#061510] text-xs font-bold shadow transition-all whitespace-nowrap"
          >
            {lang === 'ar' ? 'منح الصلاحيات وتفعيل الأذان' : 'Berechtigungen erteilen'}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-[#b4d2c5] hover:text-white hover:bg-[#0b271e]"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

