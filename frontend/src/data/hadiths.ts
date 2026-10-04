export interface Hadith {
  id: string;
  text: string;
  arabic?: string;
  narrator: string;
  source: string;
  book: string;
  category: string;
  grade?: string;
}

export const hadithCategories = [
  { id: 'all', label: 'All Hadiths', icon: '📖' },
  { id: 'faith', label: 'Faith', icon: '🕌' },
  { id: 'prayer', label: 'Prayer', icon: '🤲' },
  { id: 'charity', label: 'Charity', icon: '💝' },
  { id: 'fasting', label: 'Fasting', icon: '🌙' },
  { id: 'character', label: 'Character', icon: '🌟' },
  { id: 'knowledge', label: 'Knowledge', icon: '📚' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { id: 'patience', label: 'Patience', icon: '🌿' },
];

export const hadiths: Hadith[] = [
  {
    id: '1',
    text: 'The best among you are those who have the best manners and character.',
    arabic: 'خَيْرُكُمْ أَحْسَنُكُمْ أَخْلَاقًا',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih al-Bukhari',
    book: 'Book of Manners',
    category: 'character',
    grade: 'Sahih',
  },
  {
    id: '2',
    text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    narrator: 'Anas ibn Malik (RA)',
    source: 'Sahih al-Bukhari',
    book: 'Book of Faith',
    category: 'faith',
    grade: 'Sahih',
  },
  {
    id: '3',
    text: 'The most beloved deeds to Allah are those done consistently, even if they are small.',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    narrator: 'Aisha (RA)',
    source: 'Sahih Muslim',
    book: 'Book of Prayer',
    category: 'prayer',
    grade: 'Sahih',
  },
  {
    id: '4',
    text: 'Charity does not decrease wealth.',
    arabic: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih Muslim',
    book: 'Book of Charity',
    category: 'charity',
    grade: 'Sahih',
  },
  {
    id: '5',
    text: 'Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven.',
    arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih al-Bukhari',
    book: 'Book of Fasting',
    category: 'fasting',
    grade: 'Sahih',
  },
  {
    id: '6',
    text: 'Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise.',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَطْلُبُ فِيهِ عِلْمًا سَلَكَ اللَّهُ بِهِ طَرِيقًا مِنْ طُرُقِ الْجَنَّةِ',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih Muslim',
    book: 'Book of Knowledge',
    category: 'knowledge',
    grade: 'Sahih',
  },
  {
    id: '7',
    text: 'The best of you is the one who is best to his family.',
    arabic: 'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ',
    narrator: 'Aisha (RA)',
    source: 'Sunan at-Tirmidhi',
    book: 'Book of Family',
    category: 'family',
    grade: 'Sahih',
  },
  {
    id: '8',
    text: 'No one is given a gift better and more abundant than patience.',
    arabic: 'وَمَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ',
    narrator: "Abu Sa'id al-Khudri (RA)",
    source: 'Sahih al-Bukhari',
    book: 'Book of Patience',
    category: 'patience',
    grade: 'Sahih',
  },
  {
    id: '9',
    text: 'The strong believer is better and more beloved to Allah than the weak believer.',
    arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih Muslim',
    book: 'Book of Faith',
    category: 'faith',
    grade: 'Sahih',
  },
  {
    id: '10',
    text: 'Make things easy and do not make them difficult. Give glad tidings and do not repel people.',
    arabic: 'يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا',
    narrator: 'Abu Musa (RA)',
    source: 'Sahih al-Bukhari',
    book: 'Book of Manners',
    category: 'character',
    grade: 'Sahih',
  },
];