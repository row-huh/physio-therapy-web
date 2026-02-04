-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  disease_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  hospital TEXT NOT NULL,
  bio TEXT NOT NULL,
  doctor_code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes on doctors table
CREATE INDEX IF NOT EXISTS idx_doctors_email ON doctors(email);
CREATE INDEX IF NOT EXISTS idx_doctors_code ON doctors(doctor_code);

-- Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for unauthenticated access (adjust based on your auth model)
-- For now, allowing public read/write - you should restrict this based on your auth setup
CREATE POLICY "Enable read access for all users" ON patients
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users" ON patients
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON patients
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete access for all users" ON patients
  FOR DELETE
  USING (true);

CREATE POLICY "Enable read access for all users" ON doctors
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users" ON doctors
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON doctors
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete access for all users" ON doctors
  FOR DELETE
  USING (true);
