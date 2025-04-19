-- Create clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES companies(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  notes TEXT,
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for frequently searched fields
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients (user_id);
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON clients (company_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients (phone);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients (is_active);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_clients_search ON clients 
USING GIN (to_tsvector('english', 
  COALESCE(first_name, '') || ' ' || 
  COALESCE(last_name, '') || ' ' || 
  COALESCE(email, '') || ' ' || 
  COALESCE(phone, '') || ' ' || 
  COALESCE(address, '') || ' ' || 
  COALESCE(city, '') || ' ' || 
  COALESCE(postal_code, '') || ' ' || 
  COALESCE(country, '') || ' ' || 
  COALESCE(notes, '')
));

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
DROP TRIGGER IF EXISTS set_updated_at_clients ON clients;
CREATE TRIGGER set_updated_at_clients
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can manage their own clients" ON clients;

-- Create policies
CREATE POLICY "Users can view their own clients"
  ON clients
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own clients"
  ON clients
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id); 