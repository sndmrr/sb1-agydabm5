/*
  # Add photo support for Field Coordinators

  1. Changes
    - Add photo_url column to field_coordinators table
    - Update existing FC records with placeholder photos

  2. Security
    - Maintain existing RLS policies
*/

-- Add photo_url column to field_coordinators
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'field_coordinators' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE field_coordinators ADD COLUMN photo_url text DEFAULT '';
  END IF;
END $$;

-- Update existing FC records with placeholder photos
UPDATE field_coordinators SET photo_url = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE name = 'Alamsyah Bagaskara';
UPDATE field_coordinators SET photo_url = 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE name = 'Iwan Kuswandi';
UPDATE field_coordinators SET photo_url = 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE name = 'M Rizky Haryanto';
UPDATE field_coordinators SET photo_url = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE name = 'Muhammad Ilham';
UPDATE field_coordinators SET photo_url = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' WHERE name = 'Nurrizki Aulia';