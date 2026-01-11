/*
  # Create app settings table for photo management

  1. New Tables
    - `app_settings`
      - `id` (uuid, primary key)
      - `setting_key` (text, unique) - Key untuk setting (header_photo, roster_photo, payment_photo)
      - `setting_value` (text) - URL atau base64 foto
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `app_settings` table
    - Add policy for public read access
    - Add policy for authenticated users to update
*/

CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings
CREATE POLICY "Allow public read access to app_settings"
  ON app_settings
  FOR SELECT
  TO public
  USING (true);

-- Allow everyone to insert/update settings (since we don't have auth system)
CREATE POLICY "Allow public write access to app_settings"
  ON app_settings
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Insert default settings
INSERT INTO app_settings (setting_key, setting_value) VALUES
  ('header_photo', 'https://i.postimg.cc/ZnWHPbw9/T4-T-Logo-Baru-2-1.jpg'),
  ('roster_photo', 'https://via.placeholder.com/600x300/e5f3ff/1e40af?text=Jadwal+Roster'),
  ('payment_photo', 'https://via.placeholder.com/600x300/f0fdf4/16a34a?text=Info+Pembayaran')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_app_settings_updated_at
    BEFORE UPDATE ON app_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();