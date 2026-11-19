export type ObligatoryPrayerKey = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface MuezzinVoice {
  id: string;
  nameAr: string;
  nameDe: string;
  originAr: string;
  originDe: string;
  styleAr: string;
  styleDe: string;
  url: string;
}

export const MUEZZIN_VOICES: MuezzinVoice[] = [
  {
    id: 'alafasy',
    nameAr: 'الشيخ مشاري راشد العفاسي',
    nameDe: 'Scheich Mishary Rashid Alafasy',
    originAr: 'الكويت',
    originDe: 'Kuwait',
    styleAr: 'صوت عذب وهادئ مشهور عالمياً',
    styleDe: 'Melodisch, ruhig & weltweit beliebt',
    url: 'https://raw.githubusercontent.com/abodehq/Athan-MP3/master/Sounds/Athan%20Mishary%20Alafasi.mp3'
  },
  {
    id: 'makkah',
    nameAr: 'أذان الحرم المكي الشريف',
    nameDe: 'Al-Haram Al-Makki (Mekka)',
    originAr: 'مكة المكرمة',
    originDe: 'Mekka, Saudi-Arabien',
    styleAr: 'أذان المسجد الحرام المكي الشريف',
    styleDe: 'Traditioneller Ruf der Heiligen Moschee in Mekka',
    url: 'https://raw.githubusercontent.com/abodehq/Athan-MP3/master/Sounds/Athan%20Makkah.mp3'
  },
  {
    id: 'qatami',
    nameAr: 'الشيخ ناصر القطامي',
    nameDe: 'Scheich Nasser Al-Qatami',
    originAr: 'المملكة العربية السعودية',
    originDe: 'Saudi-Arabien',
    styleAr: 'نبرة روحانية خاشعة ومؤثرة',
    styleDe: 'Tief bewegend und spirituell',
    url: 'https://raw.githubusercontent.com/abodehq/Athan-MP3/master/Sounds/Athan%20Nasser%20Alqatami.mp3'
  },
  {
    id: 'abdulbasit',
    nameAr: 'الشيخ عبد الباسط عبد الصمد',
    nameDe: 'Scheich Abdul Basit Abdul Samad',
    originAr: 'مصر',
    originDe: 'Ägypten',
    styleAr: 'المقام الكلاسيكي الخالد والوقار',
    styleDe: 'Klassischer, würdevoller Klang',
    url: 'https://raw.githubusercontent.com/abodehq/Athan-MP3/master/Sounds/Athan%20Abed%20Albase6.mp3'
  },
  {
    id: 'minshawi',
    nameAr: 'الشيخ محمد صديق المنشاوي',
    nameDe: 'Scheich Muhammad Al-Minshawi',
    originAr: 'مصر',
    originDe: 'Ägypten',
    styleAr: 'صوت خاشع يلامس القلوب',
    styleDe: 'Sanft, ehrfürchtig und herzergreifend',
    url: 'https://raw.githubusercontent.com/abodehq/Athan-MP3/master/Sounds/Athan%20Mohammad%20Almenshawy.mp3'
  },
  {
    id: 'refaat',
    nameAr: 'الشيخ محمد رفعت',
    nameDe: 'Scheich Muhammad Rifaat',
    originAr: 'مصر',
    originDe: 'Ägypten',
    styleAr: 'الأذان المصري الأصيل التاريخي',
    styleDe: 'Historischer, klassischer ägyptischer Stil',
    url: 'https://raw.githubusercontent.com/abodehq/Athan-MP3/master/Sounds/Athan%20Mohammad%20Ref3at.mp3'
  },
  {
    id: 'zahrani',
    nameAr: 'الشيخ منصور الزهراني',
    nameDe: 'Scheich Mansoor Az-Zahrani',
    originAr: 'المملكة العربية السعودية',
    originDe: 'Saudi-Arabien',
    styleAr: 'أداء حجازي شجي وجميل',
    styleDe: 'Wunderschöne Hijazi-Melodie',
    url: 'https://raw.githubusercontent.com/abodehq/Athan-MP3/master/Sounds/Athan%20Mansoor%20Az-Zahrani.mp3'
  }
];

export const FAJR_SPECIAL_ADHAN: MuezzinVoice = {
  id: 'fajr_malek',
  nameAr: 'أذان الفجر — مالك شيبة (الصلاة خير من النوم)',
  nameDe: 'Fajr-Adhan — Malek Chebae (mit As-Salatu Khayrun min an-Nawm)',
  originAr: 'أذان الفجر الخاص',
  originDe: 'Spezieller Fajr-Ruf',
  styleAr: 'يتضمن عبارة «الصلاة خير من النوم» لصلاة الفجر',
  styleDe: 'Enthält den besonderen Fajr-Ruf (As-Salatu Khayrun min an-Nawm)',
  url: 'https://raw.githubusercontent.com/abodehq/Athan-MP3/master/Sounds/Athan%20Al-fajer%20-%20Malek%20chebae.mp3'
};

export interface AdhanSettings {
  enabled: boolean;
  muezzinId: string;
  useDedicatedFajrAdhan: boolean;
  volume: number; // 0..1
  notificationsEnabled: boolean;
  enabledPrayers: Record<ObligatoryPrayerKey, boolean>;
}

export const DEFAULT_ADHAN_SETTINGS: AdhanSettings = {
  enabled: true,
  muezzinId: 'alafasy',
  useDedicatedFajrAdhan: true,
  volume: 0.85,
  notificationsEnabled: false,
  enabledPrayers: {
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true
  }
};

export const ADHAN_STORAGE_KEY = 'ib_rostock_adhan_settings_v1';

export function loadAdhanSettings(): AdhanSettings {
  if (typeof window === 'undefined') return DEFAULT_ADHAN_SETTINGS;
  try {
    const raw = window.localStorage.getItem(ADHAN_STORAGE_KEY);
    if (!raw) return DEFAULT_ADHAN_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AdhanSettings>;
    return {
      ...DEFAULT_ADHAN_SETTINGS,
      ...parsed,
      enabledPrayers: {
        ...DEFAULT_ADHAN_SETTINGS.enabledPrayers,
        ...(parsed.enabledPrayers || {})
      }
    };
  } catch {
    return DEFAULT_ADHAN_SETTINGS;
  }
}

export function saveAdhanSettings(settings: AdhanSettings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ADHAN_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}

export function getMuezzinById(id: string): MuezzinVoice {
  if (id === FAJR_SPECIAL_ADHAN.id) return FAJR_SPECIAL_ADHAN;
  return MUEZZIN_VOICES.find(m => m.id === id) || MUEZZIN_VOICES[0];
}
