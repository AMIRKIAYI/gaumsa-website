import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Check,
  Copy,
  Share2,
  List,
  X,
  VolumeX,
} from 'lucide-react';
import { nawawi40 } from '../../data/nawawi40';
import PageHeader from '../ui/PageHeader';

const Nawawi40: React.FC = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showList, setShowList] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentHadith = nawawi40.find((h) => h.id === selectedId) || nawawi40[0];
  const hasAudio = !!currentHadith.audioUrl;

  // Stop audio when hadith changes
  useEffect(() => {
    stopAudio();
  }, [selectedId]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (!hasAudio) return;

    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsLoading(true);
    const audio = new Audio(currentHadith.audioUrl);
    audioRef.current = audio;

    audio.play().catch((err) => {
      console.error('Audio playback failed:', err);
      setIsLoading(false);
      setIsPlaying(false);
    });

    audio.oncanplay = () => setIsLoading(false);
    audio.onended = () => {
      setIsPlaying(false);
      const nextHadith = nawawi40.find((h) => h.id === selectedId + 1);
      if (nextHadith && nextHadith.audioUrl) {
        setTimeout(() => setSelectedId(selectedId + 1), 500);
      }
    };
    audio.onerror = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    setIsPlaying(true);
  };

  const goNext = () => {
    if (selectedId < nawawi40.length) setSelectedId(selectedId + 1);
  };

  const goPrev = () => {
    if (selectedId > 1) setSelectedId(selectedId - 1);
  };

  const copyHadith = () => {
    navigator.clipboard.writeText(
      `${currentHadith.english}\n\n${currentHadith.arabic}\n\n— ${currentHadith.narrator}, ${currentHadith.source}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareHadith = () => {
    if (navigator.share) {
      navigator.share({
        title: `Nawawi Hadith #${currentHadith.id}`,
        text: `${currentHadith.english}\n\n— ${currentHadith.narrator}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nawawi's 40 Hadith"
        subtitle="Listen and reflect on timeless wisdom"
      />

      {/* Audio Player */}
      <div
        className={`rounded-2xl p-5 md:p-6 text-white shadow-lg overflow-hidden relative transition-colors ${
          hasAudio
            ? 'bg-gradient-to-r from-amber-500 to-amber-700'
            : 'bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-700'
        }`}
      >
        {/* Decorative */}
        <div className="absolute -top-6 -right-6 text-8xl font-arabic opacity-10 select-none pointer-events-none">
          ﷽
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-4">
          {/* Play Button */}
          <button
            onClick={toggleAudio}
            disabled={!hasAudio || isLoading}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-amber-600 flex items-center justify-center shadow-xl transition-all flex-shrink-0 ${
              hasAudio
                ? 'hover:scale-105 active:scale-95'
                : 'opacity-50 cursor-not-allowed dark:text-gray-500'
            }`}
            title={hasAudio ? 'Play audio' : 'Audio not available for this hadith'}
          >
            {isLoading ? (
              <Loader2 className="h-7 w-7 md:h-9 md:w-9 animate-spin" />
            ) : !hasAudio ? (
              <VolumeX className="h-7 w-7 md:h-9 md:w-9" />
            ) : isPlaying ? (
              <Pause className="h-7 w-7 md:h-9 md:w-9" />
            ) : (
              <Play className="h-7 w-7 md:h-9 md:w-9 ml-1" />
            )}
          </button>

          {/* Now Playing Info */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-amber-100 font-semibold">
              {!hasAudio
                ? 'Audio not available'
                : isPlaying
                ? 'Now Playing'
                : 'Ready to Play'}
            </p>
            <h3 className="text-lg md:text-2xl font-bold truncate">
              Hadith #{currentHadith.id}
            </h3>
            <p className="text-xs md:text-sm text-amber-100 truncate">
              {currentHadith.narrator} • {currentHadith.source}
            </p>
          </div>

          {/* Audio wave */}
          {isPlaying && (
            <div className="flex items-end space-x-1 h-8 flex-shrink-0">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-white/80 rounded-full animate-pulse"
                  style={{
                    height: `${[40, 80, 60, 90, 50][i]}%`,
                    animationDelay: `${i * 150}ms`,
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {!hasAudio && (
          <p className="relative text-center text-xs text-white/80 mt-3">
            Audio is not available for this hadith in the current collection.
          </p>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-4 border border-gray-100 dark:border-gray-700 transition-colors">
        <button
          onClick={() => setShowList(true)}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <List className="h-4 w-4" />
          <span>All Hadiths</span>
        </button>

        <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
          {selectedId} / {nawawi40.length}
        </span>

        <div className="flex space-x-1">
          <button
            onClick={goPrev}
            disabled={selectedId === 1}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            onClick={goNext}
            disabled={selectedId === nawawi40.length}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      {/* Current Hadith Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary text-white px-4 py-2 flex items-center justify-between">
          <p className="text-xs md:text-sm font-medium">
            📖 Hadith #{currentHadith.id}
          </p>
          <p className="text-[10px] md:text-xs text-gau-msa-gold">
            Nawawi's Collection
          </p>
        </div>

        <div className="p-4 md:p-8 space-y-4 md:space-y-6">
          {/* Arabic */}
          <div className="bg-gradient-to-br from-gau-msa-primary/5 to-gau-msa-secondary/5 dark:from-gau-msa-gold/10 dark:to-gau-msa-gold/5 rounded-xl p-4 md:p-6 transition-colors">
            <p
              className="text-xl md:text-3xl text-gau-msa-primary dark:text-gau-msa-gold text-right leading-[2.2]"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Scheherazade New", serif' }}
            >
              {currentHadith.arabic}
            </p>
          </div>

          {/* English */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-xl p-3 md:p-4 transition-colors">
            <p className="text-sm md:text-base text-gray-800 dark:text-gray-100 leading-relaxed">
              "{currentHadith.english}"
            </p>
          </div>

          {/* Attribution */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Narrated by {currentHadith.narrator}
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>{currentHadith.source}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyHadith}
              className="flex items-center space-x-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 rounded-lg text-xs md:text-sm text-gray-700 dark:text-gray-300 transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={shareHadith}
              className="flex items-center space-x-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 rounded-lg text-xs md:text-sm text-gray-700 dark:text-gray-300 transition-all"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hadith List Modal */}
      {showList && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowList(false)}
          ></div>
          <div className="relative ml-auto w-80 max-w-[85vw] h-full bg-white dark:bg-gray-800 overflow-y-auto shadow-2xl transition-colors">
            <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary text-white p-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold">All 40 Hadiths</h3>
              <button
                onClick={() => setShowList(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {nawawi40.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    setSelectedId(h.id);
                    setShowList(false);
                  }}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedId === h.id ? 'bg-gau-msa-primary/10 dark:bg-gau-msa-gold/10' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        selectedId === h.id
                          ? 'bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {h.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        Hadith #{h.id}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {h.narrator}
                      </p>
                    </div>
                    {h.audioUrl ? (
                      <Volume2 className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nawawi40;