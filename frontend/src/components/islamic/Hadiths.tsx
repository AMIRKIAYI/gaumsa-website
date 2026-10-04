import React, { useState } from 'react';
import { BookOpen, Search, Copy, Share2, Check, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hadiths, hadithCategories, type Hadith } from '../../data/hadiths';
import PageHeader from '../ui/PageHeader';


const Hadiths: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = hadiths.filter((h) => {
    const matchesCategory =
      selectedCategory === 'all' || h.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      h.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.narrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (h: Hadith) => {
    navigator.clipboard.writeText(
      `${h.text}\n\n${h.arabic || ''}\n\n— ${h.narrator}, ${h.source}`
    );
    setCopiedId(h.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Hadith Collection"
        subtitle="Sayings of Prophet Muhammad ﷺ"
      />

      {/* Browse All Collections button */}
      <button
        onClick={() => navigate('/hadiths/collections')}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-2xl p-4 md:p-5 flex items-center justify-between hover:shadow-lg active:scale-[0.98] transition-all group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm md:text-base">
              Browse All Collections
            </p>
            <p className="text-[11px] md:text-xs text-amber-100">
              36,000+ hadiths from 10 authentic collections
            </p>
          </div>
        </div>
        <span className="text-xl group-hover:translate-x-1 transition-transform">
          →
        </span>
      </button>
      <button
  onClick={() => navigate('/nawawi40')}
  className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center space-x-2"
>
  <Volume2 className="h-4 w-4" />
  <span>Listen to 40 Hadith</span>
</button>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search hadiths..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
          {hadithCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gau-msa-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hadith List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No hadiths found</p>
          </div>
        ) : (
          filtered.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gau-msa-primary bg-gau-msa-primary/10 px-2 py-1 rounded-full">
                  {hadithCategories.find((c) => c.id === h.category)?.label ||
                    h.category}
                </span>
                {h.grade && (
                  <span className="text-[10px] md:text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    {h.grade}
                  </span>
                )}
              </div>

              {h.arabic && (
                <p
                  className="text-lg md:text-2xl text-gau-msa-primary text-right leading-loose mb-3 md:mb-4"
                  dir="rtl"
                  style={{ fontFamily: '"Amiri", "Scheherazade New", serif' }}
                >
                  {h.arabic}
                </p>
              )}

              <p className="text-sm md:text-base text-gray-800 leading-relaxed mb-3 md:mb-4">
                "{h.text}"
              </p>

              <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span className="font-medium text-gray-700">
                  📖 {h.source}
                </span>
                <span className="text-gray-300">•</span>
                <span>{h.book}</span>
                <span className="text-gray-300">•</span>
                <span>Narrated by {h.narrator}</span>
              </div>

              <div className="flex items-center gap-2 mt-3 md:mt-4">
                <button
                  onClick={() => handleCopy(h)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700 transition-colors"
                >
                  {copiedId === h.id ? (
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
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Hadith',
                        text: `${h.text}\n\n— ${h.source}`,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied!');
                    }
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Hadiths;