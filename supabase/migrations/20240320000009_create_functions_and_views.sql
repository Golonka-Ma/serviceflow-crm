-- Create update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reminders_updated_at
BEFORE UPDATE ON reminders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Drop existing trigger and function to avoid dependency issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create the CLEAN version of handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_val TEXT;
  last_name_val TEXT;
  avatar_url_val TEXT;
  full_name_from_meta TEXT;
  space_pos INTEGER;
BEGIN
  -- 1. Get available data from raw_user_meta_data
  first_name_val := NEW.raw_user_meta_data->>'first_name';
  last_name_val := NEW.raw_user_meta_data->>'last_name';
  avatar_url_val := COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture');
  full_name_from_meta := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name');

  -- 2. If first name OR last name is missing, AND we have full name from metadata, try to split it
  IF (first_name_val IS NULL OR last_name_val IS NULL) AND full_name_from_meta IS NOT NULL THEN
    space_pos := POSITION(' ' IN full_name_from_meta);
    IF space_pos > 0 THEN
        first_name_val := COALESCE(first_name_val, LEFT(full_name_from_meta, space_pos - 1));
        last_name_val := COALESCE(last_name_val, SUBSTRING(full_name_from_meta FROM space_pos + 1));
    ELSE
        first_name_val := COALESCE(first_name_val, full_name_from_meta);
        last_name_val := NULL;
    END IF;
  END IF;

  -- 3. Insert into profiles
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    email,
    avatar_url
  )
  VALUES (
    NEW.id,
    first_name_val,
    last_name_val,
    NEW.email,
    avatar_url_val
  );

  -- 4. Insert into settings
  INSERT INTO public.settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Still log errors, but without debug steps
    RAISE LOG '[Error User %] Error in handle_new_user: %', NEW.id, SQLERRM;
    RETURN NEW; -- Still important to not interrupt the main auth process
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Create views
CREATE OR REPLACE VIEW upcoming_jobs AS
SELECT j.*, c.first_name, c.last_name, c.phone, c.email
FROM jobs j
JOIN clients c ON j.client_id = c.id
WHERE j.status = 'scheduled'
AND j.scheduled_at > NOW()
ORDER BY j.scheduled_at ASC;

CREATE OR REPLACE VIEW recent_clients AS
SELECT c.*
FROM clients c
ORDER BY c.created_at DESC
LIMIT 10;

CREATE OR REPLACE VIEW upcoming_reminders AS
SELECT r.*, c.first_name, c.last_name, c.phone, c.email
FROM reminders r
LEFT JOIN clients c ON r.client_id = c.id
WHERE r.reminder_date > NOW()
AND r.status = 'pending'
ORDER BY r.reminder_date ASC;

CREATE OR REPLACE VIEW job_stats AS
SELECT 
  user_id,
  COUNT(*) AS total_jobs,
  COUNT(CASE WHEN status = 'scheduled' THEN 1 END) AS scheduled_jobs,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) AS in_progress_jobs,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_jobs,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_jobs,
  SUM(price) AS total_price,
  SUM(CASE WHEN status = 'completed' THEN price ELSE 0 END) AS realized_price
FROM jobs
GROUP BY user_id;

-- Enable RLS for views
ALTER VIEW upcoming_jobs SET (security_invoker = on);
ALTER VIEW recent_clients SET (security_invoker = on);
ALTER VIEW upcoming_reminders SET (security_invoker = on);
ALTER VIEW job_stats SET (security_invoker = on); 