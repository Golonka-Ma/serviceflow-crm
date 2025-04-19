export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type Job = {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  description?: string;
  status: JobStatus;
  scheduled_at?: string;
  completed_at?: string;
  location?: string;
  price?: number;
  cost?: number;
  materials?: any[];
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
};

export type JobInsert = Omit<Job, "id" | "created_at" | "updated_at">;
export type JobUpdate = Partial<Omit<JobInsert, "user_id" | "client_id">>;
