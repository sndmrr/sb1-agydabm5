import React from 'react';
import { ArrowLeft, Building2, Factory, BarChart3, ExternalLink, Truck } from 'lucide-react';

interface DivisionRecapSelectionProps {
  onBack: () => void;
}

const DivisionRecapSelection: React.FC<DivisionRecapSelectionProps> = ({ onBack }) => {
  const handleSaranaPrasaranaClick = () => {
    window.open('https://docs.google.com/spreadsheets/d/1Z0WvnsHcMk_qkj4vPL8TnkGG0VEf8oLkkMiLJsZ6muk/edit?usp=sharing', '_blank');
  };

  const handleProduksiClick = () => {
    window.open('https://docs.google.com/spreadsheets/d/1ej9d_0X9XpBah-FL-RYu9HjWPAvwmrnknMCFVaEFRVo/edit?usp=sharing', '_blank');
  };

  const handleDistribusiClick = () => {
    window.open('https://docs.google.com/spreadsheets/d/1XzEVu0k4fO-DL2JDg2kj9VC4pIHhv9ooJ1GHPrJlyFI/edit?usp=sharing', '_blank');
  };

  const divisions = [
    {
      name: 'Sarana Prasarana',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      description: 'Rekap Absen Divisi Sarana dan Prasarana',
      onClick: handleSaranaPrasaranaClick,
      available: true
    },
    {
      name: 'Produksi',
      icon: Factory,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      description: 'Rekap Absen Divisi Produksi',
      onClick: handleProduksiClick,
      available: true
    },
    {
      name: 'Distribusi',
      icon: Truck,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      description: 'Rekap Absen Divisi Distribusi',
      onClick: handleDistribusiClick,
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-purple-600" />
              </button>
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-purple-800">Rekap Absen TKH</h1>
            </div>
          </div>
          <p className="text-purple-600">Pilih divisi untuk melihat rekap absensi</p>
        </div>

        {/* Division Selection */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-purple-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Pilih Divisi untuk Rekap Absen
            </h2>
            <p className="text-purple-600 text-lg">
              Klik divisi untuk melihat rekap absensi TKH
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {divisions.map((division) => {
              const IconComponent = division.icon;
              return (
                <button
                  key={division.name}
                  onClick={division.onClick}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${division.color} ${division.hoverColor} p-8 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1 border border-white/30 backdrop-blur-sm`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-white/20 rounded-full transform group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="h-12 w-12" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        {division.name}
                      </h3>
                      <p className="text-white/90 text-sm mb-3">
                        {division.description}
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-xs">Buka Rekap</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-3 -bottom-3 h-16 w-16 rounded-full bg-white/10 transform group-hover:scale-125 transition-transform duration-500"></div>
                </button>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-8 p-6 bg-white rounded-xl border border-purple-200 shadow-inner">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800">
                Informasi Rekap Absen
              </h3>
            </div>
            <ul className="text-purple-700 space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Klik divisi untuk membuka Google Sheets rekap absen</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Data akan terbuka di tab baru</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Anda dapat melihat dan menganalisis data absensi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center py-6">
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 backdrop-blur-sm rounded-xl shadow-sm border border-purple-200">
          <p className="text-purple-800 font-medium text-sm">
            Aplikasi Powered by M Rijal Ramdani
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DivisionRecapSelection;