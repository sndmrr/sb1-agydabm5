import React, { useState } from 'react';
import { Users, ArrowLeft, Building2, Factory, ExternalLink, Truck } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface DivisionSelectionProps {
  onBack: () => void;
}

const DivisionSelection: React.FC<DivisionSelectionProps> = ({ onBack }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  const handleDivisionClick = (url: string) => {
    setSelectedUrl(url);
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

  const handleProduksiClick = () => {
    handleDivisionClick('https://forms.gle/ZKXH8LLVxvRoYKvy8');
  };

  const handleSaranaPrasaranaClick = () => {
    handleDivisionClick('https://docs.google.com/forms/d/e/1FAIpQLSdUni1UNZMJOXgLglDHn5OAVxFlzQa6bvABp2o8OElsyiH1ww/viewform');
  };

  const handleDistribusiClick = () => {
    handleDivisionClick('https://forms.gle/1xKu1j4ARBzmid178');
  };

  const divisions = [
    {
      name: 'Sarana Prasarana',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      description: 'Divisi Sarana dan Prasarana',
      onClick: handleSaranaPrasaranaClick,
      available: true
    },
    {
      name: 'Produksi',
      icon: Factory,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      description: 'Divisi Produksi',
      onClick: handleProduksiClick,
      available: true
    },
    {
      name: 'Distribusi',
      icon: Truck,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      description: 'Divisi Distribusi',
      onClick: handleDistribusiClick,
      available: true
    }
  ];

  return (
    <>
    <ConfirmationModal
      isOpen={showModal}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
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
              <h1 className="text-2xl font-bold text-green-800">Absensi Tenaga Kerja Harian</h1>
            </div>
          </div>
          <p className="text-green-600">Persemaian Site Citanduy</p>
        </div>

        {/* Division Selection */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 border border-green-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Silahkan Pilih Divisi Anda
            </h2>
            <p className="text-green-600 text-lg">
              Pilih divisi untuk melanjutkan ke sistem absensi
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
                      <p className="text-white/90 text-sm">
                        {division.description}
                      </p>
                      <div className="flex items-center justify-center mt-3 space-x-2">
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-xs">Buka Form</span>
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
                Informasi Absensi
              </h3>
            </div>
            <ul className="text-green-700 space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Klik divisi untuk mengisi form absensi</span>
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

export default DivisionSelection;