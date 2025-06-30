/*
  # Fix profiles table RLS policy

  1. Changes
    - Drop existing profiles policies that use incorrect function name
    - Recreate policies with correct uid() function reference
    - Ensure users can insert their own profile during signup

  2. Security
    - Maintain RLS protection
    - Allow authenticated users to manage their own profile data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Recreate policies with correct function reference
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (uid() = id);