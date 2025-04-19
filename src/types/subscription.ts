export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status?: string;
  plan_id?: string;
  plan_name?: string;
  price_id?: string;
  price_amount?: number;
  currency: string;
  interval?: string;
  interval_count?: number;
  trial_start?: string;
  trial_end?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at?: string;
  canceled_at?: string;
  created_at: string;
  updated_at: string;
};

export type SubscriptionInsert = Omit<
  Subscription,
  "id" | "created_at" | "updated_at"
>;
export type SubscriptionUpdate = Partial<Omit<SubscriptionInsert, "user_id">>;
