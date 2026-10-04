export interface NawawiHadith {
  id: number;
  arabic: string;
  english: string;
  narrator: string;
  source: string;
  audioUrl?: string; // undefined when audio is not available
}

// ✅ Base URL for the AminaKhan40hadith collection
// This collection contains audio for hadiths 1–20 
const AUDIO_BASE =
  'https://archive.org/download/AminaKhan40hadith/fr-Islamhouse-Al_Arba3in_an_Nawawiyyah_';

// ✅ Only hadiths 1–20 have audio in this collection
const AUDIO_MAP: Record<number, string> = {
  1: `${AUDIO_BASE}1_Kamel.mp3`,
  2: `${AUDIO_BASE}2_Kamel.mp3`,
  3: `${AUDIO_BASE}3_Kamel.mp3`,
  4: `${AUDIO_BASE}4_Kamel.mp3`,
  5: `${AUDIO_BASE}5_Kamel.mp3`,
  6: `${AUDIO_BASE}6_Kamel.mp3`,
  7: `${AUDIO_BASE}7_Kamel.mp3`,
  8: `${AUDIO_BASE}8_Kamel.mp3`,
  9: `${AUDIO_BASE}9_Kamel.mp3`,
  10: `${AUDIO_BASE}10_Kamel.mp3`,
  11: `${AUDIO_BASE}11_Kamel.mp3`,
  12: `${AUDIO_BASE}12_Kamel.mp3`,
  13: `${AUDIO_BASE}13_Kamel.mp3`,
  14: `${AUDIO_BASE}14_Kamel.mp3`,
  15: `${AUDIO_BASE}15_Kamel.mp3`,
  16: `${AUDIO_BASE}16_Kamel.mp3`,
  17: `${AUDIO_BASE}17_Kamel.mp3`,
  18: `${AUDIO_BASE}18_Kamel.mp3`,
  19: `${AUDIO_BASE}19_Kamel.mp3`,
  20: `${AUDIO_BASE}20_Kamel.mp3`,
};

export const nawawi40: NawawiHadith[] = [
  {
    id: 1,
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    english:
      'Actions are judged by intentions, and each person will have what they intended. So whoever migrated for worldly gain or to marry a woman, his migration is for what he migrated for.',
    narrator: 'Umar ibn al-Khattab (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[1],
  },
  {
    id: 2,
    arabic: 'بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ ﷺ ذَاتَ يَوْمٍ',
    english:
      'Islam is built upon five: testifying that there is no god but Allah and Muhammad is His Messenger, establishing prayer, giving zakat, performing Hajj, and fasting Ramadan.',
    narrator: 'Umar ibn al-Khattab (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[2],
  },
  {
    id: 3,
    arabic: 'بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ',
    english:
      'Islam is built upon five pillars: the testimony of faith, prayer, zakat, Hajj, and fasting Ramadan.',
    narrator: 'Abdullah ibn Umar (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[3],
  },
  {
    id: 4,
    arabic: 'إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا',
    english:
      "The creation of each of you is gathered in the mother's womb for forty days as a drop, then a clot, then a morsel, then an angel is sent to breathe the soul into him, and is commanded to write four matters: his provision, his lifespan, his deeds, and whether he will be happy or miserable.",
    narrator: 'Abdullah ibn Masud (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[4],
  },
  {
    id: 5,
    arabic: 'مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ',
    english:
      'Whoever introduces into this matter of ours something that is not from it, it will be rejected.',
    narrator: 'Aisha (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[5],
  },
  {
    id: 6,
    arabic: 'إِنَّ الْحَلَالَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ',
    english:
      'The lawful is clear and the unlawful is clear, and between them are doubtful matters about which many people do not know. So whoever avoids the doubtful saves his religion and his honor.',
    narrator: "Al-Nu'man ibn Bashir (RA)",
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[6],
  },
  {
    id: 7,
    arabic: 'الدِّينُ النَّصِيحَةُ',
    english: 'Religion is sincerity (good advice).',
    narrator: 'Tamim al-Dari (RA)',
    source: 'Sahih Muslim',
    audioUrl: AUDIO_MAP[7],
  },
  {
    id: 8,
    arabic: 'أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لَا إِلَهَ إِلَّا اللَّهُ',
    english:
      'I have been commanded to fight the people until they testify that there is no god but Allah and that Muhammad is the Messenger of Allah, establish prayer, and give zakat. If they do that, their lives and property are protected except by the right of Islam, and their reckoning is with Allah.',
    narrator: 'Abdullah ibn Umar (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[8],
  },
  {
    id: 9,
    arabic: 'مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ، وَمَا أَمَرْتُكُمْ بِهِ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ',
    english:
      'What I have forbidden for you, avoid. What I have ordered you to do, do as much of it as you can. For it was only the excessive questioning and their disagreeing with their Prophets that destroyed those before you.',
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[9],
  },
  {
    id: 10,
    arabic: 'إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا',
    english:
      'Allah is Good and accepts only that which is good. He commanded the believers as He commanded the Messengers, saying: "O Messengers, eat from the good things and act righteously." And: "O you who believe, eat from the good things We have provided you."',
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sahih Muslim',
    audioUrl: AUDIO_MAP[10],
  },
  {
    id: 11,
    arabic: 'دَعْ مَا يُرِيبُكَ إِلَى مَا لَا يُرِيبُكَ',
    english:
      'Leave that which makes you doubt for that which does not make you doubt.',
    narrator: 'Al-Hasan ibn Ali (RA)',
    source: 'Sunan at-Tirmidhi & Sunan an-Nasai',
    audioUrl: AUDIO_MAP[11],
  },
  {
    id: 12,
    arabic: 'مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ',
    english:
      "Part of the perfection of one's Islam is his leaving that which does not concern him.",
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sunan at-Tirmidhi',
    audioUrl: AUDIO_MAP[12],
  },
  {
    id: 13,
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    english:
      'None of you truly believes until he loves for his brother what he loves for himself.',
    narrator: 'Anas ibn Malik (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[13],
  },
  {
    id: 14,
    arabic: 'لَا يَحِلُّ دَمُ امْرِئٍ مُسْلِمٍ إِلَّا بِإِحْدَى ثَلَاثٍ',
    english:
      'It is not permissible to spill the blood of a Muslim except in three cases: the married adulterer, a life for a life, and the one who forsakes his religion and separates from the community.',
    narrator: 'Abdullah ibn Masud (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[14],
  },
  {
    id: 15,
    arabic:
      'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    english:
      'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
    audioUrl: AUDIO_MAP[15],
  },
  {
    id: 16,
    arabic: 'لَا تَغْضَبْ',
    english: 'Do not become angry.',
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sahih al-Bukhari',
    audioUrl: AUDIO_MAP[16],
  },
  {
    id: 17,
    arabic: 'إِنَّ اللَّهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَيْءٍ',
    english:
      'Allah has prescribed excellence in all things. So if you kill, kill well; and if you slaughter, slaughter well.',
    narrator: 'Shaddad ibn Aws (RA)',
    source: 'Sahih Muslim',
    audioUrl: AUDIO_MAP[17],
  },
  {
    id: 18,
    arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ',
    english:
      'Fear Allah wherever you are, follow a bad deed with a good deed and it will erase it, and treat people with good character.',
    narrator: 'Abu Dharr (RA)',
    source: 'Sunan at-Tirmidhi',
    audioUrl: AUDIO_MAP[18],
  },
  {
    id: 19,
    arabic: 'احْفَظِ اللَّهَ يَحْفَظْكَ',
    english:
      'Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him before you. When you ask, ask Allah; when you seek help, seek help from Allah.',
    narrator: 'Abdullah ibn Abbas (RA)',
    source: 'Sunan at-Tirmidhi',
    audioUrl: AUDIO_MAP[19],
  },
  {
    id: 20,
    arabic: 'إِنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلَامِ النُّبُوَّةِ الأُولَى',
    english:
      'Among the things people learned from the earlier prophecies: If you have no shame, do as you please.',
    narrator: 'Abu Masud (RA)',
    source: 'Sahih al-Bukhari',
    audioUrl: AUDIO_MAP[20],
  },
  {
    id: 21,
    arabic: 'قُلْ آمَنْتُ بِاللَّهِ ثُمَّ اسْتَقِمْ',
    english: 'Say, "I believe in Allah," and then be steadfast.',
    narrator: 'Sufyan ibn Abdullah (RA)',
    source: 'Sahih Muslim',
    // No audio available
  },
  {
    id: 22,
    arabic: 'أَرَأَيْتَ إِذَا صَلَّيْتُ الْمَكْتُوبَاتِ',
    english:
      'If I pray the obligatory prayers, fast Ramadan, make the lawful lawful and the unlawful unlawful, and do nothing more, will I enter Paradise? He said: Yes.',
    narrator: 'Jabir (RA)',
    source: 'Sahih Muslim',
  },
  {
    id: 23,
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
    english:
      'Purity is half of faith. "Alhamdulillah" fills the scales, and "SubhanAllah" and "Alhamdulillah" fill what is between the heavens and the earth.',
    narrator: 'Abu Malik al-Ashari (RA)',
    source: 'Sahih Muslim',
  },
  {
    id: 24,
    arabic: 'يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي',
    english:
      'O My servants, I have forbidden oppression for Myself and made it forbidden among you, so do not oppress one another.',
    narrator: 'Abu Dharr (RA)',
    source: 'Sahih Muslim',
  },
  {
    id: 25,
    arabic: 'كُلُّ سُلَامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ',
    english:
      'Every joint of a person must perform a charity each day the sun rises: to judge justly is charity, to help a man with his mount is charity, a good word is charity, every step toward prayer is charity, and removing a harmful object from the road is charity.',
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
  },
  {
    id: 26,
    arabic: 'كُلُّ سُلَامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ',
    english:
      'Every joint of a person must perform a charity each day the sun rises. To reconcile between two people is charity, to help a man with his mount is charity, a good word is charity, every step toward prayer is charity, and removing a harmful object from the road is charity.',
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
  },
  {
    id: 27,
    arabic: 'الْبِرُّ حُسْنُ الْخُلُقِ',
    english:
      'Righteousness is good character, and sin is that which wavers in your heart and which you dislike for people to know about.',
    narrator: "Al-Nawwas ibn Sam'an (RA)",
    source: 'Sahih Muslim',
  },
  {
    id: 28,
    arabic: 'اسْتَفْتِ قَلْبَكَ',
    english:
      'Ask your heart. Righteousness is that which the soul and heart are at peace with, and sin is that which wavers in the soul and wavers in the chest, even if people give you rulings.',
    narrator: "Wabisah ibn Ma'bad (RA)",
    source: 'Musnad Ahmad',
  },
  {
    id: 29,
    arabic: 'الْجِهَادُ فِي سَبِيلِ اللَّهِ',
    english:
      'The best jihad is to speak a word of truth before a tyrannical ruler.',
    narrator: "Abu Sa'id al-Khudri (RA)",
    source: 'Sunan Abi Dawud',
  },
  {
    id: 30,
    arabic: 'إِنَّ اللَّهَ فَرَضَ فَرَائِضَ فَلَا تُضَيِّعُوهَا',
    english:
      'Allah has prescribed obligations, so do not neglect them. He has set limits, so do not transgress them. He has forbidden things, so do not violate them. He has remained silent about some things out of mercy, not forgetfulness, so do not seek after them.',
    narrator: "Abu Tha'labah al-Khushani (RA)",
    source: 'Sunan al-Daraqutni',
  },
  {
    id: 31,
    arabic: 'ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللَّهُ',
    english:
      'Be detached from the world and Allah will love you. Be detached from what people have and they will love you.',
    narrator: "Sahl ibn Sa'd (RA)",
    source: 'Sunan Ibn Majah',
  },
  {
    id: 32,
    arabic: 'لَا ضَرَرَ وَلَا ضِرَارَ',
    english: 'There should be neither harm nor reciprocating harm.',
    narrator: 'Abdullah ibn Abbas (RA)',
    source: 'Sunan Ibn Majah',
  },
  {
    id: 33,
    arabic: 'لَوْ أُعْطِيَ النَّاسُ بِدَعْوَاهُمْ',
    english:
      'If people were given what they claimed, they would claim the lives and property of others. But the burden of proof is on the claimant, and the oath is on the one who denies.',
    narrator: 'Abdullah ibn Abbas (RA)',
    source: 'Sunan al-Bayhaqi',
  },
  {
    id: 34,
    arabic: 'مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ',
    english:
      'Whoever among you sees an evil, let him change it with his hand. If he cannot, then with his tongue. If he cannot, then with his heart, and that is the weakest of faith.',
    narrator: "Abu Sa'id al-Khudri (RA)",
    source: 'Sahih Muslim',
  },
  {
    id: 35,
    arabic: 'لَا تَحَاسَدُوا وَلَا تَنَاجَشُوا',
    english:
      'Do not envy one another, do not outbid one another, do not hate one another, do not turn away from one another. Be brothers, O servants of Allah.',
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sahih Muslim',
  },
  {
    id: 36,
    arabic: 'مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً',
    english:
      'Whoever relieves a believer of a hardship, Allah will relieve him of a hardship on the Day of Resurrection. Whoever covers a Muslim, Allah will cover him on the Day of Resurrection.',
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sahih Muslim',
  },
  {
    id: 37,
    arabic: 'إِنَّ اللَّهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ',
    english:
      'Allah has written down good deeds and bad deeds. Whoever intends a good deed and does not do it, Allah records it as a full good deed. If he intends it and does it, Allah records it as ten to seven hundred times.',
    narrator: 'Abdullah ibn Abbas (RA)',
    source: 'Sahih al-Bukhari & Sahih Muslim',
  },
  {
    id: 38,
    arabic: 'مَنْ عَادَى لِي وَلِيًّا فَقَدْ آذَنْتُهُ بِالْحَرْبِ',
    english:
      'Whoever shows enmity to a friend of Mine, I have declared war on him. My servant does not draw near to Me with anything more beloved to Me than what I have made obligatory upon him.',
    narrator: 'Abu Hurayrah (RA)',
    source: 'Sahih al-Bukhari',
  },
  {
    id: 39,
    arabic: 'إِنَّ اللَّهَ تَجَاوَزَ لِي عَنْ أُمَّتِي',
    english:
      'Allah has pardoned my nation for mistakes, forgetfulness, and what they are forced to do.',
    narrator: 'Abdullah ibn Abbas (RA)',
    source: 'Sunan Ibn Majah',
  },
  {
    id: 40,
    arabic: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ',
    english:
      'Be in this world as though you were a stranger or a wayfarer.',
    narrator: 'Abdullah ibn Umar (RA)',
    source: 'Sahih al-Bukhari',
  },
  {
    id: 41,
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يَكُونَ هَوَاهُ تَبَعًا لِمَا جِئْتُ بِهِ',
    english:
      'None of you truly believes until his desires are in accordance with what I have brought.',
    narrator: 'Abdullah ibn Amr (RA)',
    source: 'Kitab al-Sunnah',
  },
  {
    id: 42,
    arabic: 'يَا ابْنَ آدَمَ إِنَّكَ مَا دَعَوْتَنِي وَرَجَوْتَنِي غَفَرْتُ لَكَ',
    english:
      'O son of Adam, as long as you call upon Me and hope in Me, I will forgive you for what you have done. O son of Adam, if your sins reached the clouds of the sky and you sought My forgiveness, I would forgive you.',
    narrator: 'Anas ibn Malik (RA)',
    source: 'Sunan at-Tirmidhi',
  },
];

// Helper to fetch a specific hadith by ID
export const getNawawiHadith = (id: number): NawawiHadith | undefined => {
  return nawawi40.find((h) => h.id === id);
};