/*
  # Add subscription system to Mikasa AI

  1. New Tables
    - `subscriptions` - User subscription information
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles.id)
      - `plan_type` (text, enum: free, premium, pro)
      - `status` (text, enum: active, inactive, expired, cancelled)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `payment_method` (text)
      - `payment_reference` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_usage` - Track daily usage
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles.id)
      - `date` (date)
      - `messages_count` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on new tables
    - Add policies for users to manage their own subscription data

  3. Functions
    - `get_user_subscription_status()` - Get current subscription status
    - `update_user_usage()` - Update daily message usage
    - `check_usage_limit()` - Check if user can send more messages
*/

-- Create subscription plans enum
DO $$ BEGIN
    CREATE TYPE subscription_plan AS ENUM ('free', 'premium', 'pro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create subscription status enum
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'expired', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  payment_method text,
  payment_reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, status) -- Only one active subscription per user
);

-- Create user_usage table
CREATE TABLE IF NOT EXISTS user_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  messages_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date) -- One record per user per day
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can read own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for user_usage
CREATE POLICY "Users can read own usage"
  ON user_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own usage"
  ON user_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own usage"
  ON user_usage
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_usage_updated_at
  BEFORE UPDATE ON user_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get user subscription status
CREATE OR REPLACE FUNCTION get_user_subscription_status(user_uuid uuid)
RETURNS TABLE (
  plan_type text,
  status text,
  end_date timestamptz,
  is_active boolean,
  messages_limit integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.plan_type::text,
    s.status::text,
    s.end_date,
    (s.status = 'active' AND (s.end_date IS NULL OR s.end_date > now()))::boolean as is_active,
    CASE 
      WHEN s.plan_type = 'free' THEN 10
      WHEN s.plan_type = 'premium' THEN -1  -- unlimited
      WHEN s.plan_type = 'pro' THEN -1      -- unlimited
      ELSE 10
    END as messages_limit
  FROM subscriptions s
  WHERE s.user_id = user_uuid
    AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;
  
  -- If no subscription found, return free plan
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      'free'::text as plan_type,
      'active'::text as status,
      NULL::timestamptz as end_date,
      true::boolean as is_active,
      10::integer as messages_limit;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user usage
CREATE OR REPLACE FUNCTION update_user_usage(user_uuid uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO user_usage (user_id, date, messages_count)
  VALUES (user_uuid, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET 
    messages_count = user_usage.messages_count + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check usage limit
CREATE OR REPLACE FUNCTION check_usage_limit(user_uuid uuid)
RETURNS TABLE (
  can_send boolean,
  messages_used integer,
  messages_limit integer,
  plan_type text
) AS $$
DECLARE
  subscription_info RECORD;
  usage_today integer := 0;
BEGIN
  -- Get subscription info
  SELECT * INTO subscription_info 
  FROM get_user_subscription_status(user_uuid);
  
  -- Get today's usage
  SELECT COALESCE(messages_count, 0) INTO usage_today
  FROM user_usage 
  WHERE user_id = user_uuid AND date = CURRENT_DATE;
  
  -- Return result
  RETURN QUERY
  SELECT 
    (subscription_info.messages_limit = -1 OR usage_today < subscription_info.messages_limit)::boolean as can_send,
    usage_today::integer as messages_used,
    subscription_info.messages_limit::integer as messages_limit,
    subscription_info.plan_type::text as plan_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create default free subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS trigger AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan_type, status, start_date)
  VALUES (NEW.id, 'free', 'active', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default subscription for new users
CREATE TRIGGER create_user_default_subscription
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_end_date_idx ON subscriptions(end_date);
CREATE INDEX IF NOT EXISTS user_usage_user_id_date_idx ON user_usage(user_id, date);
CREATE INDEX IF NOT EXISTS user_usage_date_idx ON user_usage(date);