/*
  # Create payment records table

  1. New Tables
    - `payment_records`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `user_id` (uuid, references auth.users, not null)
      - `amount` (integer, not null) - amount in smallest currency unit
      - `payment_method` (text, not null)
      - `payment_reference` (text, not null)
      - `status` (text, default 'pending') - 'pending', 'paid', 'failed', 'cancelled'
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `payment_records` table
    - Add policies for users to view their own payment records
*/

CREATE TABLE IF NOT EXISTS public.payment_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  payment_method text NOT NULL,
  payment_reference text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment records."
  ON public.payment_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment records."
  ON public.payment_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);