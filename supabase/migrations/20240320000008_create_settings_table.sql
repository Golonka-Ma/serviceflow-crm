-- Create settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  email_notifications JSONB DEFAULT '{"reminders": true, "jobs": true, "payments": true}',
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'pl',
  timezone TEXT DEFAULT 'Europe/Warsaw',
  date_format TEXT DEFAULT 'DD.MM.YYYY',
  first_day_of_week INTEGER DEFAULT 1,
  currency TEXT DEFAULT 'PLN',
  custom_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for frequently searched fields
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings (user_id);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
DROP TRIGGER IF EXISTS set_updated_at_settings ON settings;
CREATE TRIGGER set_updated_at_settings
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own settings" ON settings;
DROP POLICY IF EXISTS "Users can manage their own settings" ON settings;

-- Create policies
CREATE POLICY "Users can view their own settings"
  ON settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own settings"
  ON settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id); 