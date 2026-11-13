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
  Sunrise
} from 'lucide-react';

interface AdhanPanelProps {
  lang: Language;
  dstInfo: BerlinDSTInfo;
  settings: AdhanSettings;
  activeAdhan: ActiveAdhanState | null;
  audioNeedsUnlock: boolean;
  onPlayAdhan: (opts?: {
    muezzinId?: string;
    prayerKey?: ObligatoryPrayerKey;
    prayerNameAr?: string;
    prayerNameDe?: string;
    isPreview?: boolean;
  }) => void;
  onStopAdhan: () => void;
  onUnlockAudio: () => void;
  onToggleMaster: () => void;
  onSelectMuezzin: (id: string) => void;
  onToggleDedicatedFajr: () => void;
  onChangeVolume: (vol: number) => void;
  onTogglePrayer: (key: ObligatoryPrayerKey) => void;
  onToggleNotifications: () => void;
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
  audioNeedsUnlock,
  onPlayAdhan,
  onStopAdhan,
  onUnlockAudio,
  onToggleMaster,
  onSelectMuezzin,
  onToggleDedicatedFajr,
  onChangeVolume,
  onTogglePrayer,
  onToggleNotifications
}) => {
  const [expanded, setExpanded] = useState(true);
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
    <div className="mb-8 rounded-2xl bg-[#081e17] border border-[#d4af37]/40 shadow-2xl overflow-hidden">
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

      {/* Browser Autoplay Unlock Prompt (if needed) */}
      {audioNeedsUnlock && (
        <div className="px-5 py-3 bg-amber-500/15 border-b border-amber-400/35 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-100">
          <span>
            {lang === 'ar'
              ? 'حظر المتصفح تشغيل الصوت تلقائياً لعدم وجود تفاعل مسبق. اضغط هنا لتفعيل صوت الأذان التلقائي:'
              : 'Ihr Browser benötigt einmalige Zustimmung für automatisches Audio:'}
          </span>
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
            className="px-3.5 py-1.5 rounded-lg bg-[#d4af37] text-[#061510] font-bold hover:brightness-110 whitespace-nowrap"
          >
            {lang === 'ar' ? 'تفعيل وتشغيل الآن' : 'Audio aktivieren'}
          </button>
        </div>
      )}

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
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] z-50 rounded-2xl bg-[#072017]/95 backdrop-blur-md border border-[#d4af37] p-4 shadow-2xl">
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
