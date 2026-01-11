/*
  # Add username and password columns to field_facilitators table

  1. Changes
    - Add `username` column (text, nullable)
    - Add `password` column (text, nullable)
    - These columns will store FF account credentials for admin management

  2. Security
    - Columns are nullable to allow gradual data entry
    - No additional RLS policies needed as they inherit from existing table policies
*/

-- Add username and password columns to field_facilitators table
ALTER TABLE field_facilitators
ADD COLUMN username TEXT,
ADD COLUMN password TEXT;