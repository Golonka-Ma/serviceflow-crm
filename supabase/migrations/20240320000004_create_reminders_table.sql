-- Create reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES clients(id),
  job_id UUID REFERENCES jobs(id),
  title TEXT NOT NULL,
  description TEXT,
  reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'completed', 'cancelled')),
  type TEXT DEFAULT 'email' CHECK (type IN ('email', 'sms', 'app')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for frequently searched fields
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders (user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_client_id ON reminders (client_id);
CREATE INDEX IF NOT EXISTS idx_reminders_job_id ON reminders (job_id);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders (status);
CREATE INDEX IF NOT EXISTS idx_reminders_type ON reminders (type);
CREATE INDEX IF NOT EXISTS idx_reminders_is_sent ON reminders (is_sent);

-- Create index for reminder dates
CREATE INDEX IF NOT EXISTS idx_reminders_date ON reminders (reminder_date);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
DROP TRIGGER IF EXISTS set_updated_at_reminders ON reminders;
CREATE TRIGGER set_updated_at_reminders
BEFORE UPDATE ON reminders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can manage their own reminders" ON reminders;

-- Create policies
CREATE POLICY "Users can view their own reminders"
  ON reminders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reminders"
  ON reminders
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id); 