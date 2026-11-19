export type OccasionId =
  | 'ramadan'
  | 'eid_fitr'
  | 'eid_adha'
  | 'mawlid'
  | 'hijri_new_year'
  | 'isra_miraj'
  | 'jummah'
  | 'general';

export interface OccasionPreset {
  id: OccasionId;
  labelAr: string;
  labelDe: string;
  defaultHeadlineAr: string;
  defaultSubheadline: string;
  headlinePresets: { ar: string; de: string }[];
  ayahOrQuoteAr: string;
  footerTag: string;
  recommendedTemplate:
    | 'emerald_arch'
    | 'midnight_celestial'
    | 'ivory_manuscript'
    | 'andalus_lantern'
    | 'turquoise_mosaic'
    | 'rose_dawn'
    | 'kaaba_gold'
    | 'eid_royal'
    | 'damascus_olive';
  blessings: { ar: string; de: string }[];
}

export const ISLAMIC_OCCASIONS: OccasionPreset[] = [
  {
    id: 'ramadan',
    labelAr: 'رمضان المبارك',
    labelDe: 'Ramadan',
    defaultHeadlineAr: 'رَمَضَانُ مُبَارَك',
    defaultSubheadline: 'RAMADAN MUBARAK',
    headlinePresets: [
      { ar: 'رَمَضَانُ مُبَارَك', de: 'RAMADAN MUBARAK' },
      { ar: 'رَمَضَانُ كَرِيم', de: 'RAMADAN KARIM' },
      { ar: 'مُبَارَكٌ عَلَيْكُمُ الشَّهْر', de: 'GESEGNETER MONAT' }
    ],
    ayahOrQuoteAr: '« شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ »',
    footerTag: 'Ramadan Mubarak',
    recommendedTemplate: 'emerald_arch',
    blessings: [
      {
        ar: 'رمضان كريم، مبارك عليكم الشهر وأعاده الله عليكم بالصحة والسلام والبركات.',
        de: 'Ramadan Mubarak! Möge dieser gesegnete Monat Ihnen und Ihrer Familie Frieden, Gesundheit und Segen bringen.'
      },
      {
        ar: 'تقبل الله منا ومنكم الصيام والقيام وصالح الأعمال، وجعلنا من عتقائه من النار.',
        de: 'Möge Allah unser und euer Fasten, die Gebete und guten Taten annehmen.'
      },
      {
        ar: 'نور الله قلوبكم بالقرآن وجمعنا وإياكم على الخير والطاعات في هذا الشهر الفضيل.',
        de: 'Möge Allah eure Herzen mit dem Licht des Korans erfüllen und alle Gebete erhören.'
      }
    ]
  },
  {
    id: 'eid_fitr',
    labelAr: 'عيد الفطر السعيد',
    labelDe: 'Eid al-Fitr',
    defaultHeadlineAr: 'عِيدُ فِطْرٍ مُبَارَك',
    defaultSubheadline: 'EID AL-FITR MUBARAK',
    headlinePresets: [
      { ar: 'عِيدُ فِطْرٍ مُبَارَك', de: 'EID AL-FITR MUBARAK' },
      { ar: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُم', de: 'TAQABBALALLAHU MINNA WA MINKUM' },
      { ar: 'كُلُّ عَامٍ وَأَنْتُمْ بِخَيْر', de: 'FROHES ZUCKERFEST' }
    ],
    ayahOrQuoteAr: '« وَلِتُكْمِلُوا الْعِدَّةَ وَلِتُكَبِّرُوا اللَّهَ عَلَىٰ مَا هَدَاكُمْ وَلَعَلَّكُمْ تَشْكُرُونَ »',
    footerTag: 'Eid al-Fitr Mubarak',
    recommendedTemplate: 'eid_royal',
    blessings: [
      {
        ar: 'تقبل الله منا ومنكم صالح الأعمال، وعيد فطر مبارك وسعيد عليكم وعلى أهلكم وأحبابكم.',
        de: 'Taqabbalallahu minna wa minkum! Ein gesegnetes und freudiges Eid al-Fitr für Sie und Ihre gesamte Familie.'
      },
      {
        ar: 'أدام الله عليكم بهجة العيد، وأعاده عليكم أعواماً عديدة بالخير واليمن والبركات.',
        de: 'Möge die Freude des Festes lange anhalten und Gesundheit sowie Frieden in Ihr Zuhause bringen.'
      },
      {
        ar: 'كل عام وأنتم إلى الله أقرب، وبفرحة عيد الفطر أنعم وأسعد.',
        de: 'Herzliche Glückwünsche zum Eid al-Fitr! Möge Allah alle guten Taten aus dem Ramadan annehmen.'
      }
    ]
  },
  {
    id: 'eid_adha',
    labelAr: 'عيد الأضحى وعرفة',
    labelDe: 'Eid al-Adha',
    defaultHeadlineAr: 'عِيدُ أَضْحَى مُبَارَك',
    defaultSubheadline: 'EID AL-ADHA MUBARAK',
    headlinePresets: [
      { ar: 'عِيدُ أَضْحَى مُبَارَك', de: 'EID AL-ADHA MUBARAK' },
      { ar: 'تَقَبَّلَ اللَّهُ طَاعَتَكُم', de: 'GESEGNETES OPFERFEST' },
      { ar: 'يَوْمُ عَرَفَةَ المُبَارَك', de: 'TAG VON ARAFA' }
    ],
    ayahOrQuoteAr: '« لَن يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ »',
    footerTag: 'Eid al-Adha Mubarak',
    recommendedTemplate: 'kaaba_gold',
    blessings: [
      {
        ar: 'عيد أضحى مبارك، تقبل الله منا ومنكم القربات والأضاحي وبارك لكم في أهلكم وأعماركم.',
        de: 'Eid al-Adha Mubarak! Möge Allah Ihre Opfergaben und Gebete annehmen und Sie reichlich segnen.'
      },
      {
        ar: 'في هذه الأيام المباركة، نسأل الله أن يتقبل من الحجاج حجهم وأن يكتب لنا زيارة بيته الحرام.',
        de: 'Herzliche Segenswünsche zum Opferfest. Möge Allah Frieden, Harmonie und Wohlstand schenken.'
      },
      {
        ar: 'كل عام وأنتم بخير، وأعاده الله علينا وعليكم بالأمن والإيمان والسلامة والإسلام.',
        de: 'Ein gesegnetes Eid al-Adha voller Güte, Gemeinschaft und Dankbarkeit.'
      }
    ]
  },
  {
    id: 'mawlid',
    labelAr: 'المولد النبوي الشريف',
    labelDe: 'Mawlid al-Nabi',
    defaultHeadlineAr: 'المَوْلِدُ النَّبَوِيُّ الشَّرِيف',
    defaultSubheadline: 'MAWLID AL-NABI',
    headlinePresets: [
      { ar: 'المَوْلِدُ النَّبَوِيُّ الشَّرِيف', de: 'MAWLID AL-NABI' },
      { ar: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّم', de: 'FRIEDE SEI MIT IHM' },
      { ar: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِين', de: 'BARMHERZIGKEIT FÜR DIE WELTEN' }
    ],
    ayahOrQuoteAr: '« إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا »',
    footerTag: 'Mawlid al-Nabi',
    recommendedTemplate: 'damascus_olive',
    blessings: [
      {
        ar: 'بمناسبة ذكرى مولد خير الأنام محمد ﷺ، نسأل الله أن يرزقنا شفاعته وحسن اتباع سنته.',
        de: 'Zum Gedenken an die Geburt unseres Propheten Muhammad (Friede sei mit ihm) wünschen wir Ihnen Segen und Licht.'
      },
      {
        ar: 'اللهم صلّ وسلم وبارك على سيدنا محمد وعلى آله وصحبه أجمعين، كل عام وأنتم بخير.',
        de: 'Mögen Frieden und Segen auf dem Propheten Muhammad ruhen. Herzliche Grüße an Sie und Ihre Familie.'
      }
    ]
  },
  {
    id: 'hijri_new_year',
    labelAr: 'رأس السنة الهجرية',
    labelDe: 'Islamisches Neujahr',
    defaultHeadlineAr: 'عَامٌ هِجْرِيٌّ مُبَارَك',
    defaultSubheadline: 'FROHES HIJRI-NEUJAHR',
    headlinePresets: [
      { ar: 'عَامٌ هِجْرِيٌّ مُبَارَك', de: 'FROHES HIJRI-NEUJAHR' },
      { ar: 'سَنَةٌ هِجْرِيَّةٌ سَعِيدَة', de: 'GESEGNETES NEUES JAHR' },
      { ar: 'كُلُّ عَامٍ وَأَنْتُمْ بِخَيْر', de: 'ALLES GUTE ZUM NEUJAHR' }
    ],
    ayahOrQuoteAr: '« إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ إِذْ أَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ »',
    footerTag: 'Hijri New Year',
    recommendedTemplate: 'ivory_manuscript',
    blessings: [
      {
        ar: 'عام هجري جديد مبارك! نسأل الله أن يجعله عام خير وفتح وبركة وشفاء للقلوب والأبدان.',
        de: 'Ein gesegnetes islamisches Neujahr! Möge dieses neue Hijri-Jahr voller Frieden und Erfolg sein.'
      },
      {
        ar: 'تتبدل الأعوام ويبقى الدعاء الصادق: بارك الله لكم في عامكم الجديد وألهمكم السداد والتوفيق.',
        de: 'Alles Gute zum Beginn des neuen islamischen Jahres mit viel Gesundheit und Gottes Segen.'
      }
    ]
  },
  {
    id: 'isra_miraj',
    labelAr: 'الإسراء والمعراج',
    labelDe: 'Isra & Miraj',
    defaultHeadlineAr: 'الإِسْرَاءُ وَالمِعْرَاج',
    defaultSubheadline: 'AL-ISRA WAL-MIRAJ',
    headlinePresets: [
      { ar: 'الإِسْرَاءُ وَالمِعْرَاج', de: 'AL-ISRA WAL-MIRAJ' },
      { ar: 'لَيْلَةٌ مُبَارَكَة', de: 'GESEGNETE NACHT' }
    ],
    ayahOrQuoteAr: '« سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى »',
    footerTag: 'Al-Isra wal-Miraj',
    recommendedTemplate: 'midnight_celestial',
    blessings: [
      {
        ar: 'في ذكرى الإسراء والمعراج، نسأل الله أن يعمر قلوبنا بخشوع الصلاة وأن يبارك في المسجد الأقصى.',
        de: 'In dieser besonderen Nacht gedenken wir der wunderbaren Reise unseres Propheten. Möge Allah unsere Gebete annehmen.'
      },
      {
        ar: 'بارك الله لكم هذه الذكرى العطرة وفرّج همومكم وحقق لكم ما تتمنون من خير الدنيا والآخرة.',
        de: 'Gesegnete Grüße zum Gedenken an Al-Isra wal-Miraj für die gesamte Gemeinde.'
      }
    ]
  },
  {
    id: 'jummah',
    labelAr: 'جمعة مباركة',
    labelDe: 'Jumuah Mubarakah',
    defaultHeadlineAr: 'جُمُعَةٌ مُبَارَكَة',
    defaultSubheadline: 'JUMUAH MUBARAKAH',
    headlinePresets: [
      { ar: 'جُمُعَةٌ مُبَارَكَة', de: 'JUMUAH MUBARAKAH' },
      { ar: 'طَابَتْ جُمُعَتُكُم', de: 'GESEGNETER FREITAG' },
      { ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّد', de: 'FRIEDE SEI MIT MUHAMMAD' }
    ],
    ayahOrQuoteAr: '« إِنَّ يَوْمَ الْجُمُعَةِ سَيِّدُ الأَيَّامِ وَأَعْظَمُهَا عِنْدَ اللَّهِ »',
    footerTag: 'Jumuah Mubarakah',
    recommendedTemplate: 'turquoise_mosaic',
    blessings: [
      {
        ar: 'جمعة مباركة طيبة، نسأل الله في هذه الساعة المباركة أن يغفر ذنوبكم وييسر أموركم ويشرح صدوركم.',
        de: 'Jumuah Mubarakah! Möge dieser gesegnete Freitag Ihnen Ruhe im Herzen und viel Segen schenken.'
      },
      {
        ar: 'نور الله جمعتكم بسورة الكهف وأجاب دعاءكم بالخير والبركة والقبول.',
        de: 'Einen gesegneten Freitag voller Licht, Besinnung und Gebetserhörung.'
      }
    ]
  },
  {
    id: 'general',
    labelAr: 'أفراح وتهانٍ عامة',
    labelDe: 'Allgemeine Glückwünsche',
    defaultHeadlineAr: 'أَلْفُ مَبْرُوك',
    defaultSubheadline: 'HERZLICHEN GLÜCKWUNSCH',
    headlinePresets: [
      { ar: 'أَلْفُ مَبْرُوك', de: 'HERZLICHEN GLÜCKWUNSCH' },
      { ar: 'بَارَكَ اللَّهُ لَكُمَا', de: 'ALLAH SEGNE EUCH BEIDE' },
      { ar: 'عُمْرَةٌ مَقْبُولَة', de: 'UMRAH MAQBULA' },
      { ar: 'شِفَاءً عَاجِلًا', de: 'GUTE BESSERUNG' }
    ],
    ayahOrQuoteAr: '« رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ »',
    footerTag: 'Segenswünsche',
    recommendedTemplate: 'rose_dawn',
    blessings: [
      {
        ar: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير، وأدام الله السعادة والمودة في بيتكما.',
        de: 'BarakAllahu lakuma! Möge Allah Ihre Ehe segnen und Sie in Güte, Liebe und Harmonie vereinen.'
      },
      {
        ar: 'بورك لكم في الموهوب وشكرتم الواهب وبلغ أشده ورزقتم بره. ألف مبروك المولود الجديد!',
        de: 'Herzlichen Glückwunsch zur Geburt! Möge Allah das Kind behüten und zu einem Segen machen.'
      },
      {
        ar: 'أطيب التهاني القلبية بالنجاح والتوفيق، زادكم الله علماً ونفعاً وبركة في حياتكم.',
        de: 'Herzliche Glückwünsche zum Erfolg! Möge Allah Ihnen stets Wissen, Kraft und Segen schenken.'
      }
    ]
  }
];
