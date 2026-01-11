/*
  # Employee Attendance Management System Database

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `name` (text, employee name)
      - `position` (text, job position)
      - `unit` (text, work unit)
      - `signature_url` (text, signature photo URL)
      - `require_photo_documentation` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `attendance_records`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key to employees)
      - `date` (date, attendance date)
      - `work_type` (text, 'Masuk' or 'Day Off')
      - `location` (text, activity location)
      - `activity_detail` (text, activity details)
      - `notes` (text, important notes)
      - `photo_url` (text, documentation photo URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since no auth system)

  3. Indexes
    - Create indexes for better performance
*/

-- Create Employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  unit text NOT NULL,
  signature_url text DEFAULT '',
  require_photo_documentation boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Attendance Records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  work_type text NOT NULL CHECK (work_type IN ('Masuk', 'Day Off')),
  location text,
  activity_detail text,
  notes text,
  photo_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, date) -- Prevent duplicate attendance for same employee and date
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow all operations on employees"
  ON employees
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on attendance_records"
  ON attendance_records
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance_records(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);

-- Insert sample employees
INSERT INTO employees (name, position, unit, require_photo_documentation) VALUES
  ('MUHAMMAD ILHAM', 'Field Coordinator', 'Site Citanduy', true),
  ('DIAN WARDANA', 'Site Manager', 'Site Citanduy', false),
  ('IWAN KUSWANDI', 'Field Coordinator', 'Site Citanduy', true),
  ('ALAMSYAH BAGASKARA', 'Field Coordinator', 'Site Citanduy', true),
  ('M RIZKY HARYANTO', 'Field Coordinator', 'Site Citanduy', true)
ON CONFLICT DO NOTHING;
