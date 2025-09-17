/*
  # Create user usage table

  1. New Tables
    - `user_usage`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `user_id` (uuid, references auth.users, not null)
      - `date` (date, default current_date, not null)
      - `messages_used` (integer, default 0, not null)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
      - Unique constraint on (user_id, date)

  2. Security
    - Enable RLS on `user_usage` table
    - Add policies for users to view/insert/update their own usage
*/

CREATE TABLE IF NOT EXISTS public.user_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  messages_used integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, date)
);

ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage."
  ON public.user_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage."
  ON public.user_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage."
  ON public.user_usage FOR UPDATE
  USING (auth.uid() = user_id);