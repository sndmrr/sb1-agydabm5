import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Sprout, Leaf, Users, ClipboardList, FileText, UserPlus, DollarSign, Zap, Settings } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import AttendanceGroup from './components/AttendanceGroup';
import AdminSettings from './components/AdminSettings';
import { getAllAppSettings, getAllButtonSettings } from './lib/supabase';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'employee-attendance' | 'admin-settings'>('home');
  const [photos, setPhotos] = useState({
    header: 'https://i.postimg.cc/ZnWHPbw9/T4-T-Logo-Baru-2-1.jpg',
    roster: 'https://via.placeholder.com/600x300/e5f3ff/1e40af?text=Jadwal+Roster',
    payment: 'https://via.placeholder.com/600x300/f0fdf4/16a34a?text=Info+Pembayaran'
  });
  const [buttonSettings, setButtonSettings] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load photos from Supabase
        const settings = await getAllAppSettings();
        setPhotos({
          header: settings.header_photo || 'https://i.postimg.cc/ZnWHPbw9/T4-T-Logo-Baru-2-1.jpg',
          roster: settings.roster_photo || 'https://via.placeholder.com/600x300/e5f3ff/1e40af?text=Jadwal+Roster',
          payment: settings.payment_photo || 'https://via.placeholder.com/600x300/f0fdf4/16a34a?text=Info+Pembayaran'
        });

        // Load button settings from Supabase
        const buttons = await getAllButtonSettings();
        const buttonMap: { [key: string]: boolean } = {};
        buttons.forEach(btn => {
          buttonMap[btn.button_key] = btn.is_enabled;
        });
        setButtonSettings(buttonMap);
      } catch (error) {
        console.error('Error loading app settings:', error);
      }

      // Show loading screen for 3 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (currentView === 'home') {
      const reloadButtonSettings = async () => {
        try {
          const buttons = await getAllButtonSettings();
          const buttonMap: { [key: string]: boolean } = {};
          buttons.forEach(btn => {
            buttonMap[btn.button_key] = btn.is_enabled;
          });
          setButtonSettings(buttonMap);
        } catch (error) {
          console.error('Error reloading button settings:', error);
        }
      };

      reloadButtonSettings();
    }
  }, [currentView]);

  const handlePhotoUpdate = (type: 'header' | 'roster' | 'payment', photoUrl: string) => {
    setPhotos(prev => ({
      ...prev,
      [type]: photoUrl
    }));
  };

  // Show Employee attendance group if requested
  if (currentView === 'employee-attendance') {
    return (
      <AttendanceGroup 
        type="employee"
        onBack={() => setCurrentView('home')} 
      />
    );
  }

  // Show admin settings if requested
  if (currentView === 'admin-settings') {
    return (
      <AdminSettings
        onBack={() => setCurrentView('home')}
        onPhotoUpdate={handlePhotoUpdate}
      />
    );
  }

  const buttonData = [
    {
      key: "nms_app",
      title: "🌱 Aplikasi NMS",
      url: "https://nursery.trees4trees.org/",
      icon: Sprout,
      gradient: "from-red-500 via-red-600 to-red-700",
      hoverGradient: "from-red-600 via-red-700 to-red-800",
      iconGradient: "from-red-500 to-red-700",
      description: "Sistem Nursery Management"
    },
    {
      key: "tkh_attendance",
      title: "📋 Absensi Tenaga Kerja",
      url: "https://absentkhcitanduy.lovable.app/",
      icon: ClipboardList,
      gradient: "from-yellow-500 via-yellow-600 to-orange-600",
      hoverGradient: "from-yellow-600 via-yellow-700 to-orange-700",
      iconGradient: "from-yellow-500 to-orange-600",
      description: "Absensi & Rekap TKH"
    },
    {
      key: "employee_attendance",
      title: "📝 Absensi Karyawan",
      onClick: () => setCurrentView('employee-attendance'),
      icon: FileText,
      gradient: "from-green-500 via-emerald-600 to-teal-700",
      hoverGradient: "from-green-600 via-emerald-700 to-teal-800",
      iconGradient: "from-green-500 to-teal-700",
      description: "Absensi, Jurnal & Roster"
    },
    {
      key: "ff_registration",
      title: "👥 Daftar FF",
      url: "https://trees4trees-my.sharepoint.com/:x:/g/personal/rijal_ramdani_trees4trees_org/IQA3mh8I9faXToO1b0lNDZcWAfin4uheEB2uJsiv9diXqYw?rtime=i0ohY4Uh3kg",
      icon: UserPlus,
      gradient: "from-blue-500 via-indigo-600 to-purple-700",
      hoverGradient: "from-blue-600 via-indigo-700 to-purple-800",
      iconGradient: "from-blue-500 to-purple-700",
      description: "Field Facilitator Management"
    },
    {
      key: "payment_info",
      title: "💰 Iuran dan Rincian",
      url: "https://docs.google.com/spreadsheets/d/1VljjoL6ie4nay7o6loln9qr1GnYhJR8hVIUha8CPLbw/edit?usp=sharing",
      icon: DollarSign,
      gradient: "from-pink-500 via-rose-600 to-red-600",
      hoverGradient: "from-pink-600 via-rose-700 to-red-700",
      iconGradient: "from-pink-500 to-red-600",
      description: "Informasi Keuangan"
    }
  ];

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      
      <div className={`min-h-screen bg-white relative overflow-hidden transition-all duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Modern Background with Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(5,150,105,0.05),transparent_50%)]"></div>
        </div>

        {/* Floating Plant Elements */}
        {isLoading && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-leaf"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${8 + Math.random() * 4}s`
                }}
              >
                <Leaf className="h-6 w-6 text-green-300 opacity-30" />
              </div>
            ))}
          </div>
        )}

        {/* Admin Settings Button */}
        <button
          onClick={() => setCurrentView('admin-settings')}
          className="fixed top-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Admin Settings"
        >
          <Settings className="h-5 w-5" />
        </button>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-60"></div>
              <img 
                src={photos.header}
                alt="Yayasan Bumi Hijau Lestari Logo"
                className="relative h-24 w-auto md:h-28 object-contain rounded-2xl shadow-2xl border-4 border-white backdrop-blur-sm transform group-hover:scale-110 transition-all duration-700"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = 'https://i.postimg.cc/ZnWHPbw9/T4-T-Logo-Baru-2-1.jpg';
                }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent mb-6 leading-tight">
              YAYASAN BUMI HIJAU LESTARI
            </h1>
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-100 to-emerald-100 blur-xl rounded-3xl opacity-70"></div>
              <h2 className="relative text-xl md:text-2xl font-bold text-green-800 px-8 py-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border-2 border-green-200">
                🌿 Site Citanduy 🌿
              </h2>
            </div>
          </div>

          {/* Button Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 mb-12 max-w-7xl mx-auto">
            {buttonData.filter(btn => buttonSettings[btn.key] !== false).map((button, index) => (
              button.onClick ? (
                <button
                  key={index}
                  onClick={button.onClick}
                  className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-white p-3 md:p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${button.hoverGradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl md:rounded-3xl`}></div>
                  
                  {/* Animated Background Elements */}
                  <div className={`absolute -top-2 md:-top-4 -right-2 md:-right-4 w-12 md:w-20 h-12 md:h-20 bg-gradient-to-br ${button.gradient} rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-150`}></div>
                  <div className={`absolute -bottom-1 md:-bottom-2 -left-1 md:-left-2 w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br ${button.gradient} rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-125`}></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-2 md:space-y-4">
                    <div className={`w-10 md:w-16 h-10 md:h-16 bg-gradient-to-br ${button.gradient} opacity-10 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <button.icon className={`w-5 md:w-8 h-5 md:h-8 bg-gradient-to-br ${button.iconGradient} bg-clip-text text-transparent group-hover:text-white transition-all duration-500`} />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-lg font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-1 md:mb-2">
                        {button.title.replace(/^[^\s]+\s/, '')}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-500 mb-2 md:mb-3">
                        {button.description}
                      </p>
                      <div className={`flex items-center justify-center space-x-2 bg-gradient-to-r ${button.iconGradient} bg-clip-text text-transparent group-hover:text-white transition-all duration-500`}>
                        <Zap className="w-3 md:w-4 h-3 md:h-4" />
                        <span className="text-xs md:text-xs font-medium">Akses</span>
                      </div>
                    </div>
                  </div>
                </button>
              ) : (
                <a
                  key={index}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-white p-3 md:p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${button.hoverGradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl md:rounded-3xl`}></div>
                  
                  {/* Animated Background Elements */}
                  <div className={`absolute -top-2 md:-top-4 -right-2 md:-right-4 w-12 md:w-20 h-12 md:h-20 bg-gradient-to-br ${button.gradient} rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-150`}></div>
                  <div className={`absolute -bottom-1 md:-bottom-2 -left-1 md:-left-2 w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br ${button.gradient} rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-125`}></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-2 md:space-y-4">
                    <div className={`w-10 md:w-16 h-10 md:h-16 bg-gradient-to-br ${button.gradient} opacity-10 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <button.icon className={`w-5 md:w-8 h-5 md:h-8 bg-gradient-to-br ${button.iconGradient} bg-clip-text text-transparent group-hover:text-white transition-all duration-500`} />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-lg font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-1 md:mb-2">
                        {button.title.replace(/^[^\s]+\s/, '')}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-500 mb-2 md:mb-3">
                        {button.description}
                      </p>
                      <div className={`flex items-center justify-center space-x-2 bg-gradient-to-r ${button.iconGradient} bg-clip-text text-transparent group-hover:text-white transition-all duration-500`}>
                        <ExternalLink className="w-3 md:w-4 h-3 md:h-4" />
                        <span className="text-xs md:text-xs font-medium">Buka</span>
                      </div>
                    </div>
                  </div>
                </a>
              )
            ))}
          </div>

          {/* Roster Schedule Section */}
          <div className="text-center mb-8">
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-blue-800">📅 Lihat Jadwal Roster</h3>
            </div>
            
            <div className="relative group max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-60"></div>
              <img 
                src={photos.roster}
                alt="Jadwal Roster"
                className="relative w-full h-48 md:h-64 object-contain bg-white rounded-2xl shadow-2xl border-4 border-white backdrop-blur-sm transform group-hover:scale-105 transition-all duration-700"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x300/e5f3ff/1e40af?text=Jadwal+Roster';
                }}
              />
            </div>
          </div>

          {/* Payment Info Section */}
          <div className="text-center mb-12">
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 mb-6">
              <h3 className="text-xl font-bold text-green-800">💳 Untuk Iuran dan Lainnya bisa Transfer ke Bank</h3>
            </div>
            
            <div className="relative group max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-60"></div>
              <img 
                src={photos.payment}
                alt="Info Pembayaran"
                className="relative w-full h-48 md:h-64 object-contain bg-white rounded-2xl shadow-2xl border-4 border-white backdrop-blur-sm transform group-hover:scale-105 transition-all duration-700"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x300/f0fdf4/16a34a?text=Info+Pembayaran';
                }}
              />
            </div>
          </div>

          {/* Location Info */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-green-200">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Citanduy, Tasikmalaya, Jawa Barat</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 text-center py-8">
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200">
            <p className="text-green-800 font-medium">
              Aplikasi Powered by M Rijal Ramdani
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;