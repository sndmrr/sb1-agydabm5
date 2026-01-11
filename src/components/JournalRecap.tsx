import React, { useState, useEffect } from 'react';
import { Calendar, Download, User, FileText, Search, Filter } from 'lucide-react';
import { getAllEmployees, getAttendanceRecordsByEmployee, Employee, AttendanceRecord } from '../lib/supabase';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (startDate: string, endDate: string) => void;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerate = () => {
    if (startDate && endDate) {
      onGenerate(startDate, endDate);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Pilih Periode Tanggal</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleGenerate}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

const JournalRecap: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      loadAttendanceRecords();
    }
  }, [selectedEmployee]);

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadAttendanceRecords = async () => {
    if (!selectedEmployee) return;
    
    setLoading(true);
    try {
      const data = await getAttendanceRecordsByEmployee(selectedEmployee);
      setAttendanceRecords(data);
    } catch (error) {
      console.error('Error loading attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async (startDate: string, endDate: string) => {
    if (!selectedEmployee) return;

    try {
      const records = await getAttendanceRecordsByEmployee(selectedEmployee, startDate, endDate);
      const employee = employees.find(emp => emp.id === selectedEmployee);
      
      if (!employee) return;

      // Import jsPDF dynamically
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Calculate number of pages needed (7 days per page)
      const daysPerPage = 7;
      const totalPages = Math.ceil(records.length / daysPerPage);
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          doc.addPage();
        }
        
        const startIndex = page * daysPerPage;
        const endIndex = Math.min(startIndex + daysPerPage, records.length);
        const pageRecords = records.slice(startIndex, endIndex);
        
        // Header
        doc.setFontSize(16);
        doc.text('JURNAL LAPORAN KEGIATAN MINGGUAN', 105, 20, { align: 'center' });
        
        // Logo placeholder
        doc.setFontSize(12);
        doc.text('T4T TREES+TREES', 105, 30, { align: 'center' });
        
        // Employee Info
        doc.setFontSize(10);
        doc.text(`Nama Karyawan: ${employee.name}`, 20, 45);
        doc.text(`Jabatan: ${employee.position}`, 20, 52);
        doc.text(`Unit: ${employee.unit}`, 20, 59);
        
        // Calculate period from records
        const firstDate = pageRecords[0]?.date || startDate;
        const lastDate = pageRecords[pageRecords.length - 1]?.date || endDate;
        doc.text(`Periode: ${firstDate} - ${lastDate}`, 20, 66);
        
        // Table
        const tableData = pageRecords.map(record => [
          record.date,
          record.work_type === 'Day Off' ? 'DAY OFF' : record.activity_detail || '',
          record.location || '',
          record.notes || '',
          record.photo_url ? '[Foto]' : '-'
        ]);
        
        autoTable(doc, {
          head: [['Tanggal', 'Kegiatan', 'Lokasi', 'Catatan Penting', 'Dokumentasi Foto']],
          body: tableData,
          startY: 75,
          theme: 'grid',
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [66, 139, 202],
            textColor: 255
          },
          didParseCell: (data) => {
            const record = pageRecords[data.row.index];
            if (record && record.work_type === 'Day Off') {
              data.cell.styles.fillColor = [255, 200, 200]; // Light red background
            }
          },
          didDrawCell: (data) => {
            const record = pageRecords[data.row.index];
            if (record && record.photo_url && data.column.index === 4) {
              // Add image to cell if photo exists
              try {
                doc.addImage(record.photo_url, 'JPEG', data.cell.x + 2, data.cell.y + 2, 15, 15);
              } catch (error) {
                console.error('Error adding image to PDF:', error);
              }
            }
          }
        });
        
        // Footer with signatures
        const finalY = (doc as any).lastAutoTable.finalY || 150;
        
        doc.setFontSize(10);
        doc.text('Dibuat Oleh:', 30, finalY + 20);
        doc.text(`${employee.name}`, 30, finalY + 30);
        doc.text(employee.position, 30, finalY + 35);
        
        // Add signature image if exists
        if (employee.signature_url) {
          try {
            doc.addImage(employee.signature_url, 'JPEG', 30, finalY + 40, 40, 20);
          } catch (error) {
            console.error('Error adding signature to PDF:', error);
          }
        }
        
        doc.text('Diperiksa Oleh:', 130, finalY + 20);
        doc.text('Dian Wardana', 130, finalY + 30);
        doc.text('Site Manager Citanduy', 130, finalY + 35);
        
        // Add manager signature placeholder
        doc.rect(130, finalY + 40, 40, 20);
        doc.text('[Tanda Tangan]', 130, finalY + 50);
      }
      
      // Save PDF
      doc.save(`Jurnal_${employee.name}_${startDate}_${endDate}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please make sure jsPDF and jspdf-autotable are installed.');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Rekap Jurnal Kegiatan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline w-4 h-4 mr-1" />
                Pilih Karyawan
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari karyawan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Karyawan</option>
                {filteredEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position} ({employee.unit})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                Aksi
              </label>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!selectedEmployee}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {selectedEmployee && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Riwayat Absensi
              </h3>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : selectedEmployee ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kegiatan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catatan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foto
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record) => (
                    <tr key={record.id} className={record.work_type === 'Day Off' ? 'bg-red-50' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {record.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.work_type === 'Masuk' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.work_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {record.location || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {record.activity_detail || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {record.notes || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {record.photo_url ? (
                          <img
                            src={record.photo_url}
                            alt="Documentation"
                            className="w-12 h-12 object-cover rounded cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => window.open(record.photo_url, '_blank')}
                          />
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {attendanceRecords.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Belum ada data absensi untuk karyawan ini.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Silakan pilih karyawan untuk melihat riwayat absensi.
            </div>
          )}
        </div>
      </div>

      <DateRangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGeneratePDF}
      />
    </div>
  );
};

export default JournalRecap;
