/*
  # FF Registration System Database

  1. New Tables
    - `field_coordinators` (FC)
      - `id` (uuid, primary key)
      - `name` (text, FC name)
      - `created_at` (timestamp)
    
    - `field_facilitators` (FF)
      - `id` (uuid, primary key)
      - `fc_id` (uuid, foreign key to field_coordinators)
      - `photo_url` (text, photo URL)
      - `name` (text, FF name)
      - `nik` (text, NIK)
      - `phone` (text, phone number)
      - `address` (text, address)
      - `birth_place` (text, birth place)
      - `birth_date` (date, birth date)
      - `account_number` (text, bank account number)
      - `bank_name` (text, bank name)
      - `account_holder` (text, account holder name)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since no auth system)

  3. Sample Data
    - Insert 5 Field Coordinators
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;

-- Create Field Coordinators table
CREATE TABLE IF NOT EXISTS field_coordinators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create Field Facilitators table
CREATE TABLE IF NOT EXISTS field_facilitators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fc_id uuid NOT NULL REFERENCES field_coordinators(id) ON DELETE CASCADE,
  photo_url text DEFAULT '',
  name text NOT NULL,
  nik text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  birth_place text NOT NULL,
  birth_date date NOT NULL,
  account_number text NOT NULL,
  bank_name text NOT NULL,
  account_holder text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE field_coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_facilitators ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow all operations on field_coordinators"
  ON field_coordinators
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on field_facilitators"
  ON field_facilitators
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Insert sample Field Coordinators
INSERT INTO field_coordinators (name) VALUES
  ('Alamsyah Bagaskara'),
  ('Iwan Kuswandi'),
  ('M Rizky Haryanto'),
  ('Muhammad Ilham'),
  ('Nurrizki Aulia');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ff_fc_id ON field_facilitators(fc_id);
CREATE INDEX IF NOT EXISTS idx_ff_name ON field_facilitators(name);
CREATE INDEX IF NOT EXISTS idx_fc_name ON field_coordinators(name);