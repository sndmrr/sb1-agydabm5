import React from 'react';
import { Clock, AlertCircle, CheckCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Perhatian",
  message = "Pastikan isi Absensi Paling Lambat jam 10 Setiap Harinya."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full transform animate-scaleIn border-2 border-orange-100">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
        >
          <X className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Clock className="h-10 w-10 text-white animate-bounce" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            {title}
          </h2>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg font-semibold text-orange-900 mb-2">
                  {message}
                </p>
                <p className="text-sm text-orange-700">
                  Pastikan Anda mengisi absensi tepat waktu untuk keakuratan data.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 border-2 border-gray-200"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Ya, Lanjutkan</span>
            </button>
          </div>
        </div>

        <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-orange-200 to-red-200 rounded-full blur-2xl opacity-50 -z-10"></div>
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-2xl opacity-50 -z-10"></div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
