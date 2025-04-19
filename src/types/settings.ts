export type EmailNotifications = {
  reminders: boolean;
  jobs: boolean;
  payments: boolean;
};

export type Settings = {
  id: string;
  user_id: string;
  email_notifications: EmailNotifications;
  theme: string;
  language: string;
  timezone: string;
  date_format: string;
  first_day_of_week: number;
  currency: string;
  custom_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type SettingsInsert = Omit<Settings, "id" | "created_at" | "updated_at">;
export type SettingsUpdate = Partial<Omit<SettingsInsert, "user_id">>;
