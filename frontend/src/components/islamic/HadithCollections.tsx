import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Copy,
  Share2,
  Check,
} from 'lucide-react';
import {
  fetchCollections,
  fetchHadith,
  searchHadiths,
  fetchRandomHadith,
  type Collection,
  type Hadith,
} from '../../services/hadithApi';

type ViewMode = 'collections' | 'hadith' | 'search';

const HadithCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [hadithNumber, setHadithNumber] = useState(1);
  const [currentHadith, setCurrentHadith] = useState<Hadith | null>(null);
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('collections');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load collections on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const cols = await fetchCollections();
        setCollections(cols);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load single hadith
  const loadHadith = async (collectionKey: string, number: number) => {
    setLoading(true);
    setError('');
    try {
      const h = await fetchHadith(collectionKey, number);
      setCurrentHadith(h);
      setHadithNumber(number);
      setViewMode('hadith');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load random hadith
  const loadRandomHadith = async () => {
    setLoading(true);
    setError('');
    try {
      const h = await fetchRandomHadith(selectedCollection?.key);
      setCurrentHadith(h);
      setViewMode('hadith');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    try {
      const results = await searchHadiths(searchTerm, {
        collection: selectedCollection?.key,
        limit: 25,
      });
      setSearchResults(results);
      setViewMode('search');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyHadith = (h: Hadith) => {
    navigator.clipboard.writeText(
      `${h.english}\n\n${h.arabic}\n\n— ${h.collection_name}, Hadith #${h.hadithnumber}`
    );
    setCopiedId(h.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareHadith = (h: Hadith) => {
    if (navigator.share) {
      navigator.share({
        title: `${h.collection_name} #${h.hadithnumber}`,
        text: `${h.english}\n\n— ${h.collection_name}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  // ==================== COLLECTION PICKER ====================
  if (viewMode === 'collections') {
    return (
      <div className="space-y-4 md:space-y-6 px-1">
        <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-4 md:p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold">Hadith Collections</h1>
              <p className="text-xs md:text-sm text-gau-msa-gold mt-0.5 md:mt-1">
                36,000+ hadiths from 10 authentic collections
              </p>
            </div>
          </div>
        </div>

        {loading && collections.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-gau-msa-primary mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading collections...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-gau-msa-primary text-white px-4 py-2 rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {collections.map((col) => (
              <button
                key={col.key}
                onClick={() => {
                  setSelectedCollection(col);
                  loadHadith(col.key, 1);
                }}
                className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 text-left hover:shadow-lg hover:border-gau-msa-primary transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 group-hover:text-gau-msa-primary text-sm md:text-base">
                      {col.name}
                    </h3>
                    <p
                      className="text-base md:text-lg text-gau-msa-primary mt-1"
                      dir="rtl"
                      style={{ fontFamily: '"Amiri", serif' }}
                    >
                      {col.arabic_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] md:text-xs text-gray-500">
                      <span className="font-medium">{col.author}</span>
                      <span className="text-gray-300">•</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        {col.reliability}
                      </span>
                    </div>
                    <p className="text-[11px] md:text-xs text-gray-400 mt-1">
                      {col.total_hadiths.toLocaleString()} hadiths
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gau-msa-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==================== SINGLE HADITH VIEWER ====================
  if (viewMode === 'hadith' && currentHadith) {
    return (
      <div className="space-y-4 px-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
          <button
            onClick={() => setViewMode('collections')}
            className="flex items-center space-x-2 text-gau-msa-primary hover:text-gau-msa-secondary text-sm font-medium mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Collections</span>
          </button>

          <h2 className="font-bold text-lg md:text-xl text-gray-800">
            {currentHadith.collection_name}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Hadith #{currentHadith.hadithnumber}
          </p>

          {/* Search within collection */}
          <form onSubmit={handleSearch} className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search in ${currentHadith.collection_name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-gau-msa-primary text-white px-4 rounded-lg text-sm font-medium hover:bg-gau-msa-secondary"
            >
              Search
            </button>
          </form>
        </div>

        {/* Hadith Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary text-white px-4 py-2 flex items-center justify-between">
            <p className="text-xs md:text-sm font-medium">
              📖 {currentHadith.collection_name}
            </p>
            {currentHadith.grade && (
              <span className="text-[10px] md:text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {currentHadith.grade}
              </span>
            )}
          </div>

          <div className="p-4 md:p-6 space-y-4">
            {/* Arabic */}
            <div className="bg-gradient-to-br from-gau-msa-primary/5 to-gau-msa-secondary/5 rounded-xl p-4 md:p-6">
              <p
                className="text-lg md:text-2xl text-gau-msa-primary text-right leading-[2.2]"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Scheherazade New", serif' }}
              >
                {currentHadith.arabic}
              </p>
            </div>

            {/* English */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-3 md:p-4">
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                {currentHadith.english}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => copyHadith(currentHadith)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs md:text-sm text-gray-700 transition-colors"
              >
                {copiedId === currentHadith.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={() => shareHadith(currentHadith)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs md:text-sm text-gray-700 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>
              <button
                onClick={loadRandomHadith}
                className="flex items-center space-x-1.5 px-3 py-2 bg-gau-msa-primary/10 text-gau-msa-primary hover:bg-gau-msa-primary/20 rounded-lg text-xs md:text-sm transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Random</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex items-center justify-between">
          <button
            onClick={() => loadHadith(currentHadith.collection, currentHadith.hadithnumber - 1)}
            disabled={currentHadith.hadithnumber <= 1 || loading}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          <span className="text-xs md:text-sm text-gray-500">
            #{currentHadith.hadithnumber}
          </span>
          <button
            onClick={() => loadHadith(currentHadith.collection, currentHadith.hadithnumber + 1)}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==================== SEARCH RESULTS ====================
  if (viewMode === 'search') {
    return (
      <div className="space-y-4 px-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
          <button
            onClick={() => {
              setViewMode('collections');
              setSearchResults([]);
              setSearchTerm('');
            }}
            className="flex items-center space-x-2 text-gau-msa-primary hover:text-gau-msa-secondary text-sm font-medium mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Collections</span>
          </button>

          <h2 className="font-bold text-lg md:text-xl text-gray-800">
            Search Results
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            "{searchTerm}" — {searchResults.length} results
          </p>
        </div>

        {searchResults.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">No hadiths found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {searchResults.map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  setCurrentHadith(h);
                  setSelectedCollection(
                    collections.find((c) => c.key === h.collection) || null
                  );
                  setViewMode('hadith');
                }}
                className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-md hover:border-gau-msa-primary text-left transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] md:text-xs font-semibold text-gau-msa-primary bg-gau-msa-primary/10 px-2 py-1 rounded-full">
                    {h.collection_name} #{h.hadithnumber}
                  </span>
                  {h.grade && (
                    <span className="text-[10px] md:text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      {h.grade}
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-800 leading-relaxed line-clamp-3">
                  {h.english}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default HadithCollections;