export type Profile = {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  job_title?: string;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = Omit<Profile, "id" | "created_at" | "updated_at">;
export type ProfileUpdate = Partial<ProfileInsert>;
