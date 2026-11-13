// Rostock coordinates (Mecklenburg-Vorpommern, Germany)
export const ROSTOCK_COORDS = {
  latitude: 54.0924,
  longitude: 12.0991,
  city: "Rostock",
  country: "Germany",
  timezone: "Europe/Berlin"
};

export const HIJRI_MONTHS_AR = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة"
];

export const HIJRI_MONTHS_DE = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Dschumada al-Ula",
  "Dschumada al-Achira",
  "Radschab",
  "Schaban",
  "Ramadan",
  "Schawwal",
  "Dhu al-Qida",
  "Dhu al-Hiddscha"
];

export const GREGORIAN_MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

export const GREGORIAN_MONTHS_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];

export interface HijriDateInfo {
  day: number;
  month: number; // 1..12
  year: number;
  monthNameAr: string;
  monthNameDe: string;
}

export interface PrayerTime {
  name: string;
  nameAr: string;
  nameDe: string;
  time: string; // "HH:MM"
  timestampMs: number;
  isNext: boolean;
  isPast: boolean;
}

export interface DaySchedule {
  dayNumber: number; // Gregorian day of month or Ramadan day
  gregorianDate: string; // DD.MM.YYYY
  isoDate: string; // YYYY-MM-DD
  dayNameAr: string;
  dayNameDe: string;
  hijri: HijriDateInfo;
  isRamadan: boolean;
  ramadanDay: number | null;
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  isToday: boolean;
}

export interface RamadanYearSummary {
  hijriYear: number;
  startGregorianIso: string;
  startGregorianFormatted: string;
  endGregorianFormatted: string;
  gregorianYear: number;
  daysCount: number;
  daysUntilStart: number;
  isCurrent: boolean;
}

// Extract exact Rostock local date/time parts using Europe/Berlin
export function getRostockDateTimeParts(now = new Date()): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  isoDate: string;
} {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: ROSTOCK_COORDS.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const parts = fmt.formatToParts(now);
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value || 0);
  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour") === 24 ? 0 : get("hour");
  const minute = get("minute");
  const second = get("second");
  const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { year, month, day, hour, minute, second, isoDate };
}

// Get exact Europe/Berlin UTC offset in hours (+1 for CET, +2 for CEST) for any Gregorian date
export function getBerlinTimeZoneOffsetHours(year: number, month: number, day: number): number {
  try {
    const probe = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: ROSTOCK_COORDS.timezone,
      timeZoneName: "shortOffset"
    });
    const tzPart = fmt.formatToParts(probe).find(p => p.type === "timeZoneName")?.value || "GMT+1";
    const match = tzPart.match(/GMT([+-]\d+)/);
    if (match) return parseInt(match[1], 10);
  } catch {
    // Fallback to EU DST rules
  }
  // EU DST: Last Sunday of March to Last Sunday of October
  if (month > 3 && month < 10) return 2;
  if (month < 3 || month > 10) return 1;
  const lastDayOfMonth = new Date(Date.UTC(year, month, 0));
  const lastSunday = lastDayOfMonth.getUTCDate() - lastDayOfMonth.getUTCDay();
  if (month === 3) return day >= lastSunday ? 2 : 1;
  return day < lastSunday ? 2 : 1;
}

// Convert Gregorian Y-M-D to Hijri (Umm al-Qura) reliably
export function getHijriDateParts(year: number, month: number, day: number): HijriDateInfo {
  const probe = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
  const parts = fmt.formatToParts(probe);
  const hDay = Number(parts.find(p => p.type === "day")?.value || 1);
  const hMonth = Number(parts.find(p => p.type === "month")?.value || 1);
  const hYear = Number(parts.find(p => p.type === "year")?.value || 1448);

  return {
    day: hDay,
    month: hMonth,
    year: hYear,
    monthNameAr: HIJRI_MONTHS_AR[hMonth - 1] || "",
    monthNameDe: HIJRI_MONTHS_DE[hMonth - 1] || ""
  };
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function fixAngle(a: number): number {
  a = a - 360 * Math.floor(a / 360);
  return a < 0 ? a + 360 : a;
}

function formatHours(hours: number): string {
  const normalized = ((hours % 24) + 24) % 24;
  let h = Math.floor(normalized);
  let m = Math.round((normalized - h) * 60);
  if (m === 60) {
    h = (h + 1) % 24;
    m = 0;
  }
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseTimeToMinutes(timeStr: string): { h: number; m: number } {
  const [h, m] = timeStr.split(":").map(Number);
  return { h, m };
}

// High-precision NOAA/Meeus solar calculation for Rostock (valid across decades)
export function calculatePrayerTimesForYMD(
  year: number,
  month: number,
  day: number,
  lat = ROSTOCK_COORDS.latitude,
  lng = ROSTOCK_COORDS.longitude
): {
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  tzOffset: number;
} {
  const tzOffset = getBerlinTimeZoneOffsetHours(year, month, day);

  // Julian Date at 12:00 UTC
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;

  // Days since J2000.0
  const d = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const L = fixAngle(q + 1.915 * Math.sin(toRadians(g)) + 0.020 * Math.sin(toRadians(2 * g)));

  const e = 23.439 - 0.00000036 * d;
  const RA = toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L)))) / 15;
  const declination = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));
  const eqT = q / 15 - fixAngle(RA * 15) / 15;

  // Adjust eqT to [-0.5, 0.5] hours
  let eqTHours = eqT;
  if (eqTHours > 12) eqTHours -= 24;
  if (eqTHours < -12) eqTHours += 24;

  const solarNoon = 12 + tzOffset - lng / 15 - eqTHours;

  const getHourAngle = (altitudeDeg: number): number | null => {
    const latRad = toRadians(lat);
    const declRad = toRadians(declination);
    const altRad = toRadians(altitudeDeg);
    const cosHA = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(declRad)) / (Math.cos(latRad) * Math.cos(declRad));
    if (cosHA > 1 || cosHA < -1) return null;
    return toDegrees(Math.acos(cosHA)) / 15; // in hours
  };

  // Sunrise / Sunset (-0.833° refraction + solar disc radius)
  const haSun = getHourAngle(-0.833) ?? 6;
  const sunriseHours = solarNoon - haSun;
  const sunsetHours = solarNoon + haSun;
  const nightLength = 24 - (sunsetHours - sunriseHours);

  // Fajr (16.5° adapted for northern Germany; One-Seventh of Night fallback in midsummer)
  const haFajr = getHourAngle(-16.5);
  const fajrHours = haFajr !== null
    ? solarNoon - haFajr
    : sunriseHours - nightLength / 7;

  // Asr (Shafi'i / standard majority: shadow = 1 + noon shadow)
  const noonAlt = 90 - Math.abs(lat - declination);
  const noonShadow = 1 / Math.tan(toRadians(noonAlt));
  const asrAlt = toDegrees(Math.atan(1 / (1 + noonShadow)));
  const haAsr = getHourAngle(asrAlt) ?? 3.5;
  const asrHours = solarNoon + haAsr;

  // Maghrib (sunset + 2 min precaution)
  const maghribHours = sunsetHours + 2 / 60;

  // Isha (15° adapted for northern Germany; One-Seventh of Night fallback in midsummer)
  const haIsha = getHourAngle(-15.0);
  const ishaHours = haIsha !== null
    ? solarNoon + haIsha
    : sunsetHours + nightLength / 7;

  // Imsak (10 minutes before Fajr)
  const imsakHours = fajrHours - 10 / 60;

  return {
    imsak: formatHours(imsakHours),
    fajr: formatHours(fajrHours),
    sunrise: formatHours(sunriseHours),
    dhuhr: formatHours(solarNoon + 2 / 60),
    asr: formatHours(asrHours),
    maghrib: formatHours(maghribHours),
    isha: formatHours(ishaHours),
    tzOffset
  };
}

// Convert Rostock local Y-M-D HH:MM to exact UTC epoch milliseconds
function rostockTimeToUtcMs(year: number, month: number, day: number, timeStr: string, tzOffset: number): number {
  const { h, m } = parseTimeToMinutes(timeStr);
  return Date.UTC(year, month - 1, day, h - tzOffset, m, 0);
}

// Live prayer state & countdown calibrated strictly to Rostock local clock
export function getCurrentPrayers(now = new Date()): {
  rostockNow: ReturnType<typeof getRostockDateTimeParts>;
  todayHijri: HijriDateInfo;
  prayers: PrayerTime[];
  nextPrayer: PrayerTime;
  timeUntilNext: { hours: number; minutes: number; seconds: number };
  timeUntilIftar: { hours: number; minutes: number; seconds: number; isIftarSoon: boolean };
  timeUntilSuhoor: { hours: number; minutes: number; seconds: number; isSuhoorSoon: boolean };
} {
  const rostockNow = getRostockDateTimeParts(now);
  const todayHijri = getHijriDateParts(rostockNow.year, rostockNow.month, rostockNow.day);
  const times = calculatePrayerTimesForYMD(rostockNow.year, rostockNow.month, rostockNow.day);

  const tomorrowDate = new Date(Date.UTC(rostockNow.year, rostockNow.month - 1, rostockNow.day + 1));
  const tomY = tomorrowDate.getUTCFullYear();
  const tomM = tomorrowDate.getUTCMonth() + 1;
  const tomD = tomorrowDate.getUTCDate();
  const tomorrowTimes = calculatePrayerTimesForYMD(tomY, tomM, tomD);

  const nowMs = now.getTime();

  const list = [
    { name: "Fajr", nameAr: "الفجر", nameDe: "Fajr", time: times.fajr },
    { name: "Sunrise", nameAr: "الشروق", nameDe: "Sonnenaufgang", time: times.sunrise },
    { name: "Dhuhr", nameAr: "الظهر", nameDe: "Dhuhr", time: times.dhuhr },
    { name: "Asr", nameAr: "العصر", nameDe: "Asr", time: times.asr },
    { name: "Maghrib", nameAr: "المغرب", nameDe: "Maghrib", time: times.maghrib },
    { name: "Isha", nameAr: "العشاء", nameDe: "Isha", time: times.isha }
  ].map(p => ({
    ...p,
    timestampMs: rostockTimeToUtcMs(rostockNow.year, rostockNow.month, rostockNow.day, p.time, times.tzOffset)
  }));

  let nextIndex = list.findIndex(p => p.timestampMs > nowMs);
  let nextPrayerObj: PrayerTime;

  if (nextIndex === -1) {
    const tomFajrMs = rostockTimeToUtcMs(tomY, tomM, tomD, tomorrowTimes.fajr, tomorrowTimes.tzOffset);
    nextPrayerObj = {
      name: "Fajr",
      nameAr: "الفجر",
      nameDe: "Fajr",
      time: tomorrowTimes.fajr,
      timestampMs: tomFajrMs,
      isNext: true,
      isPast: false
    };
    nextIndex = 0;
  } else {
    nextPrayerObj = {
      ...list[nextIndex],
      isNext: true,
      isPast: false
    };
  }

  const prayers: PrayerTime[] = list.map((p, idx) => ({
    ...p,
    isNext: idx === nextIndex && p.timestampMs > nowMs,
    isPast: p.timestampMs <= nowMs
  }));

  const splitMs = (ms: number) => {
    const safe = Math.max(0, ms);
    return {
      hours: Math.floor(safe / 3600000),
      minutes: Math.floor((safe % 3600000) / 60000),
      seconds: Math.floor((safe % 60000) / 1000)
    };
  };

  const timeUntilNext = splitMs(nextPrayerObj.timestampMs - nowMs);

  let iftarMs = rostockTimeToUtcMs(rostockNow.year, rostockNow.month, rostockNow.day, times.maghrib, times.tzOffset);
  if (nowMs > iftarMs) {
    iftarMs = rostockTimeToUtcMs(tomY, tomM, tomD, tomorrowTimes.maghrib, tomorrowTimes.tzOffset);
  }
  const iftarParts = splitMs(iftarMs - nowMs);

  let suhoorMs = rostockTimeToUtcMs(rostockNow.year, rostockNow.month, rostockNow.day, times.fajr, times.tzOffset);
  if (nowMs > suhoorMs) {
    suhoorMs = rostockTimeToUtcMs(tomY, tomM, tomD, tomorrowTimes.fajr, tomorrowTimes.tzOffset);
  }
  const suhoorParts = splitMs(suhoorMs - nowMs);

  return {
    rostockNow,
    todayHijri,
    prayers,
    nextPrayer: nextPrayerObj,
    timeUntilNext,
    timeUntilIftar: {
      ...iftarParts,
      isIftarSoon: iftarParts.hours === 0 && iftarParts.minutes <= 30
    },
    timeUntilSuhoor: {
      ...suhoorParts,
      isSuhoorSoon: suhoorParts.hours === 0 && suhoorParts.minutes <= 30
    }
  };
}

// Generate all days for a given Gregorian year & month (1..12)
export function generateMonthlyPrayerCalendar(year: number, month: number, now = new Date()): DaySchedule[] {
  const arabicDays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const germanDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

  const rostockToday = getRostockDateTimeParts(now);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const rows: DaySchedule[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const utcDate = new Date(Date.UTC(year, month - 1, d, 12, 0, 0));
    const weekday = utcDate.getUTCDay();
    const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const gregorianDate = `${String(d).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
    const hijri = getHijriDateParts(year, month, d);
    const times = calculatePrayerTimesForYMD(year, month, d);

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
      isToday: isoDate === rostockToday.isoDate
    });
  }

  return rows;
}

// Find exact Gregorian start date of Ramadan for a given Hijri year
export function findRamadanStartDate(hijriYear: number): { year: number; month: number; day: number } {
  // Approximate Gregorian year around 1 Ramadan
  const approxYear = Math.floor(hijriYear * 0.970224 + 622.25);
  let probe = new Date(Date.UTC(approxYear, 0, 1, 12, 0, 0));

  const isOnOrAfterRamadan = (h: HijriDateInfo) =>
    h.year > hijriYear || (h.year === hijriYear && h.month >= 9);

  // If probe starts on/after Ramadan of target year, rewind safely before it
  for (let back = 0; back < 30; back++) {
    const h = getHijriDateParts(probe.getUTCFullYear(), probe.getUTCMonth() + 1, probe.getUTCDate());
    if (!isOnOrAfterRamadan(h)) break;
    probe.setUTCDate(probe.getUTCDate() - 25);
  }

  // Coarse step forward by 15 days until we reach or pass Ramadan of target year
  for (let step = 0; step < 50; step++) {
    const h = getHijriDateParts(probe.getUTCFullYear(), probe.getUTCMonth() + 1, probe.getUTCDate());
    if (isOnOrAfterRamadan(h)) {
      probe.setUTCDate(probe.getUTCDate() - 32);
      break;
    }
    probe.setUTCDate(probe.getUTCDate() + 15);
  }

  // Fine step day by day until exact 1 Ramadan of hijriYear
  for (let i = 0; i < 70; i++) {
    const y = probe.getUTCFullYear();
    const m = probe.getUTCMonth() + 1;
    const d = probe.getUTCDate();
    const h = getHijriDateParts(y, m, d);
    if (h.year === hijriYear && h.month === 9 && h.day === 1) {
      return { year: y, month: m, day: d };
    }
    probe.setUTCDate(d + 1);
  }

  return { year: approxYear, month: 2, day: 1 };
}

// Generate full 29 or 30-day Ramadan Imsakiya for any Hijri year
export function generateRamadanImsakiyaByHijriYear(hijriYear: number, now = new Date()): DaySchedule[] {
  const arabicDays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const germanDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

  const rostockToday = getRostockDateTimeParts(now);
  const start = findRamadanStartDate(hijriYear);
  const rows: DaySchedule[] = [];

  for (let i = 0; i < 30; i++) {
    const utcDate = new Date(Date.UTC(start.year, start.month - 1, start.day + i, 12, 0, 0));
    const y = utcDate.getUTCFullYear();
    const m = utcDate.getUTCMonth() + 1;
    const d = utcDate.getUTCDate();
    const hijri = getHijriDateParts(y, m, d);

    // Stop if month rolled over to Shawwal (month 10) for 29-day Ramadan
    if (hijri.month !== 9) break;

    const weekday = utcDate.getUTCDay();
    const isoDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const gregorianDate = `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
    const times = calculatePrayerTimesForYMD(y, m, d);

    rows.push({
      dayNumber: hijri.day,
      gregorianDate,
      isoDate,
      dayNameAr: arabicDays[weekday],
      dayNameDe: germanDays[weekday],
      hijri,
      isRamadan: true,
      ramadanDay: hijri.day,
      imsak: times.imsak,
      fajr: times.fajr,
      sunrise: times.sunrise,
      dhuhr: times.dhuhr,
      asr: times.asr,
      maghrib: times.maghrib,
      isha: times.isha,
      isToday: isoDate === rostockToday.isoDate
    });
  }

  return rows;
}

// Get upcoming 10 years of Ramadan dates + current/next Ramadan info
export function getUpcomingRamadans(now = new Date(), yearsAhead = 11): {
  currentOrNext: RamadanYearSummary;
  list: RamadanYearSummary[];
} {
  const rostockToday = getRostockDateTimeParts(now);
  const todayHijri = getHijriDateParts(rostockToday.year, rostockToday.month, rostockToday.day);
  const todayUtcMs = Date.UTC(rostockToday.year, rostockToday.month - 1, rostockToday.day);

  // If already past Ramadan in this Hijri year (month > 9), start from next Hijri year
  const firstTargetHijriYear = todayHijri.month > 9 ? todayHijri.year + 1 : todayHijri.year;

  const list: RamadanYearSummary[] = [];
  for (let offset = 0; offset < yearsAhead; offset++) {
    const hYear = firstTargetHijriYear + offset;
    const days = generateRamadanImsakiyaByHijriYear(hYear, now);
    if (days.length === 0) continue;
    const first = days[0];
    const last = days[days.length - 1];
    const [fy, fm, fd] = first.isoDate.split("-").map(Number);
    const startUtcMs = Date.UTC(fy, fm - 1, fd);
    const daysUntilStart = Math.round((startUtcMs - todayUtcMs) / 86400000);
    const isCurrent = todayHijri.year === hYear && todayHijri.month === 9;

    list.push({
      hijriYear: hYear,
      startGregorianIso: first.isoDate,
      startGregorianFormatted: first.gregorianDate,
      endGregorianFormatted: last.gregorianDate,
      gregorianYear: fy,
      daysCount: days.length,
      daysUntilStart,
      isCurrent
    });
  }

  return {
    currentOrNext: list[0],
    list
  };
}
