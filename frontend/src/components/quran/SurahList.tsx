import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Play, X } from 'lucide-react';

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
    
    // Load reading progress
    const stored = localStorage.getItem('lastReadProgress');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const daysSince = (Date.now() - new Date(parsed.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince <= 30) {
          setLastRead(parsed);
        }
      } catch (err) {
        console.error(err);
      }
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

  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gau-msa-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-semibold">Failed to load surahs</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <button
  onClick={() => onSelectSurah(lastRead.surahNumber, lastRead.ayahNumber)}
  className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors text-sm flex items-center space-x-1"
>
  <span>Resume</span>
  <ChevronRight className="h-4 w-4" />
</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ✅ CONTINUE READING REMINDER */}
      {lastRead && showReminder && (
        <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-xl p-4 text-white shadow-md overflow-hidden">
          <button
            onClick={() => setShowReminder(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-between gap-3 flex-wrap pr-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Play className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-100">Continue Reading</p>
                <p className="font-bold">{lastRead.surahEnglishName}</p>
                <p className="text-xs text-emerald-200">
                  Ayah {lastRead.ayahNumber} of {lastRead.totalAyahs}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectSurah(lastRead.surahNumber)}
              className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors text-sm flex items-center space-x-1"
            >
              <span>Resume</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gau-msa-primary">The Holy Quran</h2>
            <p className="text-sm text-gray-500 mt-1">{surahs.length} Surahs</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search surah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gau-msa-primary w-64"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => onSelectSurah(surah.number)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gau-msa-primary hover:text-white transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold bg-gau-msa-primary text-white w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-gau-msa-primary transition-colors flex-shrink-0">
                  {surah.number}
                </span>
                <div className="text-left">
                  <div className="font-semibold">{surah.name}</div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-200">
                    {surah.englishName}
                  </div>
                </div>
              </div>
              <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No surahs match "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SurahList;