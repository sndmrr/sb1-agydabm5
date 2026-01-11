import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Upload, Image, Save, X, Camera, CheckCircle, Layers } from 'lucide-react';
import { updateAppSetting, getAllAppSettings, fileToBase64, getAllButtonSettings, updateButtonSetting, ButtonSetting } from '../lib/supabase';

interface AdminSettingsProps {
  onBack: () => void;
  onPhotoUpdate: (type: 'header' | 'roster' | 'payment', photoUrl: string) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({
  onBack,
  onPhotoUpdate
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);
  const [currentPhotos, setCurrentPhotos] = useState({
    header: '',
    roster: '',
    payment: ''
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'buttons'>('photos');
  const [buttonSettings, setButtonSettings] = useState<ButtonSetting[]>([]);
  const [loadingButtons, setLoadingButtons] = useState(false);

  const ADMIN_PASSWORD = 'Rijal1101*';

  useEffect(() => {
    if (isAuthenticated) {
      loadCurrentPhotos();
      loadButtonSettings();
    }
  }, [isAuthenticated]);

  const loadCurrentPhotos = async () => {
    try {
      const settings = await getAllAppSettings();
      setCurrentPhotos({
        header: settings.header_photo || '',
        roster: settings.roster_photo || '',
        payment: settings.payment_photo || ''
      });
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const loadButtonSettings = async () => {
    try {
      setLoadingButtons(true);
      const buttons = await getAllButtonSettings();
      setButtonSettings(buttons);
    } catch (error) {
      console.error('Error loading button settings:', error);
    } finally {
      setLoadingButtons(false);
    }
  };

  const handleButtonToggle = async (id: string, currentState: boolean) => {
    try {
      await updateButtonSetting(id, !currentState);

      // Update local state
      setButtonSettings(prev =>
        prev.map(btn => btn.id === id ? { ...btn, is_enabled: !currentState } : btn)
      );

      setSuccess('Pengaturan tombol berhasil diupdate!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating button setting:', error);
      alert('Error mengupdate pengaturan tombol');
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Password salah!');
    }
  };

  const handleFileUpload = async (file: File, type: 'header' | 'roster' | 'payment') => {
    // Validate file
    if (file.size > 1024 * 1024) {
      alert('Ukuran file maksimal 1MB');
      return;
    }

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Format file harus JPG, JPEG, atau PNG');
      return;
    }

    setUploading(type);

    try {
      // Convert to base64
      const base64 = await fileToBase64(file);
      
      // Save to Supabase
      const settingKey = `${type}_photo`;
      await updateAppSetting(settingKey, base64);
      
      // Update local state
      setCurrentPhotos(prev => ({
        ...prev,
        [type]: base64
      }));
      
      // Update parent component
      onPhotoUpdate(type, base64);
      
      // Show success message
      setSuccess(`Foto ${type} berhasil diupdate!`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Silakan coba lagi.');
    } finally {
      setUploading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-200">
            <div className="text-center mb-6">
              <button
                onClick={onBack}
                className="absolute top-4 left-4 p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </button>
              
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2>
              <p className="text-gray-600">Masukkan password untuk mengakses</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </button>
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-800">Admin Settings</h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'photos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Image className="inline mr-2 h-5 w-5" />
            Kelola Foto
          </button>
          <button
            onClick={() => setActiveTab('buttons')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'buttons'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Layers className="inline mr-2 h-5 w-5" />
            Kelola Tombol
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">{success}</span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'photos' && (
          <>
            {/* Photo Management Cards */}
            <div className="space-y-6">
              {/* Header Photo */}
              <PhotoUploadCard
                title="Foto Header"
                description="Logo atau foto header utama aplikasi"
                currentPhoto={currentPhotos.header}
                uploading={uploading === 'header'}
                onFileUpload={(file) => handleFileUpload(file, 'header')}
                color="blue"
              />

              {/* Roster Photo */}
              <PhotoUploadCard
                title="Foto Jadwal Roster"
                description="Foto untuk section jadwal roster kerja"
                currentPhoto={currentPhotos.roster}
                uploading={uploading === 'roster'}
                onFileUpload={(file) => handleFileUpload(file, 'roster')}
                color="indigo"
              />

              {/* Payment Photo */}
              <PhotoUploadCard
                title="Foto Info Pembayaran"
                description="Foto untuk informasi transfer bank dan pembayaran"
                currentPhoto={currentPhotos.payment}
                uploading={uploading === 'payment'}
                onFileUpload={(file) => handleFileUpload(file, 'payment')}
                color="green"
              />
            </div>

            {/* Info */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <Image className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Panduan Upload Foto</h3>
              </div>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Format file: JPG, JPEG, PNG</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Ukuran maksimal: 1MB</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Foto akan tersimpan di database Supabase</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Semua user akan melihat perubahan secara real-time</span>
                </li>
              </ul>
            </div>
          </>
        )}

        {activeTab === 'buttons' && (
          <div className="space-y-6">
            {loadingButtons ? (
              <div className="text-center py-8">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            ) : buttonSettings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Tidak ada pengaturan tombol ditemukan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {buttonSettings.map(button => (
                  <div
                    key={button.id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-200 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800">{button.button_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Kategori: <span className="font-medium">{button.category.replace(/_/g, ' ')}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleButtonToggle(button.id, button.is_enabled)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        button.is_enabled
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                      }`}
                    >
                      {button.is_enabled ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <Layers className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Kelola Visibilitas Tombol</h3>
              </div>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Aktif: Tombol akan ditampilkan di halaman utama</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Nonaktif: Tombol akan disembunyikan dari halaman utama</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Perubahan akan langsung terlihat di aplikasi</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center py-6">
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm rounded-xl shadow-sm border border-blue-200">
          <p className="text-blue-800 font-medium text-sm">
            Aplikasi Powered by M Rijal Ramdani
          </p>
        </div>
      </footer>
    </div>
  );
};

// Photo Upload Card Component
interface PhotoUploadCardProps {
  title: string;
  description: string;
  currentPhoto: string;
  uploading: boolean;
  onFileUpload: (file: File) => void;
  color: 'blue' | 'indigo' | 'green';
}

const PhotoUploadCard: React.FC<PhotoUploadCardProps> = ({
  title,
  description,
  currentPhoto,
  uploading,
  onFileUpload,
  color
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-blue-100',
      border: 'border-blue-200',
      text: 'text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600'
    },
    indigo: {
      bg: 'from-indigo-50 to-indigo-100',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      icon: 'text-indigo-600'
    },
    green: {
      bg: 'from-green-50 to-green-100',
      border: 'border-green-200',
      text: 'text-green-800',
      button: 'bg-green-600 hover:bg-green-700',
      icon: 'text-green-600'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`bg-gradient-to-r ${classes.bg} rounded-xl shadow-lg p-6 border ${classes.border}`}>
      <div className="flex items-start space-x-6">
        {/* Photo Preview */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white">
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt={title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${classes.text} mb-2`}>{title}</h3>
          <p className={`${classes.text} opacity-80 mb-4`}>{description}</p>

          <div className="space-y-4">
            {/* Upload Button */}
            <label className={`flex items-center space-x-2 px-4 py-2 ${classes.button} text-white rounded-lg transition-colors cursor-pointer inline-flex`}>
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  <span>Upload Foto</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileUpload(file);
                }}
                className="hidden"
                disabled={uploading}
              />
            </label>

            <p className="text-xs text-gray-600">
              Format: JPG, JPEG, PNG • Maksimal: 1MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;