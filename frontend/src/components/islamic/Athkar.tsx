import React, { useState, useEffect } from 'react';
import {
  Moon,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';
import { athkarCategories } from '../../data/athkar';
import PageHeader from '../ui/PageHeader';


const Athkar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    athkarCategories[0].id
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const category = athkarCategories.find((c) => c.id === selectedCategory)!;
  const currentAthkar = category.athkar[currentIndex];
  const progress = ((currentIndex + 1) / category.athkar.length) * 100;

  useEffect(() => {
    setCount(0);
  }, [currentIndex, selectedCategory]);

  const handleTap = () => {
    if (completed.has(currentAthkar.id)) return;

    const newCount = count + 1;
    if (newCount >= currentAthkar.repeat) {
      const newCompleted = new Set(completed);
      newCompleted.add(currentAthkar.id);
      setCompleted(newCompleted);

      if (currentIndex < category.athkar.length - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 400);
      }
    } else {
      setCount(newCount);
    }
  };

  const goNext = () => {
    if (currentIndex < category.athkar.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const reset = () => {
    setCurrentIndex(0);
    setCount(0);
    setCompleted(new Set());
  };

  const completedInCategory = category.athkar.filter((a) =>
    completed.has(a.id)
  ).length;
  const allDone = completedInCategory === category.athkar.length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Athkar & Duas"
        subtitle="Daily remembrance of Allah"
      />

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
        {athkarCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentIndex(0);
            }}
            className={`flex-shrink-0 flex items-center space-x-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-gau-msa-primary text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gau-msa-primary'
            }`}
          >
            <span className="text-base md:text-lg">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Progress + Reset */}
      <div className="bg-white rounded-2xl p-3 md:p-4 border border-gray-100 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm font-medium text-gray-700">
              Progress: {currentIndex + 1} of {category.athkar.length}
            </p>
            <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={reset}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 active:scale-95 transition-all flex-shrink-0"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Current Athkar Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary text-white px-4 py-2 flex items-center justify-between">
          <p className="text-xs md:text-sm font-medium">
            {category.icon} {category.label}
          </p>
          <p className="text-[10px] md:text-xs text-gau-msa-gold">
            {currentIndex + 1} / {category.athkar.length}
          </p>
        </div>

        <div className="p-4 md:p-8">
          <h3 className="text-center text-sm md:text-base font-semibold text-gau-msa-primary mb-4 md:mb-6">
            {currentAthkar.text}
          </h3>

          <div className="bg-gradient-to-br from-gau-msa-primary/5 to-gau-msa-secondary/5 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
            <p
              className="text-xl md:text-3xl text-gau-msa-primary text-center leading-[2.2]"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Scheherazade New", serif' }}
            >
              {currentAthkar.arabic}
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 md:p-4 mb-4 md:mb-6 border-l-4 border-blue-500">
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed italic">
              "{currentAthkar.translation}"
            </p>
          </div>

          <p className="text-center text-[11px] md:text-xs text-gray-500 mb-4 md:mb-6">
            📖 {currentAthkar.reference}
          </p>

          <button
            onClick={handleTap}
            disabled={completed.has(currentAthkar.id)}
            className={`w-full py-6 md:py-8 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg active:scale-95 disabled:cursor-not-allowed ${
              completed.has(currentAthkar.id)
                ? 'bg-green-500'
                : 'bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary hover:opacity-90'
            }`}
          >
            {completed.has(currentAthkar.id) ? (
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-8 w-8 md:h-10 md:w-10" />
                <span className="text-xl md:text-2xl">Completed</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold">{count}</div>
                <div className="text-sm md:text-base font-normal opacity-90">
                  Tap to count • Target: {currentAthkar.repeat}
                </div>
              </div>
            )}
          </button>
        </div>

        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs md:text-sm text-gray-500">
            {completedInCategory} / {category.athkar.length} done
          </span>

          <button
            onClick={goNext}
            disabled={currentIndex === category.athkar.length - 1}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Completion */}
      {allDone && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center shadow-lg">
          <Sparkles className="h-12 w-12 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-1">MashaAllah!</h3>
          <p className="text-sm text-green-100">
            You've completed all {category.label.toLowerCase()} athkar
          </p>
        </div>
      )}
    </div>
  );
};

export default Athkar;