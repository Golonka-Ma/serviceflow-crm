export type DocumentType = "invoice" | "quote" | "receipt" | "report" | "other";
export type DocumentStatus = "draft" | "sent" | "viewed" | "paid" | "cancelled";

export type Document = {
  id: string;
  user_id: string;
  client_id?: string;
  job_id?: string;
  title: string;
  type?: DocumentType;
  content?: Record<string, any>;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  status: DocumentStatus;
  sent_at?: string;
  viewed_at?: string;
  document_number?: string;
  amount?: number;
  created_at: string;
  updated_at: string;
};

export type DocumentInsert = Omit<Document, "id" | "created_at" | "updated_at">;
export type DocumentUpdate = Partial<Omit<DocumentInsert, "user_id">>;
