import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, FileText, Camera, Save, Upload, User, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  getAllEmployees, 
  getEmployeeById, 
  addAttendanceRecord, 
  checkAttendanceExists, 
  getAttendanceSummary,
  Employee, 
  AttendanceRecord,
  fileToBase64 
} from '../lib/supabase';

interface EmployeeAttendanceFormProps {
  onBack: () => void;
}

const EmployeeAttendanceForm: React.FC<EmployeeAttendanceFormProps> = ({ onBack }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<Employee | null>(null);
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [workType, setWorkType] = useState<'Masuk' | 'Day Off'>('Masuk');
  const [location, setLocation] = useState<string>('');
  const [activityDetail, setActivityDetail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [attendanceSummary, setAttendanceSummary] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadEmployees();
    loadAttendanceSummary();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      loadEmployeeData();
      checkIfSubmitted();
    }
  }, [selectedEmployee, attendanceDate]);

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadEmployeeData = async () => {
    if (!selectedEmployee) return;
    
    try {
      const data = await getEmployeeById(selectedEmployee);
      setSelectedEmployeeData(data);
    } catch (error) {
      console.error('Error loading employee data:', error);
    }
  };

  const loadAttendanceSummary = async () => {
    try {
      // Calculate current period (25 last month to 24 this month)
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 25);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 24);
      
      const startDate = lastMonth.toISOString().split('T')[0];
      const endDate = thisMonth.toISOString().split('T')[0];
      
      const data = await getAttendanceSummary(startDate, endDate);
      setAttendanceSummary(data);
    } catch (error) {
      console.error('Error loading attendance summary:', error);
    }
  };

  const checkIfSubmitted = async () => {
    if (!selectedEmployee || !attendanceDate) return;
    
    try {
      const exists = await checkAttendanceExists(selectedEmployee, attendanceDate);
      setIsSubmitted(exists);
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    // Reset form fields
    setWorkType('Masuk');
    setLocation('');
    setActivityDetail('');
    setNotes('');
    setPhotoUrl('');
    setIsSubmitted(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPhotoUrl(base64);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !attendanceDate) {
      alert('Silakan pilih karyawan dan tanggal');
      return;
    }

    if (workType === 'Masuk') {
      if (!location || !activityDetail) {
        alert('Lokasi dan detail kegiatan wajib diisi untuk jenis "Masuk"');
        return;
      }
      
      if (selectedEmployeeData?.require_photo_documentation && !photoUrl) {
        alert('Foto dokumentasi wajib diupload untuk jabatan ini');
        return;
      }
    }

    setLoading(true);
    
    try {
      const attendanceData = {
        employee_id: selectedEmployee,
        date: attendanceDate,
        work_type: workType,
        location: workType === 'Masuk' ? location : '',
        activity_detail: workType === 'Masuk' ? activityDetail : '',
        notes: workType === 'Masuk' ? notes : '',
        photo_url: workType === 'Masuk' ? photoUrl : ''
      };

      await addAttendanceRecord(attendanceData);
      
      // Reset form
      setWorkType('Masuk');
      setLocation('');
      setActivityDetail('');
      setNotes('');
      setPhotoUrl('');
      setIsSubmitted(true);
      
      // Reload summary
      await loadAttendanceSummary();
      
      alert('Absensi berhasil disimpan!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Gagal menyimpan absensi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceStatus = (employeeId: string) => {
    const summary = attendanceSummary.find(s => s.employee.id === employeeId);
    if (!summary) return { present: 0, dayOff: 0, total: 0 };
    
    return {
      present: summary.present,
      dayOff: summary.dayOff,
      total: summary.present + summary.dayOff
    };
  };

  return (
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
            <h2 className="text-2xl font-bold text-gray-800">Form Absensi Karyawan</h2>
          </div>

          {/* Attendance Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Ringkasan Absensi Periode Saat Ini</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {attendanceSummary.map((summary) => (
                <div key={summary.employee.id} className="flex items-center justify-between bg-white rounded p-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{summary.employee.name}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                      Masuk: {summary.present}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                      Off: {summary.dayOff}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline w-4 h-4 mr-1" />
                Pilih Karyawan
              </label>
              <input
                type="text"
                placeholder="Cari karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedEmployee}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Karyawan</option>
                {filteredEmployees.map((employee) => {
                  const status = getAttendanceStatus(employee.id);
                  return (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position} ({employee.unit}) 
                      [{status.present} Masuk, {status.dayOff} Off]
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                Tanggal Absensi
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Work Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kehadiran
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Masuk"
                    checked={workType === 'Masuk'}
                    onChange={(e) => setWorkType(e.target.value as 'Masuk' | 'Day Off')}
                    className="mr-2"
                  />
                  <span className="text-sm">Masuk</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Day Off"
                    checked={workType === 'Day Off'}
                    onChange={(e) => setWorkType(e.target.value as 'Masuk' | 'Day Off')}
                    className="mr-2"
                  />
                  <span className="text-sm">Day Off</span>
                </label>
              </div>
            </div>

            {/* Auto-filled Position */}
            {selectedEmployeeData && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Briefcase className="inline w-4 h-4 mr-1" />
                  Jabatan (Auto-fill)
                </label>
                <input
                  type="text"
                  value={selectedEmployeeData.position}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Work Entry Fields - Only show if "Masuk" */}
          {workType === 'Masuk' && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Lokasi Kegiatan *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan lokasi kegiatan"
                    required={workType === 'Masuk'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Detail Kegiatan *
                  </label>
                  <input
                    type="text"
                    value={activityDetail}
                    onChange={(e) => setActivityDetail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan detail kegiatan"
                    required={workType === 'Masuk'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan Penting
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Masukkan catatan penting (opsional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Camera className="inline w-4 h-4 mr-1" />
                  Dokumentasi Foto 
                  {selectedEmployeeData?.require_photo_documentation && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    {photoUrl ? 'Ganti Foto' : 'Upload Foto'}
                  </label>
                  {photoUrl && (
                    <img
                      src={photoUrl}
                      alt="Documentation"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </div>
                {selectedEmployeeData?.require_photo_documentation && (
                  <p className="text-xs text-red-500 mt-1">
                    Foto dokumentasi wajib diupload untuk jabatan ini
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            {isSubmitted ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span>Absen telah diisi untuk tanggal ini</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading || !selectedEmployee}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Absensi
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeAttendanceForm;
