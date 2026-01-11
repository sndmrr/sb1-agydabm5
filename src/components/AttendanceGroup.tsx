import React, { Fragment } from 'react';
import { ArrowLeft, Users, FileText, BarChart3, Calendar, ClipboardList, ExternalLink } from 'lucide-react';
import DivisionRecapSelection from './DivisionRecapSelection';
import DivisionSelection from './DivisionSelection';
import ConfirmationModal from './ConfirmationModal';
import EmployeeAttendanceForm from './EmployeeAttendanceForm';
import JournalRecap from './JournalRecap';

interface AttendanceGroupProps {
  type: 'tkh' | 'employee';
  onBack: () => void;
}

const AttendanceGroup: React.FC<AttendanceGroupProps> = ({ type, onBack }) => {
  const [showRecapDivision, setShowRecapDivision] = React.useState(false);
  const [showAbsenDivision, setShowAbsenDivision] = React.useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = React.useState(false);
  const [showJournalRecap, setShowJournalRecap] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedUrl, setSelectedUrl] = React.useState<string>('');

  const handleRecapClick = () => {
    if (type === 'employee') {
      setShowJournalRecap(true);
    } else {
      setShowRecapDivision(true);
    }
  };

  const handleAbsenClick = () => {
    if (type === 'employee') {
      setShowEmployeeForm(true);
    } else {
      setShowAbsenDivision(true);
    }
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

  // Show employee attendance form
  if (showEmployeeForm) {
    return (
      <EmployeeAttendanceForm 
        onBack={() => setShowEmployeeForm(false)} 
      />
    );
  }

  // Show journal recap
  if (showJournalRecap) {
    return (
      <JournalRecap 
        onBack={() => setShowJournalRecap(false)} 
      />
    );
  }

  // Show division selection for recap if requested
  if (showRecapDivision) {
    return (
      <DivisionRecapSelection 
        onBack={() => setShowRecapDivision(false)} 
      />
    );
  }

  // Show division selection for attendance if requested
  if (showAbsenDivision) {
    return (
      <DivisionSelection 
        onBack={() => setShowAbsenDivision(false)} 
      />
    );
  }

  const title = type === 'tkh' ? 'Absensi Tenaga Kerja Harian' : 'Absensi Karyawan';
  const description = type === 'tkh' 
    ? 'Kelola absensi tenaga kerja harian dan rekapitulasi data.'
    : 'Kelola absensi karyawan dan rekap jurnal kegiatan mingguan.';

  return (
    <Fragment>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </button>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            </div>
            <p className="text-gray-600">{description}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Absensi Button */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={handleAbsenClick}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-600 text-white p-3 rounded-lg">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-blue-600 font-semibold text-sm">Form Input</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {type === 'tkh' ? 'Input Absensi TKH' : 'Input Absensi Karyawan'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {type === 'tkh' 
                    ? 'Catat kehadiran tenaga kerja harian untuk setiap divisi.'
                    : 'Catat kehadiran dan kegiatan karyawan harian.'}
                </p>
                <div className="flex items-center text-blue-600 font-medium text-sm">
                  <span>Mulai Input</span>
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </div>
              </div>

              {/* Rekap Button */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={handleRecapClick}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-600 text-white p-3 rounded-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-green-600 font-semibold text-sm">Laporan</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {type === 'tkh' ? 'Rekap Absensi' : 'Rekap Jurnal'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {type === 'tkh' 
                    ? 'Lihat rekapitulasi absensi dan export data ke Google Sheets.'
                    : 'Lihat rekap jurnal kegiatan dan export PDF.'}
                </p>
                <div className="flex items-center text-green-600 font-medium text-sm">
                  <span>Lihat Data</span>
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </div>
              </div>
            </div>

            {/* Additional Options for Employee Attendance */}
            {type === 'employee' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Opsi Tambahan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleEmployeeAbsenClick}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow transition-all text-left"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-800">Form Eksternal</div>
                      <div className="text-sm text-gray-500">Buka form Google Forms</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
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

      <ConfirmationModal
        isOpen={showModal}
        title="Buka Form Eksternal"
        message="Apakah Anda ingin membuka form absensi eksternal di tab baru?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Fragment>
  );
};

export default AttendanceGroup;
