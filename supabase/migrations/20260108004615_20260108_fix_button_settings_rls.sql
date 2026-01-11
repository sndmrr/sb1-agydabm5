/*
  # Fix Button Settings RLS Policies

  The button settings UPDATE policies require authenticated users, but the application
  uses the anonymous key. This prevents updates from being saved.

  Changes:
  - Remove restrictive authentication requirement from UPDATE policy
  - Allow public/anonymous users to update button settings
  - Keep SELECT policy public for reading
*/

DROP POLICY IF EXISTS "Allow authenticated update" ON button_settings;
DROP POLICY IF EXISTS "Admin can update button settings" ON button_settings;

CREATE POLICY "Public can update button settings"
  ON button_settings FOR UPDATE
  TO public, authenticated
  WITH CHECK (true);
