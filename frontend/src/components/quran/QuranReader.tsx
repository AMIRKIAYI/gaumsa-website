import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Play, Pause, Loader2, Volume2, 
  BookOpen, Languages, Share2, Copy,
  SkipBack, SkipForward, ChevronDown, ChevronUp, List,
  Search
} from 'lucide-react';

interface QuranReaderProps {
  surahNumber: number;
  onBack: () => void;
}

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
  audio?: string;
  isBismillah?: boolean;
}

interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

const TRANSLATIONS = [
  { id: 'en.sahih', name: 'Saheeh International' },
  { id: 'en.pickthall', name: 'Pickthall' },
  { id: 'en.yusufali', name: 'Yusuf Ali' },
];

const BISMILLAH_AUDIO = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3';
const BISMILLAH_TEXT = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
const BISMILLAH_TRANSLATION = 'In the name of Allah, the Entirely Merciful, the Especially Merciful.';

const QuranReader: React.FC<QuranReaderProps> = ({ surahNumber, onBack }) => {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [surahInfo, setSurahInfo] = useState<SurahInfo | null>(null);
  const [surahList, setSurahList] = useState<SurahSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showTranslation, setShowTranslation] = useState(true);
  const [translationEdition, setTranslationEdition] = useState('en.sahih');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAyah, setExpandedAyah] = useState<number | null>(null);

  // ==================== TRACK READING PROGRESS ====================
  useEffect(() => {
    if (!surahInfo || ayahs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ayahNum = parseInt(entry.target.id.replace('ayah-', ''));
            if (!isNaN(ayahNum)) {
              const progress = {
                surahNumber: surahInfo.number,
                surahName: surahInfo.name,
                surahEnglishName: surahInfo.englishName,
                ayahNumber: ayahNum,
                totalAyahs: ayahs.length,
                timestamp: new Date().toISOString(),
              };
              localStorage.setItem('lastReadProgress', JSON.stringify(progress));
            }
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
    );

    ayahs.forEach((ayah) => {
      const el = document.getElementById(`ayah-${ayah.numberInSurah}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ayahs, surahInfo]);

  // ==================== AUTO-SCROLL TO HASH AYAH ====================
  useEffect(() => {
    if (ayahs.length === 0 || loading) return;

    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#ayah-')) return;

    const ayahNum = parseInt(hash.replace('#ayah-', ''));
    if (isNaN(ayahNum)) return;

    const scrollTimer = setTimeout(() => {
      const el = document.getElementById(`ayah-${ayahNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-gau-msa-gold', 'ring-offset-2', 'rounded-xl', 'dark:ring-offset-gray-900');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-gau-msa-gold', 'ring-offset-2', 'rounded-xl', 'dark:ring-offset-gray-900');
        }, 3500);
      }
    }, 800);

    return () => clearTimeout(scrollTimer);
  }, [ayahs, loading]);

  // ==================== FETCH SURAH LIST ====================
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSurahList(data.data || []);
      } catch (err) {
        console.error('Failed to load surah list:', err);
      }
    };
    fetchList();
  }, []);

  // ==================== FETCH SURAH DATA ====================
  useEffect(() => {
    if (!surahNumber || isNaN(surahNumber)) {
      setError('Invalid surah number');
      setLoading(false);
      return;
    }
    fetchSurahData();
  }, [surahNumber, translationEdition]);

  const fetchSurahData = async () => {
    setLoading(true);
    setError(null);
    setAyahs([]);
    setTranslations({});
    setSurahInfo(null);
    stopAudio();

    try {
      const [uthmaniRes, translationRes, audioRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${translationEdition}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`),
      ]);

      if (!uthmaniRes.ok) throw new Error(`HTTP ${uthmaniRes.status}`);
      if (!translationRes.ok) throw new Error(`HTTP ${translationRes.status}`);
      if (!audioRes.ok) throw new Error(`HTTP ${audioRes.status}`);

      const uthmaniData = await uthmaniRes.json();
      const translationData = await translationRes.json();
      const audioData = await audioRes.json();

      const surah = uthmaniData.data;
      const audioAyahs = audioData.data.ayahs || [];
      const translationAyahs = translationData.data.ayahs || [];

      const stripBismillahFromFirstAyah = (text: string, surahNum: number): string => {
        if (surahNum === 1 || surahNum === 9) return text;

        const words = text.trim().split(/\s+/);
        
        if (words.length > 4) {
          const first4 = words.slice(0, 4).join(' ');
          
          const normalize = (s: string) =>
            s.replace(/[\u064B-\u0652\u0670\u0640\u06D6-\u06ED]/g, '')
             .replace(/ٱ/g, 'ا')
             .replace(/\s+/g, ' ')
             .trim();
          
          const normalizedFirst4 = normalize(first4);
          const normalizedBismillah = normalize('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
          
          if (normalizedFirst4 === normalizedBismillah) {
            return words.slice(4).join(' ');
          }
        }
        
        return text;
      };

      const shouldPrependBismillah = surah.number !== 1 && surah.number !== 9;

      const cleanAyahs: Ayah[] = [];
      const trans: Record<number, string> = {};

      if (shouldPrependBismillah) {
        cleanAyahs.push({
          number: -surah.number,
          numberInSurah: 1,
          text: BISMILLAH_TEXT,
          juz: surah.ayahs[0]?.juz || 1,
          page: surah.ayahs[0]?.page || 1,
          audio: BISMILLAH_AUDIO,
          isBismillah: true,
        });
        trans[1] = BISMILLAH_TRANSLATION;

        surah.ayahs.forEach((ayah: any, index: number) => {
          const displayNumber = ayah.numberInSurah + 1;
          
          const cleanedText = index === 0 
            ? stripBismillahFromFirstAyah(ayah.text, surah.number)
            : ayah.text;
          
          cleanAyahs.push({
            number: ayah.number,
            numberInSurah: displayNumber,
            text: cleanedText,
            juz: ayah.juz,
            page: ayah.page,
            audio: audioAyahs[index]?.audio || undefined,
          });
          trans[displayNumber] = translationAyahs[index]?.text || '';
        });
      } else {
        surah.ayahs.forEach((ayah: any, index: number) => {
          cleanAyahs.push({
            number: ayah.number,
            numberInSurah: ayah.numberInSurah,
            text: ayah.text,
            juz: ayah.juz,
            page: ayah.page,
            audio: audioAyahs[index]?.audio || undefined,
          });
          trans[ayah.numberInSurah] = translationAyahs[index]?.text || '';
        });
      }

      setSurahInfo({
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        revelationType: surah.revelationType,
        numberOfAyahs: shouldPrependBismillah ? surah.numberOfAyahs + 1 : surah.numberOfAyahs,
      });

      setAyahs(cleanAyahs);
      setTranslations(trans);

      localStorage.setItem(
        'lastReadSurah',
        JSON.stringify({
          surahNumber: surah.number,
          surahName: surah.name,
          surahEnglishName: surah.englishName,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load surah');
    } finally {
      setLoading(false);
    }
  };

  // ==================== AUDIO ====================
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingAyah(null);
    setIsPlayingAll(false);
  };

  const playAyah = (ayah: Ayah, continuous = false) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!ayah.audio) return;

    const audio = new Audio(ayah.audio);
    audioRef.current = audio;
    audio.play().catch(() => setPlayingAyah(null));
    setPlayingAyah(ayah.numberInSurah);

    audio.onended = () => {
      if (continuous && ayah.numberInSurah < ayahs.length) {
        const next = ayahs.find((a) => a.numberInSurah === ayah.numberInSurah + 1);
        if (next) {
          playAyah(next, true);
          const el = document.getElementById(`ayah-${next.numberInSurah}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      setPlayingAyah(null);
      setIsPlayingAll(false);
    };
  };

  const toggleAyah = (ayah: Ayah) => {
    if (playingAyah === ayah.numberInSurah) {
      stopAudio();
    } else {
      playAyah(ayah, isPlayingAll);
    }
  };

  const playAll = () => {
    if (ayahs.length === 0) return;
    setIsPlayingAll(true);
    playAyah(ayahs[0], true);
  };

  const goToSurah = (num: number) => {
    window.location.href = `/quran/${num}`;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const filteredSurahList = surahList.filter(
    (s) =>
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.includes(searchTerm) ||
      String(s.number).includes(searchTerm)
  );

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-gau-msa-primary dark:text-gau-msa-gold mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading surah...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400 font-semibold">Failed to load surah</p>
        <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
        <div className="flex gap-2 justify-center mt-4">
          <button
            onClick={fetchSurahData}
            className="bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gau-msa-secondary dark:hover:opacity-90 font-semibold transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onBack}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Surahs
          </button>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="flex gap-6 -mt-4">
      {/* SIDEBAR */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 overflow-hidden transition-colors">
          <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary p-4 text-white">
            <h3 className="font-bold flex items-center space-x-2">
              <List className="h-5 w-5" />
              <span>All Surahs</span>
            </h3>
            <p className="text-xs text-gau-msa-gold mt-1">114 Chapters</p>
          </div>

          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search surah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {filteredSurahList.map((surah) => (
              <button
                key={surah.number}
                onClick={() => goToSurah(surah.number)}
                className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left border-l-4 ${
                  surah.number === surahNumber
                    ? 'bg-gau-msa-primary/5 dark:bg-gau-msa-gold/10 border-gau-msa-primary dark:border-gau-msa-gold'
                    : 'border-transparent'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                    surah.number === surahNumber
                      ? 'bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {surah.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {surah.englishName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {surah.englishNameTranslation} • {surah.numberOfAyahs}v
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0">
        {/* STICKY HEADER */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 sticky top-20 z-20 overflow-hidden transition-colors">
          <div className="bg-gradient-to-r from-gau-msa-primary via-gau-msa-secondary to-gau-msa-primary text-white p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Surahs</span>
              </button>

              <div className="text-center flex-1">
                <h2 className="text-xl md:text-2xl font-bold font-arabic" dir="rtl">
                  {surahInfo?.name}
                </h2>
                <p className="text-xs text-gau-msa-gold">
                  {surahInfo?.englishName} • {surahInfo?.numberOfAyahs} verses • {surahInfo?.revelationType}
                </p>
              </div>

              <button
                onClick={() => setSearchTerm('')}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-3 flex items-center justify-between gap-2 flex-wrap">
            <button
              onClick={playingAyah ? stopAudio : playAll}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                playingAyah
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900 hover:bg-gau-msa-secondary dark:hover:opacity-90'
              }`}
            >
              {playingAyah ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Play All</span>
                </>
              )}
            </button>

            {isPlayingAll && playingAyah && (
              <div className="flex items-center space-x-2 text-xs text-gau-msa-primary dark:text-gau-msa-gold bg-gau-msa-primary/10 dark:bg-gau-msa-gold/10 px-3 py-1.5 rounded-full">
                <Volume2 className="h-3 w-3 animate-pulse" />
                <span>Verse {playingAyah} / {ayahs.length}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showTranslation
                    ? 'bg-gau-msa-gold/20 dark:bg-gau-msa-gold/30 text-gau-msa-primary dark:text-gau-msa-gold'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">Translation</span>
              </button>

              {showTranslation && (
                <select
                  value={translationEdition}
                  onChange={(e) => setTranslationEdition(e.target.value)}
                  className="px-2 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold transition-colors"
                >
                  {TRANSLATIONS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* AYAHS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          {ayahs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No verses found.</div>
          ) : (
            ayahs.map((ayah, index) => {
              const isPlaying = playingAyah === ayah.numberInSurah;
              const isExpanded = expandedAyah === ayah.numberInSurah;
              const isBismillah = ayah.isBismillah;

              return (
                <div
                  key={ayah.number}
                  id={`ayah-${ayah.numberInSurah}`}
                  className={`relative transition-all duration-300 ${
                    isPlaying
                      ? 'bg-gau-msa-primary/5 dark:bg-gau-msa-gold/10'
                      : isBismillah
                      ? 'bg-gradient-to-r from-gau-msa-gold/5 to-transparent dark:from-gau-msa-gold/10'
                      : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/30'
                  } ${index !== ayahs.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                >
                  {/* Number badge */}
                  <div className="absolute top-6 left-4 md:left-6">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-all ${
                        isPlaying
                          ? 'bg-gau-msa-gold text-white scale-110'
                          : isBismillah
                          ? 'bg-gau-msa-gold text-white'
                          : 'bg-gau-msa-primary/10 dark:bg-gau-msa-gold/20 text-gau-msa-primary dark:text-gau-msa-gold'
                      }`}
                    >
                      {ayah.numberInSurah}
                    </div>
                  </div>

                  <div className="pl-20 pr-4 md:pr-8 py-6">
                    {/* Meta row */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleAyah(ayah)}
                          disabled={!ayah.audio}
                          className={`p-2 rounded-full transition-all shadow-sm ${
                            isPlaying
                              ? 'bg-gau-msa-gold text-white'
                              : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gau-msa-primary dark:text-gau-msa-gold hover:bg-gau-msa-primary dark:hover:bg-gau-msa-gold hover:text-white hover:border-gau-msa-primary dark:hover:border-gau-msa-gold'
                          } disabled:opacity-50`}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </button>

                        {isPlaying && (
                          <div className="flex items-end space-x-1 h-5">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-1 bg-gau-msa-gold rounded-full animate-pulse"
                                style={{
                                  height: `${[60, 90, 40, 80][i]}%`,
                                  animationDelay: `${i * 150}ms`,
                                }}
                              ></div>
                            ))}
                          </div>
                        )}

                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Juz {ayah.juz} • Page {ayah.page}
                        </span>
                      </div>

                      <button
                        onClick={() => setExpandedAyah(isExpanded ? null : ayah.numberInSurah)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Arabic */}
                    <p
                      className={`text-right mb-5 ${
                        isBismillah
                          ? 'text-2xl md:text-3xl text-gau-msa-primary dark:text-gau-msa-gold'
                          : 'text-2xl md:text-3xl lg:text-[2rem] text-gray-900 dark:text-gray-100'
                      } leading-[2.2]`}
                      dir="rtl"
                      style={{ fontFamily: '"Amiri", "Scheherazade New", serif' }}
                    >
                      {ayah.text}
                    </p>

                    {/* Translation */}
                    {showTranslation && translations[ayah.numberInSurah] && (
                      <div
                        className={`border-l-4 rounded-r-lg p-4 ${
                          isBismillah
                            ? 'bg-gau-msa-gold/10 dark:bg-gau-msa-gold/20 border-gau-msa-gold'
                            : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 border-gau-msa-gold'
                        }`}
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {translations[ayah.numberInSurah]}
                        </p>
                      </div>
                    )}

                    {isExpanded && !isBismillah && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${ayah.text}\n\n${translations[ayah.numberInSurah] || ''}`
                            );
                            alert('Copied!');
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-300 transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/quran/${surahNumber}#ayah-${ayah.numberInSurah}`
                            );
                            alert('Link copied!');
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-300 transition-colors"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Share</span>
                        </button>
                        <a
                          href={`https://quran.com/${surahNumber}/${ayah.numberInSurah}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gau-msa-primary/10 dark:bg-gau-msa-gold/20 text-gau-msa-primary dark:text-gau-msa-gold hover:bg-gau-msa-primary/20 dark:hover:bg-gau-msa-gold/30 rounded-lg text-xs transition-colors"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Tafsir & Lessons</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM NAV */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-4 p-4 flex items-center justify-between transition-colors">
          {surahNumber > 1 ? (
            <button
              onClick={() => goToSurah(surahNumber - 1)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gau-msa-primary dark:hover:bg-gau-msa-gold hover:text-white dark:hover:text-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
            >
              <SkipBack className="h-4 w-4" />
              <span>Previous Surah</span>
            </button>
          ) : (
            <div></div>
          )}

          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {surahNumber} / 114
          </span>

          {surahNumber < 114 ? (
            <button
              onClick={() => goToSurah(surahNumber + 1)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gau-msa-primary dark:hover:bg-gau-msa-gold hover:text-white dark:hover:text-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
            >
              <span>Next Surah</span>
              <SkipForward className="h-4 w-4" />
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuranReader;