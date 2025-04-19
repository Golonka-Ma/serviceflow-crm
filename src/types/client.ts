export type Client = {
  id: string;
  user_id: string;
  company_id?: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ClientInsert = Omit<
  Client,
  "id" | "display_name" | "created_at" | "updated_at"
>;
export type ClientUpdate = Partial<Omit<ClientInsert, "user_id">>;
