import { getUpcomingRamadans } from './prayerTimes';

export type HeroOccasionPresetId =
  | 'ramadan'
  | 'eid_fitr'
  | 'eid_adha'
  | 'mawlid'
  | 'hijri_new_year'
  | 'isra_miraj'
  | 'jummah'
  | 'general_community'
  | 'custom';

export interface HeroProclamationConfig {
  presetId: HeroOccasionPresetId;
  badgeAr: string;
  badgeDe: string;
  headlineAr: string;
  headlineDe: string;
  subtitleAr: string;
  subtitleDe: string;
  showAyah: boolean;
  ayahIntroAr: string;
  ayahIntroDe: string;
  ayahTextAr: string;
  ayahTextDe: string;
  ayahRefAr: string;
  ayahRefDe: string;
  showAyahAudio: boolean;
  preambleAr: string;
  preambleDe: string;
  mosquesMentionedAr: string;
  mosquesMentionedDe: string;
  bodyAr: string;
  bodyDe: string;
  duaAr: string;
  duaDe: string;
  pinned: boolean;
}

export interface HeroOccasionOption {
  id: Exclude<HeroOccasionPresetId, 'custom'>;
  labelAr: string;
  labelDe: string;
  buildConfig: () => HeroProclamationConfig;
}

export const HERO_STORAGE_KEY = 'ib_rostock_hero_proclamation_v1';

const DEFAULT_PREAMBLE_AR = 'تتقدم الرابطة الإسلامية في مدينة روستوك، ممثلةً بإدارتها وأئمة مساجدها:';
const DEFAULT_PREAMBLE_DE = 'Der Islamische Bund Rostock e.V., vertreten durch seinen Vorstand und die Imame seiner Moscheen:';
const DEFAULT_MOSQUES_AR = 'مسجد روستوك الكبير ومسجد النور';
const DEFAULT_MOSQUES_DE = 'Große Moschee Rostock und Al-Nour Moschee';

export const HERO_OCCASION_PRESETS: HeroOccasionOption[] = [
  {
    id: 'ramadan',
    labelAr: 'رمضان المبارك',
    labelDe: 'Ramadan Mubarak',
    buildConfig: () => {
      const nextRamadan = getUpcomingRamadans().currentOrNext;
      return {
        presetId: 'ramadan',
        badgeAr: `بيان رسمي مبارك • رمضان ${nextRamadan.hijriYear} هـ (${nextRamadan.startGregorianFormatted})`,
        badgeDe: `Offizielle Bekanntmachung • Ramadan ${nextRamadan.hijriYear} n.H. (ab ${nextRamadan.startGregorianFormatted})`,
        headlineAr: 'رَمَضَانُ مُبَارَك',
        headlineDe: 'Ramadan Mubarak',
        subtitleAr: 'تهنئة رسمية بحلول شهر رمضان المبارك • المواقيت الفلكية الدقيقة لمدينة روستوك',
        subtitleDe: 'Offizielle Ramadan-Grußbotschaft • Präzise Gebetszeiten für Rostock',
        showAyah: true,
        ayahIntroAr: 'قال الله تعالى في محكم التنزيل:',
        ayahIntroDe: 'Im Namen Allahs, des Allerbarmers, des Barmherzigen:',
        ayahTextAr: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ ۚ فَمَن شَهِدَ مِنكُمُ الشَّهْرَ فَلْيَصُمْهُ',
        ayahTextDe: 'Der Monat Ramadan ist es, in dem der Koran als Rechtleitung für die Menschen herabgesandt worden ist und als klare Beweise der Rechtleitung und der Unterscheidung. Wer also von euch während dieses Monats anwesend ist, der soll ihn fasten.',
        ayahRefAr: 'سورة البقرة : 185',
        ayahRefDe: 'Sure Al-Baqara : 185',
        showAyahAudio: true,
        preambleAr: DEFAULT_PREAMBLE_AR,
        preambleDe: DEFAULT_PREAMBLE_DE,
        mosquesMentionedAr: DEFAULT_MOSQUES_AR,
        mosquesMentionedDe: DEFAULT_MOSQUES_DE,
        bodyAr: 'بأسمى آيات التهنئة والتبريكات إلى الأمة الإسلامية جمعاء، وإلى جميع المسلمين في مدينة روستوك خاصة، بمناسبة حلول شهر رمضان المبارك.',
        bodyDe: 'übermittelt der gesamten islamischen Ummah und insbesondere allen Musliminnen und Muslimen in Rostock die herzlichsten Glück- und Segenswünsche anlässlich des gesegneten Monats Ramadan.',
        duaAr: 'نسأل الله أن يجعله شهر رحمة ومغفرة وبركة، وأن يعيننا فيه على الصيام والقيام، وأن يوحد صفوفنا ويتقبل منا جميعاً صالح الأعمال.',
        duaDe: 'Wir bitten Allah, diesen Monat zu einer Zeit der Barmherzigkeit, der Vergebung und des Segens zu machen und uns beim Fasten und den Nachtgebeten beizustehen.',
        pinned: false
      };
    }
  },
  {
    id: 'eid_fitr',
    labelAr: 'عيد الفطر السعيد',
    labelDe: 'Eid al-Fitr',
    buildConfig: () => ({
      presetId: 'eid_fitr',
      badgeAr: 'تهنئة رسمية • عيد الفطر السعيد',
      badgeDe: 'Offizielle Festtagsgrüße • Eid al-Fitr Mubarak',
      headlineAr: 'عِيدُ فِطْرٍ مُبَارَك',
      headlineDe: 'Eid al-Fitr Mubarak',
      subtitleAr: 'تقبّل الله منا ومنكم الصيام والقيام وصالح الأعمال • كل عام وأنتم بخير',
      subtitleDe: 'Taqabbalallahu minna wa minkum • Herzliche Segenswünsche zum Eid al-Fitr in Rostock',
      showAyah: true,
      ayahIntroAr: 'قال الله تعالى في كتابه الكريم:',
      ayahIntroDe: 'Allah der Erhabene spricht im Heiligen Koran:',
      ayahTextAr: 'وَلِتُكْمِلُوا الْعِدَّةَ وَلِتُكَبِّرُوا اللَّهَ عَلَىٰ مَا هَدَاكُمْ وَلَعَلَّكُمْ تَشْكُرُونَ',
      ayahTextDe: 'Und damit ihr die Zahl vollmacht und Allah dafür preist, dass Er euch rechtgeleitet hat, und auf dass ihr dankbar seid.',
      ayahRefAr: 'سورة البقرة : 185',
      ayahRefDe: 'Sure Al-Baqara : 185',
      showAyahAudio: false,
      preambleAr: DEFAULT_PREAMBLE_AR,
      preambleDe: DEFAULT_PREAMBLE_DE,
      mosquesMentionedAr: DEFAULT_MOSQUES_AR,
      mosquesMentionedDe: DEFAULT_MOSQUES_DE,
      bodyAr: 'بأصدق مشاعر الفرح والسرور نهنئ جميع الإخوة والأخوات والعائلات في مدينة روستوك بحلول عيد الفطر السعيد، أعاده الله علينا وعليكم باليُمن والخير والبركات.',
      bodyDe: 'gratuliert allen Geschwistern und Familien in Rostock herzlich zum gesegneten Eid al-Fitr! Möge Allah unser Fasten und alle guten Taten annehmen.',
      duaAr: 'تقبل الله منا ومنكم صالح الأعمال، وأدام الله علينا وعليكم الألفة والمحبة والأمن والإيمان.',
      duaDe: 'Möge Allah dieses Fest voller Freude, Frieden, Zusammenhalt und Segen für uns alle werden lassen.',
      pinned: true
    })
  },
  {
    id: 'eid_adha',
    labelAr: 'عيد الأضحى ويوم عرفة',
    labelDe: 'Eid al-Adha',
    buildConfig: () => ({
      presetId: 'eid_adha',
      badgeAr: 'تهنئة رسمية • عيد الأضحى المبارك',
      badgeDe: 'Offizielle Festtagsgrüße • Eid al-Adha Mubarak',
      headlineAr: 'عِيدُ أَضْحَى مُبَارَك',
      headlineDe: 'Eid al-Adha Mubarak',
      subtitleAr: 'مبارك عليكم عيد الأضحى المبارك وأيام العشر المباركات',
      subtitleDe: 'Herzliche Segenswünsche zum gesegneten Eid al-Adha in Rostock',
      showAyah: true,
      ayahIntroAr: 'قال الله تعالى في محكم التنزيل:',
      ayahIntroDe: 'Allah der Erhabene spricht im Heiligen Koran:',
      ayahTextAr: 'لَن يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ',
      ayahTextDe: 'Weder ihr Fleisch noch ihr Blut wird Allah erreichen, sondern eure Gottesfurcht erreicht Ihn.',
      ayahRefAr: 'سورة الحج : 37',
      ayahRefDe: 'Sure Al-Hajj : 37',
      showAyahAudio: false,
      preambleAr: DEFAULT_PREAMBLE_AR,
      preambleDe: DEFAULT_PREAMBLE_DE,
      mosquesMentionedAr: DEFAULT_MOSQUES_AR,
      mosquesMentionedDe: DEFAULT_MOSQUES_DE,
      bodyAr: 'تتقدم الرابطة الإسلامية في روستوك بأحرّ التهاني وأطيب التبريكات إلى عموم الجالية المسلمة بمناسبة حلول عيد الأضحى المبارك، سائلين المولى القبول لحجاج بيت الله الحرام.',
      bodyDe: 'übermittelt allen Musliminnen und Muslimen in Rostock die herzlichsten Glückwünsche zum gesegneten Eid al-Adha und wünscht allen Pilgern eine angenommene Hadsch.',
      duaAr: 'اللهم تقبل منا ومنكم القربات والأضاحي والطاعات، وبارك لجميع العائلات في روستوك بالصحة والعافية.',
      duaDe: 'Möge Allah unsere Gebete und guten Werke annehmen und Frieden sowie Segen in jedes Haus bringen.',
      pinned: true
    })
  },
  {
    id: 'mawlid',
    labelAr: 'المولد النبوي الشريف',
    labelDe: 'Mawlid al-Nabi',
    buildConfig: () => ({
      presetId: 'mawlid',
      badgeAr: 'ذكرى عطرة • المولد النبوي الشريف',
      badgeDe: 'Besonderes Gedenken • Mawlid al-Nabi',
      headlineAr: 'المَوْلِدُ النَّبَوِيُّ الشَّرِيف',
      headlineDe: 'Mawlid al-Nabi',
      subtitleAr: 'صلوات ربي وسلامه على سيدنا محمد خاتم الأنبياء والمرسلين',
      subtitleDe: 'Gedenken an die Geburt unseres Propheten Muhammad (Friede sei mit ihm)',
      showAyah: true,
      ayahIntroAr: 'قال الله تعالى في مدح نبيه ﷺ:',
      ayahIntroDe: 'Allah spricht im Heiligen Koran:',
      ayahTextAr: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ',
      ayahTextDe: 'Und Wir haben dich nur als Barmherzigkeit für die Weltenbewohner gesandt.',
      ayahRefAr: 'سورة الأنبياء : 107',
      ayahRefDe: 'Sure Al-Anbiya : 107',
      showAyahAudio: false,
      preambleAr: DEFAULT_PREAMBLE_AR,
      preambleDe: DEFAULT_PREAMBLE_DE,
      mosquesMentionedAr: DEFAULT_MOSQUES_AR,
      mosquesMentionedDe: DEFAULT_MOSQUES_DE,
      bodyAr: 'تبارك الرابطة الإسلامية في روستوك لأفراد الجالية المسلمة ذكرى مولد نبي الرحمة والهدى محمد ﷺ، داعين إلى الاقتداء بأخلاقه السامية وسيرته العطرة.',
      bodyDe: 'erinnert herzlich an das vorbildliche Leben und die Barmherzigkeit des Propheten Muhammad (Friede sei mit ihm) und wünscht der Gemeinde viel Segen.',
      duaAr: 'اللهم صلِّ وسلم وبارك على سيدنا محمد وعلى آله وصحبه أجمعين، وارزقنا حسن اتباعه.',
      duaDe: 'O Allah, sende Frieden und Segen auf den Propheten Muhammad und leite uns auf seinem guten Weg.',
      pinned: true
    })
  },
  {
    id: 'hijri_new_year',
    labelAr: 'رأس السنة الهجرية',
    labelDe: 'Islamisches Neujahr',
    buildConfig: () => ({
      presetId: 'hijri_new_year',
      badgeAr: 'تهنئة رسمية • رأس السنة الهجرية',
      badgeDe: 'Offizielle Grüße • Islamisches Neujahr (1. Muharram)',
      headlineAr: 'عَامٌ هِجْرِيٌّ مُبَارَك',
      headlineDe: 'Frohes Hijri-Neujahr',
      subtitleAr: 'نسأل الله أن يكون عام خير وبركة وفتح مبين على الجميع',
      subtitleDe: 'Segenswünsche zum Beginn des neuen islamischen Jahres in Rostock',
      showAyah: true,
      ayahIntroAr: 'قال الله تعالى في محكم التنزيل:',
      ayahIntroDe: 'Allah der Erhabene spricht im Heiligen Koran:',
      ayahTextAr: 'إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ إِذْ أَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ',
      ayahTextDe: 'Wenn ihr ihm nicht helft – Allah hat ihm bereits geholfen, als diejenigen, die ungläubig waren, ihn vertrieben, als zweiter von zweien, als sie in der Höhle waren.',
      ayahRefAr: 'سورة التوبة : 40',
      ayahRefDe: 'Sure At-Tawba : 40',
      showAyahAudio: false,
      preambleAr: DEFAULT_PREAMBLE_AR,
      preambleDe: DEFAULT_PREAMBLE_DE,
      mosquesMentionedAr: DEFAULT_MOSQUES_AR,
      mosquesMentionedDe: DEFAULT_MOSQUES_DE,
      bodyAr: 'بمناسبة حلول العام الهجري الجديد، تتقدم الرابطة الإسلامية في روستوك بأخلص التهاني لجميع العائلات والطلاب والمقيمين، سائلين الله أن يجعله عام طاعة وسلام وتوفيق.',
      bodyDe: 'wünscht allen Familien, Studierenden und Mitgliedern ein gesegnetes neues Hijri-Jahr voller Gesundheit, Frieden und Erfolg.',
      duaAr: 'اللهم أهله علينا بالأمن والإيمان والسلامة والإسلام، واجعله عام فرج وخير وبركة على الأمة.',
      duaDe: 'Möge Allah dieses neue Jahr mit Sicherheit, Glauben, Güte und Barmherzigkeit für uns alle beginnen lassen.',
      pinned: true
    })
  },
  {
    id: 'isra_miraj',
    labelAr: 'ذكرى الإسراء والمعراج',
    labelDe: 'Isra & Miraj',
    buildConfig: () => ({
      presetId: 'isra_miraj',
      badgeAr: 'ذكرى مباركة • الإسراء والمعراج',
      badgeDe: 'Besonderes Gedenken • Al-Isra wal-Miraj',
      headlineAr: 'الإِسْرَاءُ وَالمِعْرَاج',
      headlineDe: 'Al-Isra wal-Miraj',
      subtitleAr: 'تأملات في معجزة الإسراء والمعراج وفرضية الصلوات الخمس',
      subtitleDe: 'Gedenken an die wundersame Nachtreise und Himmelfahrt des Propheten ﷺ',
      showAyah: true,
      ayahIntroAr: 'قال الله تعالى في سورة الإسراء:',
      ayahIntroDe: 'Allah der Erhabene spricht in Sure Al-Isra:',
      ayahTextAr: 'سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى الَّذِي بَارَكْنَا حَوْلَهُ',
      ayahTextDe: 'Gepriesen sei Der, Der Seinen Diener bei Nacht von der geschützten Gebetsstätte zur fernsten Gebetsstätte reisen ließ, deren Umgebung Wir gesegnet haben.',
      ayahRefAr: 'سورة الإسراء : 1',
      ayahRefDe: 'Sure Al-Isra : 1',
      showAyahAudio: false,
      preambleAr: DEFAULT_PREAMBLE_AR,
      preambleDe: DEFAULT_PREAMBLE_DE,
      mosquesMentionedAr: DEFAULT_MOSQUES_AR,
      mosquesMentionedDe: DEFAULT_MOSQUES_DE,
      bodyAr: 'في ذكرى الإسراء والمعراج المباركة، ندعو إخواننا وأخواتنا إلى تجديد العهد مع الصلاة عماد الدين، والتضرع إلى الله بالفرج والرحمة والبركة.',
      bodyDe: 'lädt dazu ein, in dieser gesegneten Erinnerung die Bedeutung von Salat (Gebet) zu vertiefen und gemeinsam um Segen und Frieden zu bitten.',
      duaAr: 'اللهم اجعل الصلاة قرة أعيننا، وبارك لنا في المسجد الأقصى وسائر بلاد المسلمين.',
      duaDe: 'Möge Allah unsere Gebete annehmen und unsere Herzen mit Ruhe und Zuversicht erfüllen.',
      pinned: true
    })
  },
  {
    id: 'jummah',
    labelAr: 'جمعة مباركة',
    labelDe: 'Jumuah Mubarakah',
    buildConfig: () => ({
      presetId: 'jummah',
      badgeAr: 'تذكير ودعاء • يوم الجمعة المبارك',
      badgeDe: 'Segensgrüße • Jumuah Mubarakah',
      headlineAr: 'جُمُعَةٌ مُبَارَكَة',
      headlineDe: 'Jumuah Mubarakah',
      subtitleAr: 'خير يوم طلعت عليه الشمس • مواقيت الصلاة وخطبة الجمعة في روستوك',
      subtitleDe: 'Der beste Tag der Woche • Gebetszeiten & Salat al-Jumuah in Rostock',
      showAyah: true,
      ayahIntroAr: 'قال الله تعالى:',
      ayahIntroDe: 'Allah der Erhabene spricht im Heiligen Koran:',
      ayahTextAr: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ',
      ayahTextDe: 'O die ihr glaubt, wenn zum Gebet gerufen wird am Freitag, dann eilt zum Gedenken Allahs.',
      ayahRefAr: 'سورة الجمعة : 9',
      ayahRefDe: 'Sure Al-Jumuah : 9',
      showAyahAudio: false,
      preambleAr: DEFAULT_PREAMBLE_AR,
      preambleDe: DEFAULT_PREAMBLE_DE,
      mosquesMentionedAr: DEFAULT_MOSQUES_AR,
      mosquesMentionedDe: DEFAULT_MOSQUES_DE,
      bodyAr: 'جمعة طيبة مباركة لجميع المصلين وأهالي مدينة روستوك، نرحب بكم في مسجدي الرابطة لحضور خطبة وصلاة الجمعة والإكثار من الصلاة على النبي ﷺ.',
      bodyDe: 'wünscht allen Gemeindemitgliedern in Rostock einen gesegneten Freitag und heißt Sie herzlich zu Salat al-Jumuah in unseren Moscheen willkommen.',
      duaAr: 'اللهم تقبل صلاتنا ودعاءنا في هذا اليوم المبارك واغفر لنا ولوالدينا ولجميع المسلمين.',
      duaDe: 'Möge Allah an diesem gesegneten Freitag alle unsere Bittgebete erhören und uns segnen.',
      pinned: true
    })
  },
  {
    id: 'general_community',
    labelAr: 'ترحيب وبيان عام للمسجد',
    labelDe: 'Allgemeine Begrüßung',
    buildConfig: () => ({
      presetId: 'general_community',
      badgeAr: 'البوابة الرسمية • مواقيت الصلاة وأخبار الجالية',
      badgeDe: 'Offizielles Portal • Gebetszeiten & Gemeindeleben',
      headlineAr: 'أَهْلًا وَسَهْلًا بِكُمْ',
      headlineDe: 'Herzlich willkommen',
      subtitleAr: 'الرابطة الإسلامية في مدينة روستوك • مواقيت الصلاة اليومية والخدمات والبيانات الرسمية',
      subtitleDe: 'Islamischer Bund Rostock e.V. • Tägliche Gebetszeiten & offizielle Mitteilungen',
      showAyah: true,
      ayahIntroAr: 'قال الله تعالى:',
      ayahIntroDe: 'Allah der Erhabene spricht im Heiligen Koran:',
      ayahTextAr: 'إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَأَقَامَ الصَّلَاةَ',
      ayahTextDe: 'Die Gebetsstätten Allahs bevölkert nur, wer an Allah und den Jüngsten Tag glaubt und das Gebet verrichtet.',
      ayahRefAr: 'سورة التوبة : 18',
      ayahRefDe: 'Sure At-Tawba : 18',
      showAyahAudio: false,
      preambleAr: DEFAULT_PREAMBLE_AR,
      preambleDe: DEFAULT_PREAMBLE_DE,
      mosquesMentionedAr: DEFAULT_MOSQUES_AR,
      mosquesMentionedDe: DEFAULT_MOSQUES_DE,
      bodyAr: 'ترحب بكم الرابطة الإسلامية في مدينة روستوك في بوابتها الرقمية لمتابعة مواقيت الصلاة والأذان، وإصدار بطاقات التهنئة والنعوات، ومعرفة أخبار وبرامج المساجد.',
      bodyDe: 'heißt Sie im digitalen Portal des Islamischen Bundes Rostock e.V. willkommen — mit Gebetszeiten, Adhan-Benachrichtigungen, Grußkarten und wichtigen Hinweisen.',
      duaAr: 'نسأل الله أن يبارك في جاليتنا وأن يجمعنا دائماً على الطاعة والبر والتقوى.',
      duaDe: 'Möge Allah unsere Gemeinschaft stärken, behüten und stets im Guten vereinen.',
      pinned: true
    })
  }
];

export function getDefaultHeroConfig(): HeroProclamationConfig {
  return HERO_OCCASION_PRESETS[0].buildConfig();
}

export function loadHeroConfig(): HeroProclamationConfig {
  const fallback = getDefaultHeroConfig();
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(HERO_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<HeroProclamationConfig>;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export function saveHeroConfig(config: HeroProclamationConfig): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify({ ...config, pinned: true }));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetHeroConfig(): HeroProclamationConfig {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(HERO_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return getDefaultHeroConfig();
}
