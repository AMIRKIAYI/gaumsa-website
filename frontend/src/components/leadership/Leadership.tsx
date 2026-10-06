import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Quote,
  ChevronRight,
  ChevronDown,
  Users,
  UserCog,
  FileText,
  Wallet,
  Calendar,
  Mic,
  Megaphone,
  BookOpen,
  UserPlus,
  Award,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { leaders, leadershipPositions } from '../../data/leaders';
import type { Leader } from '../../types';
import PageHeader from '../ui/PageHeader';

const Leadership: React.FC = () => {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'Executive Committee',
  ]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getLeadersByCategory = (category: string) => {
    const positionList =
      leadershipPositions.find((p) => p.category === category)?.positions || [];
    return leaders.filter((leader) => positionList.includes(leader.position));
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Executive Committee': <UserCog className="h-4 w-4 md:h-5 md:w-5" />,
      Secretariat: <FileText className="h-4 w-4 md:h-5 md:w-5" />,
      Treasury: <Wallet className="h-4 w-4 md:h-5 md:w-5" />,
      'Organizing Committee': <Calendar className="h-4 w-4 md:h-5 md:w-5" />,
      'Religious Leadership': <Mic className="h-4 w-4 md:h-5 md:w-5" />,
      'Media & Communications': <Megaphone className="h-4 w-4 md:h-5 md:w-5" />,
    };
    return icons[category] || <Users className="h-4 w-4 md:h-5 md:w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Executive Committee': 'bg-purple-600 text-white',
      Secretariat: 'bg-blue-600 text-white',
      Treasury: 'bg-green-600 text-white',
      'Organizing Committee': 'bg-orange-600 text-white',
      'Religious Leadership': 'bg-amber-600 text-white',
      'Media & Communications': 'bg-cyan-600 text-white',
    };
    return colors[category] || 'bg-gray-600 text-white';
  };

  const getLeaderInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-4 md:space-y-8">
      <PageHeader
        title="Leadership"
        subtitle="Meet the dedicated team serving GAUMSA"
      />

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gau-msa-primary via-gau-msa-secondary to-gau-msa-primary rounded-2xl md:rounded-3xl p-4 md:p-8 text-white">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 md:space-x-3 mb-1 md:mb-2">
              <div className="p-1.5 md:p-2 bg-white/20 rounded-xl">
                <Users className="h-4 w-4 md:h-6 md:w-6" />
              </div>
              <span className="text-[10px] md:text-sm font-medium text-gau-msa-gold uppercase tracking-wider">
                Our Leadership
              </span>
            </div>
            <h2 className="text-lg md:text-3xl lg:text-4xl font-bold">
              GAUMSA Leadership Team
            </h2>
            <p className="text-gau-msa-gold mt-1 text-xs md:text-base opacity-90">
              The dedicated team serving our community with excellence
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex -space-x-2">
              {leaders.slice(0, 5).map((leader) => (
                <div
                  key={leader.id}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white bg-gau-msa-gold flex items-center justify-center text-[10px] md:text-xs font-bold text-gau-msa-primary"
                >
                  {getLeaderInitials(leader.name)}
                </div>
              ))}
            </div>
            <div className="ml-2 px-3 py-1 bg-white/20 rounded-full text-xs md:text-sm">
              +{leaders.length} Leaders
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Structure */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Leadership List */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          {leadershipPositions.map((category) => {
            const categoryLeaders = getLeadersByCategory(category.category);
            const isExpanded = expandedCategories.includes(category.category);
            const colorClass = getCategoryColor(category.category);

            return (
              <div
                key={category.category}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full px-3 md:px-6 py-3 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
                    <div className={`p-2 md:p-2.5 rounded-xl ${colorClass} shadow-md flex-shrink-0`}>
                      {getCategoryIcon(category.category)}
                    </div>
                    <div className="text-left min-w-0">
                      <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-lg block truncate">
                        {category.category}
                      </span>
                      <span className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
                        {categoryLeaders.length} member{categoryLeaders.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="hidden sm:inline text-xs md:text-sm text-gray-400 dark:text-gray-500">
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 p-2 md:p-4 bg-gray-50/50 dark:bg-gray-700/30 transition-colors">
                    {categoryLeaders.map((leader) => (
                      <button
                        key={leader.id}
                        onClick={() => setSelectedLeader(leader)}
                        className={`group p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all text-left border-2 ${
                          selectedLeader?.id === leader.id
                            ? 'border-gau-msa-primary dark:border-gau-msa-gold'
                            : 'border-transparent hover:border-gau-msa-primary/20 dark:hover:border-gau-msa-gold/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={
                                leader.image ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  leader.name
                                )}&background=1a472a&color=fff&size=128`
                              }
                              alt={leader.name}
                              className="w-11 h-11 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-gau-msa-primary/20 dark:ring-gau-msa-gold/30"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 md:w-5 md:h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 dark:text-gray-100 text-xs md:text-sm truncate">
                              {leader.name}
                            </div>
                            <div className="text-[11px] md:text-xs text-gau-msa-primary dark:text-gau-msa-gold font-medium truncate">
                              {leader.position}
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 truncate">
                              {leader.department}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Leader Details */}
        <div className="lg:col-span-1">
          {selectedLeader ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden lg:sticky lg:top-24 transition-colors">
              {/* Profile Header */}
              <div className="relative bg-gradient-to-r from-gau-msa-primary/5 to-gau-msa-secondary/5 dark:from-gau-msa-gold/10 dark:to-gau-msa-gold/5 p-4 md:p-6 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      src={
                        selectedLeader.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedLeader.name
                        )}&background=1a472a&color=fff&size=128`
                      }
                      alt={selectedLeader.name}
                      className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover ring-4 ring-gau-msa-primary/20 dark:ring-gau-msa-gold/30 shadow-xl"
                    />
                    <div className="absolute bottom-0 right-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 border-3 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <h3 className="mt-3 md:mt-4 text-base md:text-xl font-bold text-gray-800 dark:text-gray-100">
                    {selectedLeader.name}
                  </h3>
                  <p className="text-gau-msa-primary dark:text-gau-msa-gold font-medium text-sm md:text-base">
                    {selectedLeader.position}
                  </p>
                  <p className="text-xs md:text-sm text-gau-msa-gold">
                    {selectedLeader.positionArabic}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 md:mt-4">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg p-2 text-center transition-colors">
                    <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-primary dark:text-gau-msa-gold mx-auto mb-1" />
                    <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
                      {selectedLeader.department}
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg p-2 text-center transition-colors">
                    <GraduationCap className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-primary dark:text-gau-msa-gold mx-auto mb-1" />
                    <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
                      {selectedLeader.year}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                {selectedLeader.email && (
                  <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors">
                    <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-primary dark:text-gau-msa-gold flex-shrink-0" />
                    <a
                      href={`mailto:${selectedLeader.email}`}
                      className="text-gray-700 dark:text-gray-300 hover:text-gau-msa-primary dark:hover:text-gau-msa-gold text-xs md:text-sm transition-colors truncate"
                    >
                      {selectedLeader.email}
                    </a>
                  </div>
                )}

                {selectedLeader.phone && (
                  <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors">
                    <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-primary dark:text-gau-msa-gold flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm">
                      {selectedLeader.phone}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
                    {selectedLeader.description}
                  </p>
                </div>

                {selectedLeader.quote && (
                  <div className="p-3 md:p-4 bg-gau-msa-primary/5 dark:bg-gau-msa-gold/10 rounded-xl border-l-4 border-gau-msa-gold transition-colors">
                    <Quote className="h-3.5 w-3.5 md:h-4 md:w-4 text-gau-msa-gold mb-1.5" />
                    <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      "{selectedLeader.quote}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">
                    Leadership Role
                  </span>
                  <span className="text-[10px] md:text-xs font-medium text-gau-msa-primary dark:text-gau-msa-gold px-2.5 md:px-3 py-1 bg-gau-msa-primary/10 dark:bg-gau-msa-gold/20 rounded-full">
                    {selectedLeader.position}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 text-center transition-colors">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Users className="h-8 w-8 md:h-12 md:w-12 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-lg">
                Select a Leader
              </p>
              <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-2">
                Click on any leadership role to view details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-6 text-center transition-colors">
          <div className="text-xl md:text-3xl font-bold text-gau-msa-primary dark:text-gau-msa-gold">
            {leaders.length}
          </div>
          <div className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center mt-1">
            <Users className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-gau-msa-gold" />
            Total Leaders
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-6 text-center transition-colors">
          <div className="text-xl md:text-3xl font-bold text-gau-msa-primary dark:text-gau-msa-gold">
            {leadershipPositions.length}
          </div>
          <div className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center mt-1">
            <Building2 className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-gau-msa-gold" />
            Departments
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-6 text-center transition-colors">
          <div className="text-xl md:text-3xl font-bold text-gau-msa-gold">
            {
              leaders.filter(
                (l) =>
                  l.position.includes('Vice') ||
                  l.position.includes('Assistant')
              ).length
            }
          </div>
          <div className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center mt-1">
            <UserPlus className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-gau-msa-gold" />
            Vice/Assistant
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 md:p-6 text-center transition-colors">
          <div className="text-xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {
              leaders.filter(
                (l) =>
                  l.position.includes('Imam') || l.position.includes('Muadheen')
              ).length
            }
          </div>
          <div className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center mt-1">
            <Award className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-emerald-500" />
            Religious Leaders
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leadership;