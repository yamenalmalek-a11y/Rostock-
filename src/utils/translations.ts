export type Language = 'ar' | 'de';

export interface MosqueInfo {
  name: string;
  nameDe: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  jummahTime: string;
  jummahTimeDe: string;
  tarawihTime: string;
  tarawihTimeDe: string;
  iftarDays: string;
  iftarDaysDe: string;
  features: string[];
  featuresDe: string[];
  directionsUrl: string;
}

export const ROSTOCK_MOSQUES: MosqueInfo[] = [
  {
    name: "مسجد روستوك الكبير (الرابطة الإسلامية في روستوك)",
    nameDe: "Große Moschee Rostock (Islamischer Bund Rostock e.V.)",
    address: "Erich-Schlesinger-Straße 21",
    postalCode: "18059",
    city: "Rostock",
    phone: "+49 176 45639663",
    email: "info@moschee-rostock.de",
    website: "https://moschee-rostock.de",
    jummahTime: "أوقات صلاة الجمعة تُنشر أسبوعياً في المسجد وعبر الموقع",
    jummahTimeDe: "Aktuelle Freitagsgebetszeiten vor Ort und auf moschee-rostock.de",
    tarawihTime: "مباشرة بعد صلاة العشاء يومياً",
    tarawihTimeDe: "Täglich direkt nach dem Isha-Gebet",
    iftarDays: "برامج إفطار جماعي في عطلة نهاية الأسبوع وأيام رمضان",
    iftarDaysDe: "Gemeinsame Iftar-Programme an den Wochenenden im Ramadan",
    features: [
      "المقر الرئيسي للرابطة الإسلامية في روستوك",
      "مصلى فسيح للرجال والنساء",
      "صلاة التراويح وختمة القرآن الكريم",
      "دروس إيمانية وبرامج للعائلات والشباب"
    ],
    featuresDe: [
      "Hauptsitz des Islamischen Bundes Rostock e.V.",
      "Geräumige Gebetsbereiche für Männer und Frauen",
      "Tarawih-Gebete mit Koran-Rezitation",
      "Vorträge und Programme für Familien und Jugendliche"
    ],
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Erich-Schlesinger-Stra%C3%9Fe+21+18059+Rostock"
  },
  {
    name: "مسجد النور روستوك (تويتنفينكل)",
    nameDe: "Al-Nour Moschee Rostock (Toitenwinkel)",
    address: "Salvador-Allende-Straße 28/29",
    postalCode: "18147",
    city: "Rostock",
    phone: "+49 176 45639663",
    email: "info@moschee-rostock.de",
    website: "https://moschee-rostock.de",
    jummahTime: "خطبة وصلاة الجمعة أسبوعياً (بالعربية والألمانية)",
    jummahTimeDe: "Wöchentliches Freitagsgebet (Arabisch & Deutsch)",
    tarawihTime: "بعد صلاة العشاء يومياً",
    tarawihTimeDe: "Täglich nach dem Isha-Gebet",
    iftarDays: "إفطار للصائمين وتجمعات عائلية رمضانية",
    iftarDaysDe: "Fastenbrechen und gemeinschaftliche Treffen im Ramadan",
    features: [
      "موقع حي تويتنفينكل لخدمة أهالي المنطقة",
      "أجواء روحانية لصلاة التراويح والقيام",
      "حلقات تلاوة وتدبر القرآن الكريم",
      "استقبال وتوجيه أفراد الجالية والقادمين الجدد"
    ],
    featuresDe: [
      "Standort im Stadtteil Toitenwinkel für die Gemeinde vor Ort",
      "Spirituelle Atmosphäre für Tarawih-Gebete",
      "Koran-Lesekreise und gemeinsames Lernen",
      "Begleitung und Beratung für Gemeindemitglieder"
    ],
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Salvador-Allende-Stra%C3%9Fe+28%2F29+18147+Rostock"
  }
];

export const RAMADAN_DUAS = [
  {
    titleAr: "دعاء الإفطار",
    titleDe: "Bittgebet zum Fastenbrechen (Iftar)",
    arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
    transliteration: "Dhahaba adh-dhama'u wabtallat al-'urooq, wa thabata al-ajru in sha' Allah",
    translationDe: "Der Durst ist vergangen, die Adern sind benetzt und der Lohn ist gewiss, so Allah will.",
    reference: "رواه أبو داود (2357)"
  },
  {
    titleAr: "دعاء ليلة القدر",
    titleDe: "Bittgebet für die Nacht der Bestimmung (Laylat al-Qadr)",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
    translationDe: "O Allah, Du bist der Vergebende, Du liebst die Vergebung, so vergib mir.",
    reference: "رواه الترمذي (3513)"
  },
  {
    titleAr: "دعاء نية الصيام",
    titleDe: "Absicht zum Fasten (Niyyah)",
    arabic: "اللَّهُمَّ إِنِّي نَوَيْتُ أَنْ أَصُومَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا، فَتَقَبَّلْهُ مِنِّي وَيَسِّرْهُ لِي",
    transliteration: "Allahumma inni nawaytu an asuma Ramadana imanan wahtisaban, fataqabbalhu minni wa yassirhu li",
    translationDe: "O Allah, ich beabsichtige aus Glauben und Hoffnung auf Deinen Lohn im Ramadan zu fasten, so nimm es von mir an und erleichtere es mir.",
    reference: "المأثور عن السلف الصالح"
  },
  {
    titleAr: "دعاء الصائم عند دعوة الآخرين",
    titleDe: "Bittgebet für Gastgeber beim Fastenbrechen",
    arabic: "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ، وَأَكَلَ طَعَامَكُمُ الأَبْرَارُ، وَصَلَّتْ عَلَيْكُمُ الْمَلاَئِكَةُ",
    transliteration: "Aftara 'indakumu-s-sa'imun, wa akala ta'amakumu-l-abrar, wa sallat 'alaykumu-l-mala'ikah",
    translationDe: "Mögen die Fastenden bei euch ihr Fasten brechen, die Rechtschaffenen eure Speise essen und die Engel für euch bitten.",
    reference: "رواه أبو داود (3854)"
  }
];

export const CARD_BLESSINGS = [
  {
    ar: "رمضان كريم، مبارك عليكم الشهر وأعاده الله عليكم بالصحة والسلام والبركات.",
    de: "Ramadan Mubarak! Möge dieser gesegnete Monat Ihnen und Ihrer Familie Frieden, Gesundheit und Segen bringen."
  },
  {
    ar: "تقبل الله منا ومنكم الصيام والقيام وصالح الأعمال، وجعلنا من عتقائه من النار.",
    de: "Möge Allah unser und euer Fasten, die Gebete und guten Taten annehmen."
  },
  {
    ar: "أطيب التهاني والتبريكات بمناسبة حلول شهر رمضان المبارك، كل عام وأنتم إلى الله أقرب.",
    de: "Herzliche Glückwünsche zum gesegneten Ramadan. Möge jeder Tag voller Licht und Barmherzigkeit sein."
  },
  {
    ar: "نور الله قلوبكم بالقرآن وجمعنا وإياكم في الفردوس الأعلى، مبارك عليكم شهر الخير.",
    de: "Gesegnete Tage des Fastens und der Besinnung. Möge Allah eure Herzen mit Glauben und Liebe erfüllen."
  }
];

export const TRANSLATIONS = {
  ar: {
    appTitle: "الرابطة الإسلامية في مدينة روستوك",
    appSubtitle: "تهنئة رسمية بحلول شهر رمضان المبارك • المواقيت الفلكية الدقيقة لمدينة روستوك",
    quranAyah: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ ۚ فَمَن شَهِدَ مِنكُمُ الشَّهْرَ فَلْيَصُمْهُ",
    quranSurah: "سورة البقرة : 185",
    announcementPreamble: "تتقدم الرابطة الإسلامية في مدينة روستوك، ممثلةً بإدارتها وأئمة مساجدها:",
    mosquesMentioned: "مسجد روستوك الكبير ومسجد النور",
    announcementBody: "بأسمى آيات التهنئة والتبريكات إلى الأمة الإسلامية جمعاء، وإلى جميع المسلمين في مدينة روستوك خاصة، بمناسبة حلول شهر رمضان المبارك.",
    announcementDua: "نسأل الله أن يجعله شهر رحمة ومغفرة وبركة، وأن يعيننا فيه على الصيام والقيام، وأن يوحد صفوفنا ويتقبل منا جميعاً صالح الأعمال.",
    listenAyah: "استمع لتلاوة الآية الكريمة",
    pauseAudio: "إيقاف التلاوة",
    playing: "جارٍ الاستماع الآن...",
    prayerTimesTitle: "مواقيت الصلاة والأذان في روستوك",
    prayerTimesSubtitle: "أوقات دقيقة لمدينة روستوك (ألمانيا) مع التوقيت الصيفي والشتوي والأذان التلقائي",
    currentLocation: "روستوك، مكلنبورغ-فوربومرن (ألمانيا)",
    nextPrayer: "الصلاة القادمة",
    iftarCountdown: "الوقت المتبقي حتى أذان المغرب (الإفطار)",
    suhoorCountdown: "الوقت المتبقي حتى أذان الفجر (الإمساك)",
    hours: "ساعة",
    minutes: "دقيقة",
    seconds: "ثانية",
    imsak: "الإمساك",
    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    viewFullImsakiya: "عرض الإمساكية الكاملة لشهر رمضان",
    closeImsakiya: "إغلاق الإمساكية",
    cardGeneratorTitle: "استوديو تصميم بطاقات التهنئة الرمضانية",
    cardGeneratorSubtitle: "اكتب رسالة تهنئتك الخاصة أو عدّل العبارات الجاهزة واختر التصميم المناسب وحمل البطاقة فوراً",
    recipientNamePlaceholder: "اكتب اسم المستلم (مثال: أخي الحبيب أحمد / عائلة الكرام)",
    selectTemplate: "اختر تصميم البطاقة",
    selectBlessing: "نص رسالة التهنئة (حرة أو من النماذج)",
    downloadCard: "تحميل البطاقة عالية الجودة (PNG)",
    cardCopied: "تم نسخ البطاقة بنجاح!",
    shareCard: "مشاركة البطاقة",
    mosquesTitle: "مساجد مدينة روستوك وبرامج رمضان",
    mosquesSubtitle: "العناوين الرسمية ومواعيد صلاة التراويح والجمعة والإفطارات الجماعية",
    jummahTimeLabel: "صلاة الجمعة:",
    tarawihTimeLabel: "صلاة التراويح:",
    iftarProgramLabel: "الإفطار الجماعي:",
    getDirections: "فتح موقع المسجد على الخريطة",
    duasTitle: "واحة الأدعية والأذكار الرمضانية",
    duasSubtitle: "أدعية مأثورة ومعتمدة مع الترجمة الألمانية والمصدر",
    communityMessage: "أهلاً وسهلاً بكم في بيوت الله، ونسأل الله أن يبارك لجميع العائلات والطلاب والمقيمين في روستوك.",
    footerText: "الرابطة الإسلامية في مدينة روستوك • مسجد روستوك الكبير • مسجد النور",
    copyright: "جميع الحقوق محفوظة للرابطة الإسلامية في مدينة روستوك",
    toggleLanguage: "Deutsch"
  },
  de: {
    appTitle: "Islamischer Bund Rostock e.V.",
    appSubtitle: "Offizielle Ramadan-Grußbotschaft • Präzise Gebetszeiten für Rostock",
    quranAyah: "Der Monat Ramadan ist es, in dem der Koran als Rechtleitung für die Menschen herabgesandt worden ist und als klare Beweise der Rechtleitung und der Unterscheidung. Wer also von euch während dieses Monats anwesend ist, der soll ihn fasten.",
    quranSurah: "Sure Al-Baqara : 185",
    announcementPreamble: "Der Islamische Bund Rostock e.V., vertreten durch seinen Vorstand und die Imame seiner Moscheen:",
    mosquesMentioned: "Große Moschee Rostock und Al-Nour Moschee",
    announcementBody: "übermittelt der gesamten islamischen Ummah und insbesondere allen Musliminnen und Muslimen in Rostock die herzlichsten Glück- und Segenswünsche anlässlich des gesegneten Monats Ramadan.",
    announcementDua: "Wir bitten Allah, diesen Monat zu einer Zeit der Barmherzigkeit, der Vergebung und des Segens zu machen und uns beim Fasten und den Nachtgebeten beizustehen.",
    listenAyah: "Koran-Rezitation anhören",
    pauseAudio: "Audio anhalten",
    playing: "Audio wird abgespielt...",
    prayerTimesTitle: "Gebetszeiten & Adhan für Rostock",
    prayerTimesSubtitle: "Präzise Gebetszeiten für Rostock (Mecklenburg-Vorpommern) inkl. Sommer-/Winterzeit & Adhan-Ruf",
    currentLocation: "Rostock, Mecklenburg-Vorpommern (Deutschland)",
    nextPrayer: "Nächstes Gebet",
    iftarCountdown: "Verbleibende Zeit bis zum Maghrib-Gebet (Iftar)",
    suhoorCountdown: "Verbleibende Zeit bis zum Fajr-Gebet (Imsak)",
    hours: "Std",
    minutes: "Min",
    seconds: "Sek",
    imsak: "Imsak",
    fajr: "Fajr",
    sunrise: "Aufgang",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    viewFullImsakiya: "Komplette Ramadan-Imsakiya ansehen",
    closeImsakiya: "Imsakiya schließen",
    cardGeneratorTitle: "Ramadan-Grußkarten Studio",
    cardGeneratorSubtitle: "Schreiben Sie Ihre eigene Grußbotschaft oder wählen Sie aus Vorlagen – sofort als HD-Bild herunterladen",
    recipientNamePlaceholder: "Name des Empfängers (z. B. Familie Müller / Lieber Bruder Ahmad)",
    selectTemplate: "Kartendesign wählen",
    selectBlessing: "Grußtext verfassen (frei oder aus Vorlagen)",
    downloadCard: "Grußkarte herunterladen (PNG)",
    cardCopied: "Karte erfolgreich kopiert!",
    shareCard: "Grußkarte teilen",
    mosquesTitle: "Moscheen in Rostock & Ramadan-Programm",
    mosquesSubtitle: "Offizielle Adressen sowie Zeiten für Tarawih-Gebete, Freitagsgebet und Iftar",
    jummahTimeLabel: "Freitagsgebet (Jummah):",
    tarawihTimeLabel: "Tarawih-Nachtgebet:",
    iftarProgramLabel: "Gemeinschafts-Iftar:",
    getDirections: "Auf Google Maps öffnen",
    duasTitle: "Bittgebete (Duas) für den Ramadan",
    duasSubtitle: "Authentische Bittgebete mit deutscher Übersetzung und Quellenangabe",
    communityMessage: "Herzlich willkommen in unseren Moscheen. Möge Allah allen Familien, Studierenden und Bürgern in Rostock Segen schenken.",
    footerText: "Islamischer Bund Rostock e.V. • Große Moschee Rostock • Al-Nour Moschee",
    copyright: "Alle Rechte vorbehalten • Islamischer Bund Rostock e.V.",
    toggleLanguage: "العربية"
  }
};
