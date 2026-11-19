import {
  DaySchedule,
  GREGORIAN_MONTHS_AR,
  GREGORIAN_MONTHS_DE,
  calculatePrayerTimesForYMD,
  getBerlinDSTDetails,
  getHijriDateParts,
  getRostockDateTimeParts
} from './prayerTimes';
import { Language } from './translations';

export const SYNC_STORAGE_KEY = 'ib_rostock_daily_sync_v1';

export interface DailySyncRecord {
  syncedIsoDate: string;
  syncedAtTimestamp: number;
  syncedTimeFormatted: string;
  tzAbbr: 'CET' | 'CEST';
  daysCount: number;
  schedule: DaySchedule[];
}

export function generateRollingSchedule(daysCount = 30, now = new Date()): DaySchedule[] {
  const rostockToday = getRostockDateTimeParts(now);
  const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const germanDays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  const rows: DaySchedule[] = [];
  for (let offset = 0; offset < daysCount; offset++) {
    const utcDate = new Date(Date.UTC(rostockToday.year, rostockToday.month - 1, rostockToday.day + offset, 12, 0, 0));
    const y = utcDate.getUTCFullYear();
    const m = utcDate.getUTCMonth() + 1;
    const d = utcDate.getUTCDate();
    const weekday = utcDate.getUTCDay();
    const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const gregorianDate = `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${y}`;
    const hijri = getHijriDateParts(y, m, d);
    const times = calculatePrayerTimesForYMD(y, m, d);

    rows.push({
      dayNumber: d,
      gregorianDate,
      isoDate,
      dayNameAr: arabicDays[weekday],
      dayNameDe: germanDays[weekday],
      hijri,
      isRamadan: hijri.month === 9,
      ramadanDay: hijri.month === 9 ? hijri.day : null,
      imsak: times.imsak,
      fajr: times.fajr,
      sunrise: times.sunrise,
      dhuhr: times.dhuhr,
      asr: times.asr,
      maghrib: times.maghrib,
      isha: times.isha,
      isToday: offset === 0
    });
  }
  return rows;
}

export function loadDailySyncRecord(): DailySyncRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SYNC_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DailySyncRecord;
  } catch {
    return null;
  }
}

// Synchronizes and caches 30 days of Rostock prayer times whenever day changes or user forces refresh
export function syncDailyPrayerSchedule(force = false, now = new Date()): DailySyncRecord {
  const rostock = getRostockDateTimeParts(now);
  const dst = getBerlinDSTDetails(now);
  const existing = loadDailySyncRecord();

  if (!force && existing && existing.syncedIsoDate === rostock.isoDate && existing.schedule?.length >= 30) {
    return existing;
  }

  const schedule = generateRollingSchedule(30, now);
  const pad = (n: number) => String(n).padStart(2, '0');
  const record: DailySyncRecord = {
    syncedIsoDate: rostock.isoDate,
    syncedAtTimestamp: now.getTime(),
    syncedTimeFormatted: `${pad(rostock.hour)}:${pad(rostock.minute)}`,
    tzAbbr: dst.abbr,
    daysCount: schedule.length,
    schedule
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage quota errors
    }
  }

  return record;
}

// Build downloadable 30-day .ics calendar with prayer-time alarms for Android/iOS native alerts
export function downloadPrayerAlarmsICS(lang: Language, daysCount = 30): void {
  const schedule = generateRollingSchedule(daysCount);
  const pad = (n: number) => String(n).padStart(2, '0');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Islamischer Bund Rostock e.V.//Prayer Times//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${lang === 'ar' ? 'مواقيت الصلاة - روستوك' : 'Gebetszeiten Rostock'}`,
    'X-WR-TIMEZONE:Europe/Berlin'
  ];

  const prayerDefs: { key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; ar: string; de: string }[] = [
    { key: 'fajr', ar: 'أذان الفجر', de: 'Adhan al-Fajr' },
    { key: 'dhuhr', ar: 'أذان الظهر', de: 'Adhan al-Dhuhr' },
    { key: 'asr', ar: 'أذان العصر', de: 'Adhan al-Asr' },
    { key: 'maghrib', ar: 'أذان المغرب', de: 'Adhan al-Maghrib' },
    { key: 'isha', ar: 'أذان العشاء', de: 'Adhan al-Isha' }
  ];

  for (const day of schedule) {
    const [yStr, mStr, dStr] = day.isoDate.split('-');
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);

    for (const p of prayerDefs) {
      const timeStr = day[p.key];
      const [hh, mm] = timeStr.split(':').map(Number);
      const dtStart = `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
      const endMinTotal = hh * 60 + mm + 10;
      const endH = Math.floor(endMinTotal / 60) % 24;
      const endM = endMinTotal % 60;
      const dtEnd = `${y}${pad(m)}${pad(d)}T${pad(endH)}${pad(endM)}00`;
      const summary = lang === 'ar' ? `${p.ar} — روستوك` : `${p.de} — Rostock`;
      const desc =
        lang === 'ar'
          ? `الرابطة الإسلامية في مدينة روستوك • ${day.gregorianDate}`
          : `Islamischer Bund Rostock e.V. • ${day.gregorianDate}`;

      lines.push(
        'BEGIN:VEVENT',
        `UID:${day.isoDate}-${p.key}@moschee-rostock.de`,
        `DTSTART;TZID=Europe/Berlin:${dtStart}`,
        `DTEND;TZID=Europe/Berlin:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${desc}`,
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${summary}`,
        'TRIGGER:-PT0M',
        'END:VALARM',
        'END:VEVENT'
      );
    }
  }

  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const monthLabel =
    lang === 'ar'
      ? GREGORIAN_MONTHS_AR[new Date().getMonth()]
      : GREGORIAN_MONTHS_DE[new Date().getMonth()];
  link.href = url;
  link.download = `Rostock_Adhan_Alarms_${monthLabel}.ics`.replace(/\s+/g, '_');
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
