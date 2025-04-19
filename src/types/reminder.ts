export type ReminderStatus = "pending" | "sent" | "completed" | "cancelled";
export type ReminderType = "email" | "sms" | "app";

export type Reminder = {
  id: string;
  user_id: string;
  client_id?: string;
  job_id?: string;
  title: string;
  description?: string;
  reminder_date: string;
  is_sent: boolean;
  sent_at?: string;
  status: ReminderStatus;
  type: ReminderType;
  created_at: string;
  updated_at: string;
};

export type ReminderInsert = Omit<Reminder, "id" | "created_at" | "updated_at">;
export type ReminderUpdate = Partial<Omit<ReminderInsert, "user_id">>;
