export type Company = {
  id: string;
  user_id: string;
  name: string;
  tax_id?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type CompanyInsert = Omit<Company, "id" | "created_at" | "updated_at">;
export type CompanyUpdate = Partial<CompanyInsert>;
