-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES clients(id),
  job_id UUID REFERENCES jobs(id),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('invoice', 'quote', 'receipt', 'report', 'other')),
  content JSONB,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'cancelled')),
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  document_number TEXT,
  amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for frequently searched fields
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents (user_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents (client_id);
CREATE INDEX IF NOT EXISTS idx_documents_job_id ON documents (job_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents (type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents (status);
CREATE INDEX IF NOT EXISTS idx_documents_document_number ON documents (document_number);

-- Create function to generate document number
CREATE OR REPLACE FUNCTION generate_document_number(document_type TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  year TEXT;
  sequence_number INTEGER;
BEGIN
  -- Set prefix based on document type
  CASE document_type
    WHEN 'invoice' THEN prefix := 'INV';
    WHEN 'quote' THEN prefix := 'QUO';
    WHEN 'receipt' THEN prefix := 'REC';
    WHEN 'report' THEN prefix := 'REP';
    ELSE prefix := 'DOC';
  END CASE;
  
  -- Get current year
  year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  -- Get next sequence number
  SELECT COALESCE(MAX(CAST(SPLIT_PART(document_number, '-', 3) AS INTEGER)), 0) + 1
  INTO sequence_number
  FROM documents
  WHERE document_number LIKE prefix || '-' || year || '-%';
  
  -- Return formatted document number
  RETURN prefix || '-' || year || '-' || LPAD(sequence_number::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp and generating document number
CREATE OR REPLACE FUNCTION set_document_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.document_number IS NULL AND NEW.type IS NOT NULL THEN
    NEW.document_number := generate_document_number(NEW.type);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS set_updated_at_documents ON documents;
CREATE TRIGGER set_updated_at_documents
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_document_number_trigger ON documents;
CREATE TRIGGER set_document_number_trigger
BEFORE INSERT ON documents
FOR EACH ROW
EXECUTE FUNCTION set_document_number();

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
DROP POLICY IF EXISTS "Users can manage their own documents" ON documents;

-- Create policies
CREATE POLICY "Users can view their own documents"
  ON documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id); 