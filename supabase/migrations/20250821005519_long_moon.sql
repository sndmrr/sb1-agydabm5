/*
  # Add photo support for Field Coordinators

  1. Changes
    - Add photo_url column to field_coordinators table
    - Update existing FC records with default empty photo_url

  2. Security
    - Maintain existing RLS policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'field_coordinators' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE field_coordinators ADD COLUMN photo_url text DEFAULT '';
  END IF;
END $$;