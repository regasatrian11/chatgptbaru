/*
  # Create subscription and usage functions

  1. Functions
    - `get_user_subscription_status(user_uuid)` - Returns user's current subscription status
    - `check_usage_limit(user_uuid)` - Checks if user can send messages based on usage
    - `update_user_usage(user_uuid)` - Updates user's daily message usage

  2. Security
    - Functions use RLS policies automatically
    - Functions handle default values for free users
*/

-- Function to get user subscription status
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid uuid)
 RETURNS TABLE(plan_type text, status text, end_date timestamp with time zone, is_active boolean, messages_limit integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(s.plan_type, 'free')::text,
    COALESCE(s.status, 'active')::text,
    s.end_date,
    COALESCE(s.status = 'active' AND (s.end_date IS NULL OR s.end_date > now()), true) AS is_active,
    COALESCE(s.messages_limit, 10)::integer
  FROM public.subscriptions s
  WHERE s.user_id = user_uuid AND s.status = 'active'
  ORDER BY s.end_date DESC NULLS LAST
  LIMIT 1;

  IF NOT FOUND THEN
    -- If no active subscription, return default free plan
    RETURN QUERY
    SELECT 'free'::text, 'active'::text, NULL::timestamp with time zone, true::boolean, 10::integer;
  END IF;
END;
$function$;

-- Function to check usage limit
CREATE OR REPLACE FUNCTION public.check_usage_limit(user_uuid uuid)
 RETURNS TABLE(can_send boolean, messages_used integer, messages_limit integer, plan_type text)
 LANGUAGE plpgsql
AS $function$
DECLARE
  current_plan_type text;
  current_messages_limit integer;
  today_messages_used integer;
  can_send_result boolean;
BEGIN
  -- Get current subscription details
  SELECT s.plan_type, s.messages_limit
  INTO current_plan_type, current_messages_limit
  FROM public.subscriptions s
  WHERE s.user_id = user_uuid AND s.status = 'active' AND (s.end_date IS NULL OR s.end_date > now())
  ORDER BY s.end_date DESC NULLS LAST
  LIMIT 1;

  IF current_plan_type IS NULL THEN
    current_plan_type := 'free';
    current_messages_limit := 10; -- Default for free plan
  END IF;

  -- Get messages used today
  SELECT COALESCE(uu.messages_used, 0)
  INTO today_messages_used
  FROM public.user_usage uu
  WHERE uu.user_id = user_uuid AND uu.date = CURRENT_DATE;

  IF today_messages_used IS NULL THEN
    today_messages_used := 0;
  END IF;

  -- Determine if user can send messages
  IF current_messages_limit = -1 THEN -- Unlimited messages
    can_send_result := true;
  ELSIF today_messages_used < current_messages_limit THEN
    can_send_result := true;
  ELSE
    can_send_result := false;
  END IF;

  RETURN QUERY
  SELECT
    can_send_result,
    today_messages_used,
    current_messages_limit,
    current_plan_type;
END;
$function$;

-- Function to update user usage
CREATE OR REPLACE FUNCTION public.update_user_usage(user_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.user_usage (user_id, date, messages_used)
  VALUES (user_uuid, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date) DO UPDATE
  SET messages_used = public.user_usage.messages_used + 1,
      updated_at = now();
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$function$;