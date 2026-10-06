import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Play, X } from 'lucide-react';
import PageHeader from '../ui/PageHeader';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

interface SurahListProps {
  onSelectSurah: (surahNumber: number, ayahNumber?: number) => void;
}

const SurahList: React.FC<SurahListProps> = ({ onSelectSurah }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRead, setLastRead] = useState<any>(null);
  const [showReminder, setShowReminder] = useState(true);

  useEffect(() => {
    fetchSurahs();
    const stored = localStorage.getItem('lastReadProgress');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const days =
          (Date.now() - new Date(parsed.timestamp).getTime()) /
          (1000 * 60 * 60 * 24);
        if (days <= 30) setLastRead(parsed);
      } catch {}
    }
  }, []);

  const fetchSurahs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setSurahs(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load surahs');
    } finally {
      setLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title="The Holy Quran" subtitle="Read, listen, and reflect" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gau-msa-primary dark:border-gau-msa-gold"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader title="The Holy Quran" subtitle="Read, listen, and reflect" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold text-sm">
            Failed to load surahs
          </p>
          <p className="text-red-500 dark:text-red-400 text-xs mt-2">{error}</p>
          <button
            onClick={fetchSurahs}
            className="mt-4 bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="The Holy Quran"
        subtitle={`${surahs.length} Surahs • Read, listen, and reflect`}
        backTo="/profile/dashboard"
      />

      {/* Continue Reading Reminder */}
      {lastRead && showReminder && (
        <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-xl p-3 md:p-4 text-white shadow-md overflow-hidden">
          <button
            onClick={() => setShowReminder(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-between gap-3 flex-wrap pr-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Play className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-emerald-100">
                  Continue Reading
                </p>
                <p className="font-bold text-sm md:text-base">
                  {lastRead.surahEnglishName}
                </p>
                <p className="text-[10px] md:text-xs text-emerald-200">
                  Ayah {lastRead.ayahNumber} of {lastRead.totalAyahs}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                onSelectSurah(lastRead.surahNumber, lastRead.ayahNumber)
              }
              className="bg-white text-emerald-700 px-3 md:px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 active:scale-95 transition-all text-xs md:text-sm flex items-center space-x-1"
            >
              <span>Resume</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-6 transition-colors">
        {/* Search */}
        <div className="relative mb-4 md:mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search surah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold focus:border-transparent text-sm transition-colors"
          />
        </div>

        {/* Surah Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => onSelectSurah(surah.number)}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gau-msa-primary dark:hover:bg-gau-msa-primary hover:text-white active:scale-[0.98] transition-all duration-200 group text-left"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span className="text-xs md:text-sm font-bold bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-gau-msa-primary transition-colors flex-shrink-0">
                  {surah.number}
                </span>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-sm md:text-base truncate text-gray-800 dark:text-gray-100 group-hover:text-white transition-colors">
                    {surah.name}
                  </div>
                  <div className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-200 truncate transition-colors">
                    {surah.englishName} • {surah.numberOfAyahs}v
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-400 dark:text-gray-300" />
            </button>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            No surahs match "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SurahList;