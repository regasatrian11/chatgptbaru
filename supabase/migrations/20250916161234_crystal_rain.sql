/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `user_id` (uuid, references auth.users, not null)
      - `plan_type` (text, not null) - 'free', 'premium', 'pro'
      - `status` (text, not null) - 'active', 'inactive', 'expired', 'cancelled'
      - `start_date` (timestamp with time zone, default now())
      - `end_date` (timestamp with time zone, nullable)
      - `payment_method` (text, nullable)
      - `payment_reference` (text, nullable)
      - `messages_limit` (integer, nullable) - -1 for unlimited
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policies for users to view/insert/update their own subscriptions
*/

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  plan_type text NOT NULL,
  status text NOT NULL,
  start_date timestamp with time zone DEFAULT now() NOT NULL,
  end_date timestamp with time zone,
  payment_method text,
  payment_reference text,
  messages_limit integer,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions."
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions."
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions."
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);