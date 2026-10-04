export interface Athkar {
  id: string;
  text: string;
  arabic: string;
  translation: string;
  repeat: number;
  reference: string;
}

export interface AthkarCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  athkar: Athkar[];
}

export const athkarCategories: AthkarCategory[] = [
  {
    id: 'morning',
    label: 'Morning',
    icon: '🌅',
    description: 'Recite after Fajr until sunrise',
    athkar: [
      {
        id: 'm1',
        text: 'Ayat al-Kursi',
        arabic:
          'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
        translation:
          'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
        repeat: 1,
        reference: 'Quran 2:255',
      },
      {
        id: 'm2',
        text: 'Sayyid al-Istighfar',
        arabic:
          'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
        translation:
          'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best as I can.',
        repeat: 1,
        reference: 'Sahih al-Bukhari',
      },
      {
        id: 'm3',
        text: 'Protection Dua',
        arabic:
          'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        translation:
          'In the name of Allah, with whose name nothing on earth or in the sky can cause harm, and He is the All-Hearing, All-Knowing.',
        repeat: 3,
        reference: 'Sunan Abi Dawud',
      },
      {
        id: 'm4',
        text: 'Contentment Dua',
        arabic:
          'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
        translation:
          'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.',
        repeat: 3,
        reference: 'Sunan Abi Dawud',
      },
      {
        id: 'm5',
        text: 'Tasbih',
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        translation: 'Glory be to Allah and praise be to Him.',
        repeat: 100,
        reference: 'Sahih Muslim',
      },
    ],
  },
  {
    id: 'evening',
    label: 'Evening',
    icon: '🌙',
    description: 'Recite after Asr until Maghrib',
    athkar: [
      {
        id: 'e1',
        text: 'Ayat al-Kursi',
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
        translation:
          'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
        repeat: 1,
        reference: 'Quran 2:255',
      },
      {
        id: 'e2',
        text: 'Sayyid al-Istighfar',
        arabic:
          'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ',
        translation:
          'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant.',
        repeat: 1,
        reference: 'Sahih al-Bukhari',
      },
      {
        id: 'e3',
        text: 'Protection Dua',
        arabic:
          'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ',
        translation:
          'In the name of Allah, with whose name nothing on earth or in the sky can cause harm.',
        repeat: 3,
        reference: 'Sunan Abi Dawud',
      },
      {
        id: 'e4',
        text: "A'udhu bi kalimatillah",
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        translation:
          'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        repeat: 3,
        reference: 'Sahih Muslim',
      },
      {
        id: 'e5',
        text: 'Tahleel',
        arabic:
          'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        translation:
          'There is no god but Allah, alone, without any partner. His is the dominion and His is the praise, and He is over all things competent.',
        repeat: 10,
        reference: 'Sunan Abi Dawud',
      },
    ],
  },
  {
    id: 'sleep',
    label: 'Before Sleep',
    icon: '😴',
    description: 'Recite before going to bed',
    athkar: [
      {
        id: 's1',
        text: 'Ayat al-Kursi',
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
        translation:
          'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
        repeat: 1,
        reference: 'Sahih al-Bukhari',
      },
      {
        id: 's2',
        text: 'Bismika Allahumma amutu wa ahya',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        translation: 'In Your name, O Allah, I die and I live.',
        repeat: 1,
        reference: 'Sahih al-Bukhari',
      },
      {
        id: 's3',
        text: 'Tasbih Fatimah',
        arabic:
          'سُبْحَانَ اللَّهِ (33) الْحَمْدُ لِلَّهِ (33) اللَّهُ أَكْبَرُ (34)',
        translation:
          'Glory be to Allah (33), praise be to Allah (33), Allah is the Greatest (34).',
        repeat: 1,
        reference: 'Sahih al-Bukhari',
      },
    ],
  },
  {
    id: 'waking',
    label: 'Waking Up',
    icon: '☀️',
    description: 'Recite when you wake up',
    athkar: [
      {
        id: 'w1',
        text: 'Alhamdulillah alladhi ahyana',
        arabic:
          'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        translation:
          'Praise be to Allah who gave us life after having taken it from us, and unto Him is the resurrection.',
        repeat: 1,
        reference: 'Sahih al-Bukhari',
      },
    ],
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: '✈️',
    description: 'Dua for travelling',
    athkar: [
      {
        id: 't1',
        text: 'Travel Dua',
        arabic:
          'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        translation:
          'Glory be to Him who has subjected this to us, and we could never have it by our efforts. And indeed, to our Lord we will return.',
        repeat: 1,
        reference: 'Sahih Muslim',
      },
    ],
  },
  {
    id: 'eating',
    label: 'Eating',
    icon: '🍽️',
    description: 'Before and after eating',
    athkar: [
      {
        id: 'eat1',
        text: 'Before eating',
        arabic: 'بِسْمِ اللَّهِ',
        translation: 'In the name of Allah.',
        repeat: 1,
        reference: 'Sunan Abi Dawud',
      },
      {
        id: 'eat2',
        text: 'After eating',
        arabic:
          'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        translation:
          'Praise be to Allah who has fed me this and provided it for me without any strength or power on my part.',
        repeat: 1,
        reference: 'Sunan Abi Dawud',
      },
    ],
  },
];

export const getAthkarById = (categoryId: string): AthkarCategory | undefined => {
  return athkarCategories.find((c) => c.id === categoryId);
};