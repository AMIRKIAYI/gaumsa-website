import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import QuranReader from './components/quran/QuranReader';
import SurahList from './components/quran/SurahList';
import ChatRoom from './components/chat/ChatRoom';
import AIChatBot from './components/ai/AIChatBot';
import PrayerTimes from './components/prayer/PrayerTimes';
import Activities from './components/activities/Activities';
import Leadership from './components/leadership/Leadership';
import ProfileLayout from './components/profile/ProfileLayout';
import Settings from './components/profile/Settings';
import RegistrarDashboard from './components/registrar/RegistrarDashboard';
import PartnerLogo from './components/home/PartnerLogo';
import AlumniCard from './components/home/AlumniCard';
import { partners, alumni } from './data/partners';
import { 
  User, Calendar, Users, Target, Eye, Heart, Handshake, 
  TrendingUp, ArrowRight, CheckCircle, Award,
  BookOpen, Mic, Globe, Sparkles
} from 'lucide-react';
import mosqueBg from './assets/images/mosque-bg3.png';
import gaumsaLogo from './assets/images/gaumsa-logo.png';
import RamadanPayment from './components/ramadan/RamadanPayment';
import RamadanPayments from './components/admin/RamadanPayments';

// ==================== ROUTE GUARDS ====================

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isInitialized } = useAuth();
  
  console.log('🛡️ ProtectedRoute — initialized:', isInitialized, '| user:', user?.email, '| token:', !!token);
  
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gau-msa-primary"></div>
      </div>
    );
  }
  
  if (!user || !token) {
    console.log('❌ ProtectedRoute: no user/token → /login');
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const RegistrarRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isInitialized } = useAuth();
  
  console.log('🛡️ RegistrarRoute — initialized:', isInitialized, '| user:', user?.email, '| role:', user?.role);
  
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gau-msa-primary"></div>
      </div>
    );
  }
  
  if (!user || !token) {
    console.log('❌ RegistrarRoute: no user/token → /login');
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin' && user.role !== 'registrar') {
    console.log('❌ RegistrarRoute: wrong role → /');
    return <Navigate to="/" replace />;
  }
  console.log('✅ RegistrarRoute: access granted');
  return <>{children}</>;
};

// ==================== LAYOUT WRAPPER ====================

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

// ==================== QURAN WRAPPER PAGES ====================

const QuranPage = () => {
  const navigate = useNavigate();
  return (
    <AuthenticatedLayout>
      <div className="pt-4 container-custom py-8">
        <SurahList
          onSelectSurah={(surahNumber, ayahNumber) => {
            const hash = ayahNumber ? `#ayah-${ayahNumber}` : '';
            navigate(`/quran/${surahNumber}${hash}`);
          }}
        />
      </div>
    </AuthenticatedLayout>
  );
};

const QuranReaderPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const surahNumber = parseInt(params.surahNumber || '1');
  
  const [hash, setHash] = React.useState(window.location.hash);
  
  React.useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  return (
    <AuthenticatedLayout>
      <div className="pt-4 container-custom py-8">
        <QuranReader 
          key={`${surahNumber}-${hash}`}
          surahNumber={surahNumber}
          onBack={() => navigate('/quran')}
        />
      </div>
    </AuthenticatedLayout>
  );
};

// ==================== HOME COMPONENT ====================

const Home = () => {
  const navigate = useNavigate();
  const handleNavigation = (path: string) => navigate(path);

  const missionVisionPromise = [
    {
      icon: Target,
      title: 'Our Mission',
      color: 'from-gau-msa-primary to-gau-msa-secondary',
      text: 'To unite Muslim students at Garissa University in faith, knowledge, and service, fostering an environment where Islamic values guide academic excellence and community development.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      color: 'from-gau-msa-secondary to-gau-msa-accent',
      text: 'To be the leading Muslim student association in Kenya, nurturing confident leaders who embody Islamic principles and contribute meaningfully to society and the Ummah.',
    },
    {
      icon: Heart,
      title: 'Our Promise',
      color: 'from-gau-msa-gold to-gau-msa-secondary',
      text: 'We promise to serve with sincerity, lead with humility, and provide a supportive community where every Muslim student feels welcomed, valued, and empowered to grow.',
    },
  ];

  const impactStats = [
    { icon: Users, value: '500+', label: 'Active Members' },
    { icon: BookOpen, value: '150+', label: 'Quran Study Sessions' },
    { icon: Award, value: '50+', label: 'Leaders Trained' },
    { icon: Globe, value: '20+', label: 'Community Projects' },
    { icon: Mic, value: '100+', label: 'Da\'awa Activities' },
    { icon: Heart, value: '1000+', label: 'Lives Touched' },
  ];

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center relative overflow-hidden">
        {/* Responsive background image — no aggressive scale on mobile */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-zoom"
          style={{ 
            backgroundImage: `url(${mosqueBg})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center center',
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gau-msa-primary/30 to-gau-msa-secondary/30" />
        
        {/* Content */}
        <div className="container-custom text-white py-16 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4 md:mb-0">
              <img 
                src={gaumsaLogo} 
                alt="GAUMSA Logo" 
                className="h-16 md:h-20 w-auto object-contain" 
              />
            </div>
            <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 font-arabic">
              بسم الله الرحمن الرحيم
            </h1>
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">GAUMSA</h2>
            <p className="text-base md:text-2xl mb-4 md:mb-8 text-gray-200">
              Garissa University Muslim Student Association
            </p>
            <p className="text-sm md:text-lg mb-8 md:mb-10 text-gray-300 max-w-2xl mx-auto px-2">
              Uniting Muslim students in faith, knowledge, and community service with modern technology and Islamic values
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <button 
                onClick={() => handleNavigation('/profile/dashboard')} 
                className="bg-gau-msa-gold text-white px-5 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 group text-sm md:text-base"
              >
                <User className="h-4 md:h-5 w-4 md:w-5 group-hover:rotate-12 transition-transform" />
                <span>My Profile</span>
              </button>
              <button 
                onClick={() => handleNavigation('/activities')} 
                className="bg-white text-gau-msa-primary px-5 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2 group text-sm md:text-base"
              >
                <Calendar className="h-4 md:h-5 w-4 md:w-5 group-hover:rotate-12 transition-transform" />
                <span>View Activities</span>
              </button>
              <button 
                onClick={() => handleNavigation('/leadership')} 
                className="bg-transparent border-2 border-white text-white px-5 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-white hover:text-gau-msa-primary hover:scale-105 transition-all duration-300 flex items-center space-x-2 group text-sm md:text-base"
              >
                <Users className="h-4 md:h-5 w-4 md:w-5 group-hover:rotate-12 transition-transform" />
                <span>Meet Our Team</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MISSION VISION PROMISE ==================== */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center space-x-2 bg-gau-msa-primary/10 text-gau-msa-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
              <Sparkles className="h-3 md:h-4 w-3 md:w-4" />
              <span>What Drives Us</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gau-msa-primary">Our Foundation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {missionVisionPromise.map((item, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-5 md:p-8">
                  <div className={`w-12 md:w-16 h-12 md:h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 md:h-8 w-6 md:w-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gau-msa-primary mb-2 md:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PARTNERS ==================== */}
      <section className="py-12 md:py-20 bg-white overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center space-x-2 bg-gau-msa-gold/20 text-gau-msa-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
              <Handshake className="h-3 md:h-4 w-3 md:w-4" />
              <span>Our Partners</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gau-msa-primary">Working Together</h2>
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee">
              {[...partners, ...partners].map((partner, index) => (
                <PartnerLogo key={`${partner.id}-${index}`} partner={partner} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ALUMNI ==================== */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center space-x-2 bg-gau-msa-primary/10 text-gau-msa-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
              <Award className="h-3 md:h-4 w-3 md:w-4" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gau-msa-primary">Our Alumni, Our Pride</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {alumni.map((story) => (
              <AlumniCard key={story.id} alumni={story} />
            ))}
          </div>
          <div className="text-center mt-8 md:mt-10">
            <button 
              onClick={() => handleNavigation('/leadership')} 
              className="inline-flex items-center space-x-2 bg-gau-msa-primary text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-gau-msa-secondary transition-all group text-sm md:text-base"
            >
              <span>Meet Our Current Leaders</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== IMPACT ==================== */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gau-msa-primary to-gau-msa-secondary text-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur text-gau-msa-gold px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
              <TrendingUp className="h-3 md:h-4 w-3 md:w-4" />
              <span>Our Impact</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold">Making a Difference</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
            {impactStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-6 text-center hover:bg-white/20 transition-all hover:scale-105 border border-white/10"
              >
                <div className="w-9 md:w-12 h-9 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-white/20 flex items-center justify-center">
                  <stat.icon className="h-4 md:h-6 w-4 md:w-6 text-gau-msa-gold" />
                </div>
                <div className="text-xl md:text-4xl font-bold text-gau-msa-gold">{stat.value}</div>
                <div className="text-[10px] md:text-sm text-gray-200 mt-0.5 md:mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 md:mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-8 border border-white/20 text-center">
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Be Part of Our Story</h3>
            <p className="text-sm md:text-base text-gray-200 mb-4 md:mb-6 max-w-2xl mx-auto">
              Join a community of believers who are committed to excellence in faith, knowledge, and service.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <button 
                onClick={() => handleNavigation('/register')} 
                className="bg-gau-msa-gold text-gau-msa-primary px-5 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg text-sm md:text-base"
              >
                <CheckCircle className="h-4 md:h-5 w-4 md:w-5" />
                <span>Join GAUMSA Today</span>
              </button>
              <button 
                onClick={() => handleNavigation('/activities')} 
                className="bg-white text-gau-msa-primary px-5 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center space-x-2 text-sm md:text-base"
              >
                <Calendar className="h-4 md:h-5 w-4 md:w-5" />
                <span>Explore Activities</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROGRAMS ==================== */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-gau-msa-primary text-center mb-8 md:mb-12">
            Our Programs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">🤝</div>
              <h3 className="font-bold text-gau-msa-primary text-sm md:text-base">Mentorship</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Guide new students</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">🕌</div>
              <h3 className="font-bold text-gau-msa-primary text-sm md:text-base">Da'awa</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Share Islamic knowledge</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">📚</div>
              <h3 className="font-bold text-gau-msa-primary text-sm md:text-base">Education</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Islamic studies</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">🤲</div>
              <h3 className="font-bold text-gau-msa-primary text-sm md:text-base">Community</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Build brotherhood</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// ==================== APP CONTENT ====================

function AppContent() {
  const { user, isInitialized } = useAuth();

  console.log('📍 AppContent — initialized:', isInitialized, '| path:', window.location.pathname);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gau-msa-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

      {/* Authenticated routes */}
      <Route path="/" element={<AuthenticatedLayout><Home /></AuthenticatedLayout>} />
      
      <Route path="/profile" element={<AuthenticatedLayout><ProfileLayout /></AuthenticatedLayout>}>
        <Route index element={<Navigate to="/profile/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chat" element={<ChatRoom />} />
        <Route path="ai" element={<AIChatBot />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/ramadan" element={<AuthenticatedLayout><RamadanPayment /></AuthenticatedLayout>} />
      
      <Route path="/registrar" element={
        <RegistrarRoute>
          <Layout>
            <div className="pt-4 container-custom py-8">
              <RegistrarDashboard />
            </div>
          </Layout>
        </RegistrarRoute>
      } />

      <Route path="/admin/ramadan" element={
        <RegistrarRoute>
          <Layout>
            <div className="pt-4 container-custom py-8">
              <RamadanPayments />
            </div>
          </Layout>
        </RegistrarRoute>
      } />

      <Route path="/activities" element={<AuthenticatedLayout><Activities /></AuthenticatedLayout>} />
      <Route path="/leadership" element={<AuthenticatedLayout><Leadership /></AuthenticatedLayout>} />
      <Route path="/prayer" element={<AuthenticatedLayout><PrayerTimes /></AuthenticatedLayout>} />

      <Route path="/quran" element={<QuranPage />} />
      <Route path="/quran/:surahNumber" element={<QuranReaderPage />} />

      {/* Redirects */}
      <Route path="/dashboard" element={<Navigate to="/profile/dashboard" replace />} />
      <Route path="/chat" element={<Navigate to="/profile/chat" replace />} />
      <Route path="/ai" element={<Navigate to="/profile/ai" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}

// ==================== APP ROOT ====================

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;