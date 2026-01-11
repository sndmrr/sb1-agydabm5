# Trees4Trees Citanduy Portal

Portal aplikasi untuk Yayasan Bumi Hijau Lestari - Unit Citanduy dengan sistem absensi terintegrasi.

## Fitur

- **Portal Utama**: Akses ke berbagai aplikasi dan dokumen
- **Sistem Absensi**: Absensi tenaga kerja harian dengan database
- **Integrasi Database**: Supabase untuk penyimpanan data
- **Export Data**: Google Sheets dan CSV
- **Responsive Design**: Optimized untuk mobile dan desktop
- **Random Themes**: 4 tema berbeda setiap reload

## Setup Database (Supabase)

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan migration SQL yang ada di `supabase/migrations/create_attendance_tables.sql`
3. Update file `.env` dengan kredensial Supabase:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Setup Google Sheets Integration

### Google Apps Script Integration (Recommended)
1. Buat Google Spreadsheet baru
2. Buka Apps Script (Extensions > Apps Script)
3. Paste kode dari file `GOOGLE_SHEETS_SETUP.md`
4. Deploy sebagai Web App dengan akses "Anyone"
5. Update URL di `src/lib/googleSheets.ts`

**📋 Panduan Lengkap:** Lihat file `GOOGLE_SHEETS_SETUP.md` untuk tutorial step-by-step yang detail!

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Project ini sudah dikonfigurasi untuk deployment ke Netlify.

## Struktur Database

### Tables:
- `divisions`: Divisi kerja
- `employees`: Data karyawan
- `attendance_records`: Record absensi

### Features:
- Real-time sync dengan Supabase
- Export ke Google Sheets
- Download CSV
- Responsive design
- Admin panel untuk manage data

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Supabase (Database)
- Google Sheets API
- Vite (Build tool)
- Lucide React (Icons)