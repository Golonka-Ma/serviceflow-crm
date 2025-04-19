export type Payment = {
  id: string;
  user_id: string;
  client_id?: string;
  job_id?: string;
  document_id?: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type PaymentInsert = Omit<Payment, "id" | "created_at" | "updated_at">;
export type PaymentUpdate = Partial<
  Omit<PaymentInsert, "user_id" | "amount" | "payment_date">
>;
