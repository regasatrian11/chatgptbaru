/*
  # Complete User and Subscription System

  1. New Tables
    - `profiles` - User profile information
    - `subscriptions` - User subscription plans and status
    - `user_usage` - Daily message usage tracking
    - `payment_records` - Payment transaction history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure access based on user ownership

  3. Functions
    - get_user_subscription_status() - Get current subscription
    - check_usage_limit() - Check daily message limits
    - update_user_usage() - Track message usage
    - create_user_profile() - Auto-create profile on signup
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  username text UNIQUE,
  whatsapp text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('free', 'premium', 'pro')),
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'expired', 'cancelled')) DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  payment_method text,
  payment_reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_usage table
CREATE TABLE IF NOT EXISTS user_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE,
  messages_sent integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create payment_records table
CREATE TABLE IF NOT EXISTS payment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount integer NOT NULL,
  currency text DEFAULT 'IDR',
  payment_method text NOT NULL,
  payment_reference text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User usage policies
CREATE POLICY "Users can read own usage"
  ON user_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON user_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON user_usage
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Payment records policies
CREATE POLICY "Users can read own payments"
  ON payment_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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
    COALESCE(s.plan_type, 'free'::text) as plan_type,
    COALESCE(s.status, 'active'::text) as status,
    s.end_date,
    CASE 
      WHEN s.plan_type IS NULL THEN true -- free plan is always active
      WHEN s.status = 'active' AND (s.end_date IS NULL OR s.end_date > now()) THEN true
      ELSE false
    END as is_active,
    CASE 
      WHEN COALESCE(s.plan_type, 'free') = 'free' THEN 10
      WHEN COALESCE(s.plan_type, 'free') IN ('premium', 'pro') THEN -1 -- unlimited
      ELSE 10
    END as messages_limit
  FROM auth.users u
  LEFT JOIN subscriptions s ON u.id = s.user_id 
    AND s.status = 'active' 
    AND (s.end_date IS NULL OR s.end_date > now())
  WHERE u.id = user_uuid
  ORDER BY s.created_at DESC
  LIMIT 1;
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
  usage_today integer;
BEGIN
  -- Get subscription info
  SELECT * INTO subscription_info 
  FROM get_user_subscription_status(user_uuid);
  
  -- Get today's usage
  SELECT COALESCE(messages_sent, 0) INTO usage_today
  FROM user_usage 
  WHERE user_id = user_uuid AND date = CURRENT_DATE;
  
  -- Return result
  RETURN QUERY
  SELECT 
    CASE 
      WHEN subscription_info.messages_limit = -1 THEN true -- unlimited
      WHEN usage_today < subscription_info.messages_limit THEN true
      ELSE false
    END as can_send,
    usage_today as messages_used,
    subscription_info.messages_limit,
    subscription_info.plan_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user usage
CREATE OR REPLACE FUNCTION update_user_usage(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  INSERT INTO user_usage (user_id, date, messages_sent)
  VALUES (user_uuid, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET 
    messages_sent = user_usage.messages_sent + 1,
    updated_at = now();
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Create default free subscription
  INSERT INTO subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_date ON user_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_payment_records_user_id ON payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_reference ON payment_records(payment_reference);