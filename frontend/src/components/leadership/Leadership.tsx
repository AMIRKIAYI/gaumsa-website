import React, { useState } from 'react';
import { 
  Mail, Phone, Quote, ChevronRight, ChevronDown, 
  Users, UserCog, FileText, Wallet, Calendar, 
  Mic, Megaphone, Briefcase, BookOpen, Star,
  User, UserPlus, UserCheck, UserMinus, Award,
  Building2, GraduationCap, MapPin
} from 'lucide-react';
import { leaders, leadershipPositions } from '../../data/leaders';
import type { Leader } from '../../types';

const Leadership: React.FC = () => {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Executive Committee']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getLeadersByCategory = (category: string) => {
    const positionList = leadershipPositions.find(p => p.category === category)?.positions || [];
    return leaders.filter(leader => positionList.includes(leader.position));
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Executive Committee': <UserCog className="h-5 w-5" />,
      'Secretariat': <FileText className="h-5 w-5" />,
      'Treasury': <Wallet className="h-5 w-5" />,
      'Organizing Committee': <Calendar className="h-5 w-5" />,
      'Religious Leadership': <Mic className="h-5 w-5" />,
      'Media & Communications': <Megaphone className="h-5 w-5" />
    };
    return icons[category] || <Users className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Executive Committee': 'bg-purple-600 text-white',
      'Secretariat': 'bg-blue-600 text-white',
      'Treasury': 'bg-green-600 text-white',
      'Organizing Committee': 'bg-orange-600 text-white',
      'Religious Leadership': 'bg-amber-600 text-white',
      'Media & Communications': 'bg-cyan-600 text-white'
    };
    return colors[category] || 'bg-gray-600 text-white';
  };

  const getLeaderInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gau-msa-primary via-gau-msa-secondary to-gau-msa-primary rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gau-msa-gold uppercase tracking-wider">Our Leadership</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">GAUMSA Leadership Team</h2>
            <p className="text-gau-msa-gold mt-1 text-lg opacity-90">The dedicated team serving our community with excellence</p>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex -space-x-2">
              {leaders.slice(0, 5).map((leader) => (
                <div
                  key={leader.id}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gau-msa-gold flex items-center justify-center text-xs font-bold text-gau-msa-primary"
                >
                  {getLeaderInitials(leader.name)}
                </div>
              ))}
            </div>
            <div className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm">
              +{leaders.length} Leaders
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Structure */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leadership List */}
        <div className="lg:col-span-2 space-y-4">
          {leadershipPositions.map((category) => {
            const categoryLeaders = getLeadersByCategory(category.category);
            const isExpanded = expandedCategories.includes(category.category);
            const colorClass = getCategoryColor(category.category);

            return (
              <div 
                key={category.category} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2.5 rounded-xl ${colorClass} shadow-md`}>
                      {getCategoryIcon(category.category)}
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-800 text-lg">{category.category}</span>
                      <span className="ml-3 text-sm text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {categoryLeaders.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400">
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gau-msa-primary transition-colors" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gau-msa-primary transition-colors" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50/50">
                    {categoryLeaders.map((leader) => (
                      <button
                        key={leader.id}
                        onClick={() => setSelectedLeader(leader)}
                        className={`group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-left border-2 ${
                          selectedLeader?.id === leader.id 
                            ? 'border-gau-msa-primary shadow-md' 
                            : 'border-transparent hover:border-gau-msa-primary/20'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={leader.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=1a472a&color=fff&size=128`}
                              alt={leader.name}
                              className="w-14 h-14 rounded-full object-cover ring-2 ring-gau-msa-primary/20 group-hover:ring-4 transition-all"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 text-sm truncate">
                              {leader.name}
                            </div>
                            <div className="text-xs text-gau-msa-primary font-medium">
                              {leader.position}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              {leader.department}
                            </div>
                          </div>
                          <ChevronRight className={`h-4 w-4 text-gray-400 transition-all ${selectedLeader?.id === leader.id ? 'text-gau-msa-primary' : 'group-hover:translate-x-1'}`} />
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24 border border-gray-100">
              {/* Profile Header */}
              <div className="relative bg-gradient-to-r from-gau-msa-primary/5 to-gau-msa-secondary/5 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      src={selectedLeader.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedLeader.name)}&background=1a472a&color=fff&size=128`}
                      alt={selectedLeader.name}
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-gau-msa-primary/20 shadow-xl"
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-3 border-white rounded-full"></div>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-800">{selectedLeader.name}</h3>
                  <p className="text-gau-msa-primary font-medium">{selectedLeader.position}</p>
                  <p className="text-sm text-gau-msa-gold">{selectedLeader.positionArabic}</p>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-white/80 backdrop-blur rounded-lg p-2 text-center">
                    <BookOpen className="h-4 w-4 text-gau-msa-primary mx-auto mb-1" />
                    <p className="text-xs text-gray-600 font-medium">{selectedLeader.department}</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-lg p-2 text-center">
                    <GraduationCap className="h-4 w-4 text-gau-msa-primary mx-auto mb-1" />
                    <p className="text-xs text-gray-600 font-medium">{selectedLeader.year}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                {selectedLeader.email && (
                  <div className="flex items-center space-x-3 p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Mail className="h-4 w-4 text-gau-msa-primary flex-shrink-0" />
                    <a href={`mailto:${selectedLeader.email}`} className="text-gray-700 hover:text-gau-msa-primary text-sm transition-colors truncate">
                      {selectedLeader.email}
                    </a>
                  </div>
                )}

                {selectedLeader.phone && (
                  <div className="flex items-center space-x-3 p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Phone className="h-4 w-4 text-gau-msa-primary flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{selectedLeader.phone}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedLeader.description}</p>
                </div>

                {selectedLeader.quote && (
                  <div className="mt-4 p-4 bg-gau-msa-primary/5 rounded-xl border-l-4 border-gau-msa-gold">
                    <Quote className="h-4 w-4 text-gau-msa-gold mb-2" />
                    <p className="text-sm text-gray-700 italic leading-relaxed">"{selectedLeader.quote}"</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Leadership Role</span>
                  <span className="text-xs font-medium text-gau-msa-primary px-3 py-1 bg-gau-msa-primary/10 rounded-full">
                    {selectedLeader.position}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-gray-300" />
              </div>
              <p className="text-gray-700 font-medium text-lg">Select a Leader</p>
              <p className="text-sm text-gray-400 mt-2">Click on any leadership role above to view details</p>
              <div className="mt-4 flex justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-gray-200"></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border border-gray-100">
          <div className="text-3xl font-bold text-gau-msa-primary">{leaders.length}</div>
          <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
            <Users className="h-3.5 w-3.5 mr-1.5 text-gau-msa-gold" />
            Total Leaders
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border border-gray-100">
          <div className="text-3xl font-bold text-gau-msa-primary">{leadershipPositions.length}</div>
          <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
            <Building2 className="h-3.5 w-3.5 mr-1.5 text-gau-msa-gold" />
            Departments
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border border-gray-100">
          <div className="text-3xl font-bold text-gau-msa-gold">
            {leaders.filter(l => l.position.includes('Vice') || l.position.includes('Assistant')).length}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
            <UserPlus className="h-3.5 w-3.5 mr-1.5 text-gau-msa-gold" />
            Vice/Assistant Roles
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border border-gray-100">
          <div className="text-3xl font-bold text-emerald-600">
            {leaders.filter(l => l.position.includes('Imam') || l.position.includes('Muadheen')).length}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
            <Award className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
            Religious Leaders
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-gray-400">
        <p>GAUMSA Leadership • Committed to serving the Muslim student community</p>
      </div>
    </div>
  );
};

export default Leadership;