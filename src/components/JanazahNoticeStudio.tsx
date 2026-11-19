import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Language } from '../utils/translations';
import { getCurrentPrayers } from '../utils/prayerTimes';
import { loadAssociationLogo, drawHarmoniousLogoCrest } from '../utils/scheduleExporter';
import {
  FileText,
  Download,
  Copy,
  Check,
  Share2,
  RotateCcw,
  Calendar,
  Clock,
  MapPin,
  HeartHandshake,
  User
} from 'lucide-react';

interface JanazahNoticeStudioProps {
  lang: Language;
}

type NoticeThemeId = 'obsidian_gold' | 'ivory_print' | 'deep_emerald_silver';
type GenderMode = 'male' | 'female';

interface NoticeTheme {
  id: NoticeThemeId;
  nameAr: string;
  nameDe: string;
  bgGradient: [string, string, string];
  borderColor: string;
  accentColor: string;
  textColor: string;
  secondaryTextColor: string;
  boxBg: string;
  boxBorder: string;
  swatchColor: string;
  isLight?: boolean;
}

const NOTICE_THEMES: NoticeTheme[] = [
  {
    id: 'obsidian_gold',
    nameAr: 'الأسود الوقور والذهب الهادئ',
    nameDe: 'Würdevolles Schwarz & Mattgold',
    bgGradient: ['#15181a', '#0c0e10', '#060708'],
    borderColor: '#c9a959',
    accentColor: '#ebd494',
    textColor: '#f8f6f0',
    secondaryTextColor: '#c8c5bc',
    boxBg: 'rgba(255, 255, 255, 0.04)',
    boxBorder: 'rgba(201, 169, 89, 0.35)',
    swatchColor: '#15181a'
  },
  {
    id: 'ivory_print',
    nameAr: 'اللؤلؤ والرصاصي (للطباعة)',
    nameDe: 'Elfenbein & Schiefer (Druckfreundlich)',
    bgGradient: ['#fcfbf8', '#f5f2eb', '#ebe6da'],
    borderColor: '#6f6552',
    accentColor: '#1f2924',
    textColor: '#181918',
    secondaryTextColor: '#4b4e4b',
    boxBg: 'rgba(31, 41, 36, 0.04)',
    boxBorder: 'rgba(111, 101, 82, 0.38)',
    swatchColor: '#f2eee4',
    isLight: true
  },
  {
    id: 'deep_emerald_silver',
    nameAr: 'الزمرد الداكن والفضي',
    nameDe: 'Dunkelsmaragd & Silber',
    bgGradient: ['#0a211a', '#061510', '#030b08'],
    borderColor: '#cbd5e1',
    accentColor: '#f1e2b3',
    textColor: '#f4f7f5',
    secondaryTextColor: '#bfd1c9',
    boxBg: 'rgba(255, 255, 255, 0.04)',
    boxBorder: 'rgba(203, 213, 225, 0.32)',
    swatchColor: '#0a211a'
  }
];

function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const words = trimmed.split(/\s+/);
    let current = '';
    for (let i = 0; i < words.length; i++) {
      const candidate = current ? `${current} ${words[i]}` : words[i];
      if (ctx.measureText(candidate).width > maxWidth && current) {
        lines.push(current);
        current = words[i];
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

export const JanazahNoticeStudio: React.FC<JanazahNoticeStudioProps> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoImageRef = useRef<HTMLCanvasElement | null>(null);

  const initialDates = useMemo(() => {
    const data = getCurrentPrayers();
    const { rostockNow, todayHijri } = data;
    const pad = (n: number) => String(n).padStart(2, '0');
    const weekday = new Date(Date.UTC(rostockNow.year, rostockNow.month - 1, rostockNow.day)).getUTCDay();
    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const germanDays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const greg = `${pad(rostockNow.day)}.${pad(rostockNow.month)}.${rostockNow.year}`;
    const hijriAr = `${todayHijri.day} ${todayHijri.monthNameAr} ${todayHijri.year} هـ`;
    const hijriDe = `${todayHijri.day}. ${todayHijri.monthNameDe} ${todayHijri.year} n.H.`;
    return {
      dateAr: `${arabicDays[weekday]} ${hijriAr} الموافق ${greg} م`,
      dateDe: `${germanDays[weekday]}, ${greg} (${hijriDe})`
    };
  }, []);

  const [genderMode, setGenderMode] = useState<GenderMode>('male');
  const [deceasedName, setDeceasedName] = useState(
    lang === 'ar' ? 'الحاج / [اكتب اسم المتوفى الكامل هنا]' : '[Vollständigen Namen hier eintragen]'
  );
  const [relationNote, setRelationNote] = useState('');
  const [deathDate, setDeathDate] = useState(() =>
    lang === 'ar' ? initialDates.dateAr : initialDates.dateDe
  );
  const [janazahPrayerTime, setJanazahPrayerTime] = useState(
    lang === 'ar' ? 'غداً بعد صلاة الظهر مباشرة (الساعة 12:45)' : 'Morgen direkt nach Salat al-Dhuhr (12:45 Uhr)'
  );
  const [janazahLocation, setJanazahLocation] = useState(
    lang === 'ar'
      ? 'مسجد روستوك الكبير — Erich-Schlesinger-Str. 21, 18059 Rostock'
      : 'Große Moschee Rostock — Erich-Schlesinger-Str. 21, 18059 Rostock'
  );
  const [burialDetails, setBurialDetails] = useState(
    lang === 'ar'
      ? 'مباشرة بعد صلاة الجنازة — المقبرة الإسلامية في روستوك (Neuer Friedhof, Satower Str.)'
      : 'Direkt im Anschluss an Salat al-Janazah — Islamisches Grabfeld (Neuer Friedhof, Satower Str., Rostock)'
  );
  const [condolenceDetails, setCondolenceDetails] = useState(
    lang === 'ar'
      ? 'في قاعة مسجد روستوك الكبير، لمدة يومين من الساعة 15:30 حتى الساعة 19:00'
      : 'Im Saal der Großen Moschee Rostock, zwei Tage lang von 15:30 bis 19:00 Uhr'
  );
  const [familyContact, setFamilyContact] = useState('');
  const [issuerSignature, setIssuerSignature] = useState(
    lang === 'ar'
      ? 'الرابطة الإسلامية في مدينة روستوك وعائلة الفقيد'
      : 'Islamischer Bund Rostock e.V. & Familie'
  );
  const [selectedTheme, setSelectedTheme] = useState<NoticeThemeId>('obsidian_gold');
  const [copiedText, setCopiedText] = useState(false);
  const [sharedStatus, setSharedStatus] = useState(false);

  // Sync boilerplate language smoothly if user still has default text when toggling AR/DE
  const prevLangRef = useRef<Language>(lang);
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      if (lang === 'de') {
        if (deceasedName.includes('[اكتب اسم')) setDeceasedName('[Vollständigen Namen hier eintragen]');
        if (deathDate === initialDates.dateAr) setDeathDate(initialDates.dateDe);
        if (janazahPrayerTime.startsWith('غداً بعد صلاة الظهر')) {
          setJanazahPrayerTime('Morgen direkt nach Salat al-Dhuhr (12:45 Uhr)');
        }
        if (janazahLocation.startsWith('مسجد روستوك الكبير')) {
          setJanazahLocation('Große Moschee Rostock — Erich-Schlesinger-Str. 21, 18059 Rostock');
        }
        if (burialDetails.startsWith('مباشرة بعد صلاة الجنازة')) {
          setBurialDetails('Direkt im Anschluss an Salat al-Janazah — Islamisches Grabfeld (Neuer Friedhof, Satower Str., Rostock)');
        }
        if (condolenceDetails.startsWith('في قاعة مسجد روستوك الكبير')) {
          setCondolenceDetails('Im Saal der Großen Moschee Rostock, zwei Tage lang von 15:30 bis 19:00 Uhr');
        }
        if (issuerSignature.startsWith('الرابطة الإسلامية')) {
          setIssuerSignature('Islamischer Bund Rostock e.V. & Familie');
        }
      } else {
        if (deceasedName.includes('[Vollständigen')) setDeceasedName('الحاج / [اكتب اسم المتوفى الكامل هنا]');
        if (deathDate === initialDates.dateDe) setDeathDate(initialDates.dateAr);
        if (janazahPrayerTime.startsWith('Morgen direkt')) {
          setJanazahPrayerTime('غداً بعد صلاة الظهر مباشرة (الساعة 12:45)');
        }
        if (janazahLocation.startsWith('Große Moschee')) {
          setJanazahLocation('مسجد روستوك الكبير — Erich-Schlesinger-Str. 21, 18059 Rostock');
        }
        if (burialDetails.startsWith('Direkt im Anschluss')) {
          setBurialDetails('مباشرة بعد صلاة الجنازة — المقبرة الإسلامية في روستوك (Neuer Friedhof, Satower Str.)');
        }
        if (condolenceDetails.startsWith('Im Saal der Großen')) {
          setCondolenceDetails('في قاعة مسجد روستوك الكبير، لمدة يومين من الساعة 15:30 حتى الساعة 19:00');
        }
        if (issuerSignature.startsWith('Islamischer Bund')) {
          setIssuerSignature('الرابطة الإسلامية في مدينة روستوك وعائلة الفقيد');
        }
      }
    }
  }, [lang, deceasedName, deathDate, janazahPrayerTime, janazahLocation, burialDetails, condolenceDetails, issuerSignature, initialDates]);

  const titlePhrase = useMemo(() => {
    if (lang === 'ar') {
      return genderMode === 'male' ? 'المرحوم بإذن الله تعالى' : 'المرحومة بإذن الله تعالى';
    }
    return genderMode === 'male'
      ? 'Unser verstorbener Bruder (Rahimahullah)'
      : 'Unsere verstorbene Schwester (Rahimahallah)';
  }, [lang, genderMode]);

  const closingDua = useMemo(() => {
    if (lang === 'ar') {
      return genderMode === 'male'
        ? 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَثَبِّتْهُ عِنْدَ السُّؤَالِ، وَأَلْهِمْ أَهْلَهُ وَذَوِيهِ الصَّبْرَ وَالسُّلْوَانَ.'
        : 'اللَّهُمَّ اغْفِرْ لَهَا وَارْحَمْهَا، وَعَافِهَا وَاعْفُ عَنْهَا، وَأَكْرِمْ نُزُلَهَا، وَوَسِّعْ مُدْخَلَهَا، وَاغْسِلْهَا بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَثَبِّتْهَا عِنْدَ السُّؤَالِ، وَأَلْهِمْ أَهْلَهَا وَذَوِيهَا الصَّبْرَ وَالسُّلْوَانَ.';
    }
    return genderMode === 'male'
      ? 'Möge Allah ihm vergeben, sich seiner erbarmen, seinen Platz im Paradies weiten und seiner Familie Geduld und Kraft schenken. Amin.'
      : 'Möge Allah ihr vergeben, sich ihrer erbarmen, ihren Platz im Paradies weiten und ihrer Familie Geduld und Kraft schenken. Amin.';
  }, [lang, genderMode]);

  // Fixed formatted text boilerplate ready for WhatsApp / Telegram / Facebook
  const formattedWhatsAppNotice = useMemo(() => {
    const cleanName = deceasedName.trim() || (lang === 'ar' ? '[اسم الفقيد]' : '[Name]');
    const cleanRelation = relationNote.trim();
    const cleanContact = familyContact.trim();

    if (lang === 'ar') {
      const lines = [
        'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ',
        '﴿ إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ ﴾',
        '﴿ كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ﴾',
        '',
        '📌 *نعي أليم وإعلان صلاة جنازة*',
        'بقلوب مؤمنة بقضاء الله وقدره، تنعى الرابطة الإسلامية في مدينة روستوك وعائلة الفقيد إلى عموم أفراد الجالية الكرام وفاة:',
        `*${titlePhrase}: ${cleanName}*`,
        ...(cleanRelation ? [`(${cleanRelation})`] : []),
        '',
        `🗓️ *تاريخ الوفاة:* ${deathDate.trim()}`,
        `🕌 *صلاة الجنازة:* ${janazahPrayerTime.trim()}`,
        `📍 *مكان الصلاة:* ${janazahLocation.trim()}`,
        `⚰️ *موعد ومكان الدفن:* ${burialDetails.trim()}`,
        `🤲 *موعد ومكان العزاء:* ${condolenceDetails.trim()}`,
        ...(cleanContact ? [`📞 *للتعزية والتواصل:* ${cleanContact}`] : []),
        '',
        closingDua,
        '',
        `— ${issuerSignature.trim() || 'الرابطة الإسلامية في مدينة روستوك'}`
      ];
      return lines.join('\n');
    }

    const lines = [
      'Inna lillahi wa inna ilayhi raji’un — Wahrlich, wir gehören Allah, und zu Ihm kehren wir zurück.',
      '',
      '📌 *Todesanzeige & Einladung zu Salat al-Janazah*',
      'Mit tiefem Schmerz und im Vertrauen auf Allahs Fügung gibt der Islamische Bund Rostock e.V. den Tod bekannt von:',
      `*${titlePhrase}: ${cleanName}*`,
      ...(cleanRelation ? [`(${cleanRelation})`] : []),
      '',
      `🗓️ *Sterbedatum:* ${deathDate.trim()}`,
      `🕌 *Salat al-Janazah:* ${janazahPrayerTime.trim()}`,
      `📍 *Gebetsort:* ${janazahLocation.trim()}`,
      `⚰️ *Beisetzung (Bestattung):* ${burialDetails.trim()}`,
      `🤲 *Ta'ziyah (Beileidsbekundung):* ${condolenceDetails.trim()}`,
      ...(cleanContact ? [`📞 *Kontakt:* ${cleanContact}`] : []),
      '',
      closingDua,
      '',
      `— ${issuerSignature.trim() || 'Islamischer Bund Rostock e.V.'}`
    ];
    return lines.join('\n');
  }, [
    lang,
    titlePhrase,
    deceasedName,
    relationNote,
    deathDate,
    janazahPrayerTime,
    janazahLocation,
    burialDetails,
    condolenceDetails,
    familyContact,
    closingDua,
    issuerSignature
  ]);

  const drawNoticeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1480;
    canvas.width = width;
    canvas.height = height;

    const theme = NOTICE_THEMES.find((t) => t.id === selectedTheme) || NOTICE_THEMES[0];
    const isAr = lang === 'ar';

    // 1. Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, theme.bgGradient[0]);
    bgGrad.addColorStop(0.55, theme.bgGradient[1]);
    bgGrad.addColorStop(1, theme.bgGradient[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle solemn radial glow
    const radGlow = ctx.createRadialGradient(width / 2, 340, 40, width / 2, 340, 620);
    radGlow.addColorStop(0, `${theme.borderColor}18`);
    radGlow.addColorStop(1, `${theme.borderColor}00`);
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, width, height);

    // Subtle geometric lattice
    ctx.save();
    ctx.strokeStyle = `${theme.borderColor}0f`;
    ctx.lineWidth = 1;
    const step = 84;
    for (let x = 0; x < width + step; x += step) {
      for (let y = 0; y < height + step; y += step) {
        ctx.beginPath();
        ctx.moveTo(x, y - 22);
        ctx.lineTo(x + 22, y);
        ctx.lineTo(x, y + 22);
        ctx.lineTo(x - 22, y);
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();

    // 2. Formal Double Frame with Corner Ornaments
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    ctx.strokeStyle = `${theme.borderColor}77`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    const corners: [number, number][] = [
      [56, 56],
      [width - 56, 56],
      [56, height - 56],
      [width - 56, height - 56]
    ];
    for (const [cx, cy] of corners) {
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Official Association Crest (Transparent PNG Logo)
    drawHarmoniousLogoCrest(
      ctx,
      logoImageRef.current,
      width / 2,
      128,
      54,
      theme.borderColor,
      Boolean(theme.isLight)
    );

    // Bismillah & Inna Lillahi header
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';

    ctx.fillStyle = theme.secondaryTextColor;
    ctx.font = 'bold 26px "Amiri", "Cairo", serif';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', width / 2, 222);

    ctx.fillStyle = theme.accentColor;
    ctx.font = 'bold 46px "Amiri", "Cairo", serif';
    ctx.fillText('﴿ إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ ﴾', width / 2, 282);

    ctx.fillStyle = theme.secondaryTextColor;
    ctx.font = '600 22px "Amiri", "Cairo", serif';
    ctx.fillText('﴿ كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ﴾', width / 2, 330);

    // Divider line
    ctx.strokeStyle = `${theme.borderColor}88`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(220, 366);
    ctx.lineTo(width - 220, 366);
    ctx.stroke();

    // Notice Title Badge
    ctx.direction = isAr ? 'rtl' : 'ltr';
    ctx.fillStyle = theme.borderColor;
    ctx.font = 'bold 34px "Cairo", "Plus Jakarta Sans", sans-serif';
    ctx.fillText(isAr ? 'نعي أليم وإعلان صلاة جنازة' : 'Todesanzeige & Salat al-Janazah', width / 2, 414);

    // Opening Fixed Preamble
    ctx.fillStyle = theme.secondaryTextColor;
    ctx.font = '600 23px "Cairo", "Plus Jakarta Sans", sans-serif';
    const preamble = isAr
      ? 'بقلوب مؤمنة بقضاء الله وقدره، تنعى الرابطة الإسلامية في مدينة روستوك وعائلة الفقيد وفاة:'
      : 'Im Vertrauen auf Allahs Fügung gibt der Islamische Bund Rostock e.V. den Abschied bekannt von:';
    const preambleLines = wrapTextLines(ctx, preamble, width - 170);
    let curY = 468;
    for (const line of preambleLines) {
      ctx.fillText(line, width / 2, curY);
      curY += 36;
    }

    // 4. Deceased Name Highlight Box
    const nameBoxY = curY + 12;
    const nameBoxH = relationNote.trim() ? 168 : 134;
    ctx.fillStyle = theme.boxBg;
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(88, nameBoxY, width - 176, nameBoxH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.secondaryTextColor;
    ctx.font = '600 22px "Cairo", "Plus Jakarta Sans", sans-serif';
    ctx.fillText(titlePhrase, width / 2, nameBoxY + 34);

    ctx.fillStyle = theme.accentColor;
    ctx.font = 'bold 40px "Cairo", "Amiri", "Plus Jakarta Sans", sans-serif';
    const displayDeceased = deceasedName.trim() || (isAr ? '[اسم الفقيد الكامل]' : '[Vollständiger Name]');
    const nameLines = wrapTextLines(ctx, displayDeceased, width - 220).slice(0, 2);
    let nameTextY = nameLines.length === 1 ? nameBoxY + 86 : nameBoxY + 74;
    for (const nl of nameLines) {
      ctx.fillText(nl, width / 2, nameTextY);
      nameTextY += 44;
    }

    if (relationNote.trim()) {
      ctx.fillStyle = theme.secondaryTextColor;
      ctx.font = '600 22px "Cairo", "Plus Jakarta Sans", sans-serif';
      ctx.fillText(relationNote.trim(), width / 2, nameBoxY + nameBoxH - 26);
    }

    // 5. Structured Schedule Rows (Date of Death, Prayer Time + Mosque, Burial, Condolences)
    const rows: { label: string; value: string }[] = [
      {
        label: isAr ? 'تاريخ الوفاة' : 'Sterbedatum',
        value: deathDate.trim() || '—'
      },
      {
        label: isAr ? 'صلاة الجنازة' : 'Salat al-Janazah',
        value: `${janazahPrayerTime.trim()}\n${janazahLocation.trim()}`
      },
      {
        label: isAr ? 'موعد ومكان الدفن' : 'Beisetzung',
        value: burialDetails.trim() || '—'
      },
      {
        label: isAr ? 'موعد ومكان التعزية' : "Ta'ziyah (Beileid)",
        value: familyContact.trim()
          ? `${condolenceDetails.trim()}\n${isAr ? 'للتواصل:' : 'Kontakt:'} ${familyContact.trim()}`
          : condolenceDetails.trim() || '—'
      }
    ];

    let cardY = nameBoxY + nameBoxH + 26;
    const cardW = width - 176;
    const cardX = 88;

    for (const row of rows) {
      ctx.font = '600 22px "Cairo", "Plus Jakarta Sans", sans-serif';
      const valLines = wrapTextLines(ctx, row.value, cardW - 60);
      const boxH = Math.max(82, 46 + valLines.length * 32);

      ctx.fillStyle = theme.boxBg;
      ctx.strokeStyle = theme.boxBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, boxH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = theme.accentColor;
      ctx.font = 'bold 21px "Cairo", "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = isAr ? 'right' : 'left';
      ctx.fillText(row.label, isAr ? cardX + cardW - 26 : cardX + 26, cardY + 25);

      ctx.fillStyle = theme.textColor;
      ctx.font = '600 22px "Cairo", "Plus Jakarta Sans", sans-serif';
      let vy = cardY + 58;
      for (const vl of valLines) {
        ctx.fillText(vl, isAr ? cardX + cardW - 26 : cardX + 26, vy);
        vy += 32;
      }

      cardY += boxH + 14;
    }

    // 6. Closing Dua & Signature Footer
    ctx.textAlign = 'center';
    const duaStartY = Math.max(cardY + 20, height - 224);
    ctx.fillStyle = theme.secondaryTextColor;
    ctx.font = 'italic 600 21px "Amiri", "Cairo", serif';
    const duaLines = wrapTextLines(ctx, closingDua, width - 190).slice(0, 3);
    let dy = duaStartY;
    for (const dl of duaLines) {
      ctx.fillText(dl, width / 2, dy);
      dy += 31;
    }

    ctx.strokeStyle = `${theme.borderColor}66`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, height - 106);
    ctx.lineTo(width - 250, height - 106);
    ctx.stroke();

    ctx.fillStyle = theme.accentColor;
    ctx.font = 'bold 22px "Cairo", "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      issuerSignature.trim() || (isAr ? 'الرابطة الإسلامية في مدينة روستوك' : 'Islamischer Bund Rostock e.V.'),
      width / 2,
      height - 76
    );
  }, [
    selectedTheme,
    lang,
    titlePhrase,
    deceasedName,
    relationNote,
    deathDate,
    janazahPrayerTime,
    janazahLocation,
    burialDetails,
    condolenceDetails,
    familyContact,
    closingDua,
    issuerSignature
  ]);

  useEffect(() => {
    let active = true;
    loadAssociationLogo().then((logoCanvas) => {
      if (!active) return;
      logoImageRef.current = logoCanvas;
      drawNoticeCanvas();
    });
    return () => {
      active = false;
    };
  }, [drawNoticeCanvas]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        drawNoticeCanvas();
      });
    }
    drawNoticeCanvas();
  }, [drawNoticeCanvas]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const safeName = deceasedName.replace(/[^\p{L}\p{N}_-]+/gu, '_').slice(0, 32) || 'Janazah';
    link.download = `Janazah_Notice_${safeName}_Rostock.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedWhatsAppNotice);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2600);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleShareNotice = async () => {
    const canvas = canvasRef.current;
    try {
      if (navigator.share && canvas) {
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
        if (blob) {
          const file = new File([blob], 'Janazah_Rostock.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: lang === 'ar' ? 'نعي وإعلان صلاة جنازة — روستوك' : 'Todesanzeige & Salat al-Janazah',
              text: formattedWhatsAppNotice,
              files: [file]
            });
            setSharedStatus(true);
            setTimeout(() => setSharedStatus(false), 2500);
            return;
          }
        }
        await navigator.share({
          title: lang === 'ar' ? 'نعي وإعلان صلاة جنازة — روستوك' : 'Todesanzeige & Salat al-Janazah',
          text: formattedWhatsAppNotice
        });
        setSharedStatus(true);
        setTimeout(() => setSharedStatus(false), 2500);
        return;
      }
      await handleCopyText();
    } catch {
      await handleCopyText();
    }
  };

  const handleReset = () => {
    setGenderMode('male');
    setDeceasedName(
      lang === 'ar' ? 'الحاج / [اكتب اسم المتوفى الكامل هنا]' : '[Vollständigen Namen hier eintragen]'
    );
    setRelationNote('');
    setDeathDate(lang === 'ar' ? initialDates.dateAr : initialDates.dateDe);
    setJanazahPrayerTime(
      lang === 'ar' ? 'غداً بعد صلاة الظهر مباشرة (الساعة 12:45)' : 'Morgen direkt nach Salat al-Dhuhr (12:45 Uhr)'
    );
    setJanazahLocation(
      lang === 'ar'
        ? 'مسجد روستوك الكبير — Erich-Schlesinger-Str. 21, 18059 Rostock'
        : 'Große Moschee Rostock — Erich-Schlesinger-Str. 21, 18059 Rostock'
    );
    setBurialDetails(
      lang === 'ar'
        ? 'مباشرة بعد صلاة الجنازة — المقبرة الإسلامية في روستوك (Neuer Friedhof, Satower Str.)'
        : 'Direkt im Anschluss an Salat al-Janazah — Islamisches Grabfeld (Neuer Friedhof, Satower Str., Rostock)'
    );
    setCondolenceDetails(
      lang === 'ar'
        ? 'في قاعة مسجد روستوك الكبير، لمدة يومين من الساعة 15:30 حتى الساعة 19:00'
        : 'Im Saal der Großen Moschee Rostock, zwei Tage lang von 15:30 bis 19:00 Uhr'
    );
    setFamilyContact('');
    setIssuerSignature(
      lang === 'ar'
        ? 'الرابطة الإسلامية في مدينة روستوك وعائلة الفقيد'
        : 'Islamischer Bund Rostock e.V. & Familie'
    );
  };

  const quickPrayerSlots = lang === 'ar'
    ? [
        'اليوم بعد صلاة العصر مباشرة',
        'غداً بعد صلاة الظهر مباشرة',
        'غداً بعد صلاة العصر مباشرة',
        'يوم الجمعة بعد صلاة الجمعة مباشرة'
      ]
    : [
        'Heute direkt nach Salat al-Asr',
        'Morgen direkt nach Salat al-Dhuhr',
        'Morgen direkt nach Salat al-Asr',
        'Freitag direkt nach Salat al-Jumuah'
      ];

  const quickMosques = lang === 'ar'
    ? [
        {
          label: 'مسجد روستوك الكبير',
          value: 'مسجد روستوك الكبير — Erich-Schlesinger-Str. 21, 18059 Rostock'
        },
        {
          label: 'مسجد النور',
          value: 'مسجد النور — Salvador-Allende-Str. 28/29, 18147 Rostock'
        }
      ]
    : [
        {
          label: 'Große Moschee',
          value: 'Große Moschee Rostock — Erich-Schlesinger-Str. 21, 18059 Rostock'
        },
        {
          label: 'Al-Nour Moschee',
          value: 'Al-Nour Moschee — Salvador-Allende-Str. 28/29, 18147 Rostock'
        }
      ];

  return (
    <section
      id="janazah-notice"
      className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-[#040e0a] to-[#06120e] border-t border-[#1b3a2e]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11241e] border border-[#c9a959]/45 text-[#ebd494] text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? 'كليشة النعوة الرسمية وإعلان صلاة الجنازة'
                : 'Offizielle Vorlage: Todesanzeige & Salat al-Janazah'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2.5 font-cairo">
            {lang === 'ar'
              ? 'إصدار نعوة وإعلان صلاة الجنازة والتعزية'
              : 'Todesanzeige, Salat al-Janazah & Ta’ziyah Vorlage'}
          </h2>
          <p className="text-[#a5bdb3] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {lang === 'ar'
              ? 'كليشة ثابتة ورسمية جاهزة عند حالات الوفاة — عدّل الاسم والتاريخ وموعد صلاة الجنازة والدفن ومكان التعزية وحمّل الصورة أو انسخ النص فوراً للنشر في مجموعات الجالية.'
              : 'Feste offizielle Vorlage für Todesfälle: Name, Sterbedatum, Salat al-Janazah, Beisetzung und Ta’ziyah einfach anpassen und als Bild oder WhatsApp-Text teilen.'}
          </p>
        </div>

        {/* Main 2-Column Workspace (Live Preview Left/Top, Structured Form Right/Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Preview + Ready WhatsApp Text */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center space-y-5">
            <div className="relative w-full max-w-[440px] rounded-2xl p-2 sm:p-3 bg-gradient-to-br from-[#c9a959]/30 to-[#0e1a16] border border-[#c9a959]/45 shadow-2xl">
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-xl shadow-inner block"
                style={{ aspectRatio: '1080/1480' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-[440px] grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="sm:col-span-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#061510] font-bold text-sm hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تحميل صورة النعوة عالية الجودة (PNG)' : 'Anzeige als PNG herunterladen'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="sm:col-span-2 py-2.5 px-3.5 rounded-xl bg-[#0e2d22] hover:bg-[#144030] text-[#ebd494] border border-[#c9a959]/45 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#d4af37]" />}
                <span>
                  {copiedText
                    ? (lang === 'ar' ? 'تم نسخ نص النعوة!' : 'Text kopiert!')
                    : (lang === 'ar' ? 'نسخ كليشة النعوة للواتساب' : 'WhatsApp-Text kopieren')}
                </span>
              </button>

              <button
                type="button"
                onClick={handleShareNotice}
                className="py-2.5 px-3.5 rounded-xl bg-[#092018] hover:bg-[#113528] text-white border border-[#1f4d3d] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                {sharedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#d4af37]" />}
                <span>{lang === 'ar' ? 'مشاركة' : 'Teilen'}</span>
              </button>
            </div>

            {/* Ready Formatted Text Box */}
            <div className="w-full max-w-[440px] rounded-xl bg-[#06140f] border border-[#1b3d30] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#ebd494] font-bold">
                <span>{lang === 'ar' ? 'معاينة الكليشة النصية الجاهزة للنسخ:' : 'Fertige Textvorlage zum Kopieren:'}</span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="text-[11px] text-[#9ec2b4] hover:text-white underline"
                >
                  {copiedText ? (lang === 'ar' ? 'تم النسخ' : 'Kopiert') : (lang === 'ar' ? 'نسخ' : 'Kopieren')}
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-[11px] sm:text-xs text-[#d1e0d9] leading-relaxed font-cairo max-h-52 overflow-y-auto bg-[#030b08] p-3 rounded-lg border border-[#122e23]">
                {formattedWhatsAppNotice}
              </pre>
            </div>
          </div>

          {/* Editable Notice Form */}
          <div className="lg:col-span-6 order-2 lg:order-1 bg-[#081c15] border border-[#1a4032] rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#163a2d]">
              <h3 className="text-sm sm:text-base font-bold text-[#ebd494] font-cairo flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تعديل بيانات النعوة' : 'Angaben der Anzeige bearbeiten'}</span>
              </h3>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#9ec2b4] hover:text-white flex items-center gap-1 bg-[#0d2b20] px-2.5 py-1.5 rounded-lg border border-[#1d4838]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إعادة ضبط' : 'Zurücksetzen'}</span>
              </button>
            </div>

            {/* 1. Gender / Form */}
            <div>
              <label className="block text-xs font-semibold text-[#ebd494] mb-1.5">
                {lang === 'ar' ? '1. صيغة النعوة والضمائر' : '1. Anrede & Gebetsformel'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGenderMode('male')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    genderMode === 'male'
                      ? 'bg-[#12382c] border-[#d4af37] text-white ring-1 ring-[#d4af37]'
                      : 'bg-[#04120d] border-[#193d30] text-[#9ebfb2] hover:border-[#2e6652]'
                  }`}
                >
                  {lang === 'ar' ? 'المرحوم بإذن الله (مذكر)' : 'Bruder (Rahimahullah)'}
                </button>
                <button
                  type="button"
                  onClick={() => setGenderMode('female')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    genderMode === 'female'
                      ? 'bg-[#12382c] border-[#d4af37] text-white ring-1 ring-[#d4af37]'
                      : 'bg-[#04120d] border-[#193d30] text-[#9ebfb2] hover:border-[#2e6652]'
                  }`}
                >
                  {lang === 'ar' ? 'المرحومة بإذن الله (مؤنث)' : 'Schwester (Rahimahallah)'}
                </button>
              </div>
            </div>

            {/* 2. Deceased Name & Optional Note */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-[#ebd494] mb-1.5">
                  {lang === 'ar' ? '2. اسم المتوفى / الفقيد الكامل' : '2. Vollständiger Name'}
                </label>
                <input
                  type="text"
                  value={deceasedName}
                  onChange={(e) => setDeceasedName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: الحاج عبد الله ...' : 'Name des/der Verstorbenen'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-sm font-bold focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9ec2b4] mb-1">
                  {lang === 'ar'
                    ? 'صفة القرابة أو البلدة (اختياري — مثال: والد الأخ ... / من أبناء ...)'
                    : 'Zusatzhinweis (optional, z. B. Vater von ...)'}
                </label>
                <input
                  type="text"
                  value={relationNote}
                  onChange={(e) => setRelationNote(e.target.value)}
                  placeholder={lang === 'ar' ? 'اتركه فارغاً إن لم ترغب بإضافته' : 'Optional'}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#173a2d] text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* 3. Date of Death */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#ebd494] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? '3. تاريخ الوفاة (الهجري والميلادي)' : '3. Sterbedatum'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setDeathDate(lang === 'ar' ? initialDates.dateAr : initialDates.dateDe)}
                  className="text-[11px] text-[#9ec2b4] hover:text-[#ebd494] underline"
                >
                  {lang === 'ar' ? 'تاريخ اليوم' : 'Heute einfügen'}
                </button>
              </div>
              <input
                type="text"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* 4. Janazah Prayer Time & Mosque */}
            <div className="space-y-2.5 bg-[#05140f] p-3.5 rounded-xl border border-[#153629]">
              <label className="text-xs font-semibold text-[#ebd494] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? '4. موعد ومكان صلاة الجنازة' : '4. Zeit & Ort für Salat al-Janazah'}</span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {quickPrayerSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setJanazahPrayerTime(slot)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${
                      janazahPrayerTime === slot
                        ? 'bg-[#143d2f] border-[#d4af37] text-[#ebd494]'
                        : 'bg-[#081c15] border-[#193d30] text-[#9ebfb2] hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={janazahPrayerTime}
                onChange={(e) => setJanazahPrayerTime(e.target.value)}
                placeholder={lang === 'ar' ? 'اليوم والساعة والصلاة' : 'Tag, Uhrzeit & Gebet'}
                className="w-full px-3 py-2 rounded-lg bg-[#04100c] border border-[#1b4335] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickMosques.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setJanazahLocation(m.value)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors flex items-center gap-1 ${
                      janazahLocation === m.value
                        ? 'bg-[#143d2f] border-[#d4af37] text-[#ebd494]'
                        : 'bg-[#081c15] border-[#193d30] text-[#9ebfb2] hover:text-white'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={janazahLocation}
                onChange={(e) => setJanazahLocation(e.target.value)}
                placeholder={lang === 'ar' ? 'مكان صلاة الجنازة' : 'Moschee / Gebetsort'}
                className="w-full px-3 py-2 rounded-lg bg-[#04100c] border border-[#1b4335] text-white text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* 5. Burial / Funeral Procession */}
            <div>
              <label className="block text-xs font-semibold text-[#ebd494] mb-1.5">
                {lang === 'ar' ? '5. موعد ومكان الجنازة والدفن (المقبرة)' : '5. Beisetzung / Friedhof'}
              </label>
              <textarea
                rows={2}
                value={burialDetails}
                onChange={(e) => setBurialDetails(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] leading-relaxed"
              />
            </div>

            {/* 6. Condolences (Ta'ziyah) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#ebd494] flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? '6. موعد ومكان التعزية (العزاء)' : '6. Ta’ziyah (Beileidsbekundung)'}</span>
              </label>
              <textarea
                rows={2}
                value={condolenceDetails}
                onChange={(e) => setCondolenceDetails(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] leading-relaxed"
              />
              <input
                type="text"
                value={familyContact}
                onChange={(e) => setFamilyContact(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'رقم هاتف للتعزية أو للتواصل مع العائلة (اختياري)'
                    : 'Telefonnummer für Beileid / Kontakt (optional)'
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#173a2d] text-white text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* 7. Issuer Signature & Design Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#ebd494] mb-1.5">
                  {lang === 'ar' ? '7. الجهة المُعلِنة (التوقيع)' : '7. Absender / Unterzeichner'}
                </label>
                <input
                  type="text"
                  value={issuerSignature}
                  onChange={(e) => setIssuerSignature(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ebd494] mb-1.5">
                  {lang === 'ar' ? 'نمط تصميم النعوة' : 'Design der Anzeige'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {NOTICE_THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setSelectedTheme(th.id)}
                      title={lang === 'ar' ? th.nameAr : th.nameDe}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                        selectedTheme === th.id
                          ? 'border-[#d4af37] bg-[#12382c] text-white ring-1 ring-[#d4af37]'
                          : 'border-[#1b4335] bg-[#04120d] text-[#a3c2b5]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border shrink-0"
                        style={{ backgroundColor: th.swatchColor, borderColor: th.borderColor }}
                      />
                      <span className="truncate">
                        {th.id === 'obsidian_gold'
                          ? (lang === 'ar' ? 'وقور' : 'Schwarz')
                          : th.id === 'ivory_print'
                          ? (lang === 'ar' ? 'طباعة' : 'Druck')
                          : (lang === 'ar' ? 'زمردي' : 'Smaragd')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
