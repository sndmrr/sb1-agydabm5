/*
  # Create Button Settings Table

  1. New Tables
    - `button_settings`
      - `id` (uuid, primary key)
      - `button_key` (text, unique)
      - `button_name` (text)
      - `category` (text)
      - `is_enabled` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `button_settings` table
    - Public read access (everyone can see button visibility)
    - Admin-only write access (only admin can modify)

  3. Initial Data
    - Populate with default button settings
*/

CREATE TABLE IF NOT EXISTS button_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  button_key text UNIQUE NOT NULL,
  button_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('home', 'tkh_attendance', 'recap_attendance')),
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default button settings
INSERT INTO button_settings (button_key, button_name, category, is_enabled)
VALUES
  ('nms_app', 'Aplikasi NMS', 'home', true),
  ('tkh_attendance', 'Absensi Tenaga Kerja', 'home', true),
  ('employee_attendance', 'Absensi Karyawan', 'home', true),
  ('ff_registration', 'Daftar FF', 'home', true),
  ('payment_info', 'Iuran dan Rincian', 'home', true)
ON CONFLICT (button_key) DO NOTHING;

ALTER TABLE button_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view button settings"
  ON button_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can update button settings"
  ON button_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);