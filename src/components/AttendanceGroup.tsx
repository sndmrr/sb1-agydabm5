import React from 'react';
import { ArrowLeft, Users, FileText, BarChart3, Calendar, ClipboardList, ExternalLink } from 'lucide-react';
import DivisionRecapSelection from './DivisionRecapSelection';
import DivisionSelection from './DivisionSelection';
import ConfirmationModal from './ConfirmationModal';

interface AttendanceGroupProps {
  type: 'tkh' | 'employee';
  onBack: () => void;
}

const AttendanceGroup: React.FC<AttendanceGroupProps> = ({ type, onBack }) => {
  const [showRecapDivision, setShowRecapDivision] = React.useState(false);
  const [showAbsenDivision, setShowAbsenDivision] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedUrl, setSelectedUrl] = React.useState<string>('');

  const handleRecapClick = () => {
    setShowRecapDivision(true);
  };

  const handleAbsenClick = () => {
    setShowAbsenDivision(true);
  };

  const handleEmployeeAbsenClick = () => {
    setSelectedUrl('https://forms.gle/8ayfhoum7rNCuQrT6');
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      window.open(selectedUrl, '_blank');
    }
    setShowModal(false);
    setSelectedUrl('');
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedUrl('');
  };

  // Show division selection for recap if requested
  if (showRecapDivision) {
    return (
      <DivisionRecapSelection 
        onBack={() => setShowRecapDivision(false)} 
      />
    );
  }

  // Show division selection for absen if requested
  if (showAbsenDivision) {
    return (
      <DivisionSelection 
        onBack={() => setShowAbsenDivision(false)} 
      />
    );
  }

  const tkhButtons = [
    {
      title: "📋 Absensi TKH",
      description: "Form absensi tenaga kerja harian",
      icon: ClipboardList,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      onClick: handleAbsenClick,
      available: true
    },
    {
      title: "📊 Rekap Absen TKH",
      description: "Lihat rekap absensi tenaga kerja harian",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      onClick: handleRecapClick,
      available: true
    }
  ];

  const employeeButtons = [
    {
      title: "📝 Absen Karyawan",
      description: "Form absensi karyawan",
      icon: FileText,
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
      onClick: handleEmployeeAbsenClick,
      available: true
    },
    {
      title: "📒 Rekap Jurnal Karyawan",
      description: "Lihat rekap jurnal karyawan",
      icon: BarChart3,
      color: "from-teal-500 to-teal-600",
      hoverColor: "hover:from-teal-600 hover:to-teal-700",
      onClick: () => window.open('https://docs.google.com/spreadsheets/d/1EwhrdEzVa1dKFKWOG787R1iDc9efPxR9c0Rtn-_lBJw/edit?usp=sharing', '_blank'),
      available: true
    },
    {
      title: "📆 Roster Kerja Karyawan",
      description: "Lihat roster kerja karyawan",
      icon: Calendar,
      color: "from-pink-500 to-pink-600",
      hoverColor: "hover:from-pink-600 hover:to-pink-700",
      onClick: () => window.open('https://docs.google.com/spreadsheets/d/1tyR7C7k0ot_X9AeY-0K5cLl7KNkzh6VE/edit?usp=sharing', '_blank'),
      available: true
    },
    {
      title: "📥 Download Jurnal",
      description: "Download jurnal karyawan",
      icon: FileText,
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
      onClick: () => window.open('https://docs.google.com/spreadsheets/d/1OYC7vPUvGdIAG3Qcec0sReYS3b_UvUU6f54LmXt4jZg/edit?usp=sharing', '_blank'),
      available: true
    }
  ];

  const buttons = type === 'tkh' ? tkhButtons : employeeButtons;
  const title = type === 'tkh' ? 'Absensi Tenaga Kerja Harian' : 'Absensi Karyawan';
  const subtitle = type === 'tkh' ? 'Persemaian Site Citanduy' : 'Sistem Absensi dan Manajemen Karyawan';

  return (
    <>
    <ConfirmationModal
      isOpen={showModal}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 mb-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-green-600" />
              </button>
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-green-800">{title}</h1>
                <p className="text-green-600">{subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 border border-green-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {type === 'tkh' ? 'Pilih Menu Absensi TKH' : 'Pilih Menu Absensi Karyawan'}
            </h2>
            <p className="text-green-600 text-lg">
              {type === 'tkh' 
                ? 'Akses form absensi dan rekap untuk tenaga kerja harian'
                : 'Akses form absensi, jurnal, dan roster kerja karyawan'
              }
            </p>
          </div>

          <div className={`grid grid-cols-1 ${buttons.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            {buttons.map((button) => {
              const IconComponent = button.icon;
              return (
                <button
                  key={button.title}
                  onClick={button.onClick}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${button.color} ${button.hoverColor} p-8 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1 border border-white/30 backdrop-blur-sm`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-white/20 rounded-full transform group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="h-12 w-12" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {button.title.replace(/^[^\s]+\s/, '')} {/* Remove emoji */}
                      </h3>
                      <p className="text-white/90 text-sm mb-3">
                        {button.description}
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-xs">Buka</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-3 -bottom-3 h-16 w-16 rounded-full bg-white/10 transform group-hover:scale-125 transition-transform duration-500"></div>
                </button>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-8 p-6 bg-white rounded-xl border border-green-200 shadow-inner">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">
                Informasi {type === 'tkh' ? 'Absensi TKH' : 'Absensi Karyawan'}
              </h3>
            </div>
            <ul className="text-green-700 space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Klik menu untuk mengakses form atau rekap</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Form akan terbuka di tab baru</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Isi form sesuai dengan data diri Anda</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center py-6">
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm rounded-xl shadow-sm border border-green-200">
          <p className="text-green-800 font-medium text-sm">
            Aplikasi Powered by M Rijal Ramdani
          </p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default AttendanceGroup;