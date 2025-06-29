
-- Create analytics events table to track user actions and traffic sources
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'page_view', 'signup', 'ranking_created', 'comment_posted', etc.
  user_id UUID REFERENCES auth.users(id), -- nullable for anonymous events
  session_id TEXT, -- to track anonymous user sessions
  properties JSONB DEFAULT '{}', -- flexible storage for event-specific data
  traffic_source TEXT, -- 'organic', 'social', 'ads', 'direct', 'referral'
  referrer TEXT, -- the actual referrer URL
  utm_source TEXT, -- UTM parameters
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  ip_address TEXT, -- for geographic analysis
  user_agent TEXT, -- for device/browser analysis
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily analytics aggregation table for better performance
CREATE TABLE public.daily_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  metric_type TEXT NOT NULL, -- 'page_views', 'signups', 'rankings_created', etc.
  metric_value INTEGER NOT NULL DEFAULT 0,
  breakdown JSONB DEFAULT '{}', -- for storing breakdowns by source, category, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date, metric_type)
);

-- Create user sessions table to track conversion funnels
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id), -- null until signup
  first_page_view TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signup_completed_at TIMESTAMP WITH TIME ZONE,
  traffic_source TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  page_views INTEGER DEFAULT 1,
  time_on_site INTEGER, -- in seconds
  converted_to_signup BOOLEAN DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_traffic_source ON public.analytics_events(traffic_source);
CREATE INDEX idx_daily_analytics_date_metric ON public.daily_analytics(date, metric_type);
CREATE INDEX idx_user_sessions_created_at ON public.user_sessions(created_at);
CREATE INDEX idx_user_sessions_traffic_source ON public.user_sessions(traffic_source);
CREATE INDEX idx_user_sessions_converted ON public.user_sessions(converted_to_signup);

-- Function to aggregate daily analytics
CREATE OR REPLACE FUNCTION aggregate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Page views by traffic source
  INSERT INTO daily_analytics (date, metric_type, metric_value, breakdown)
  SELECT 
    target_date,
    'page_views',
    COUNT(*),
    jsonb_build_object('by_source', jsonb_object_agg(
      COALESCE(traffic_source, 'unknown'), 
      source_count
    ))
  FROM (
    SELECT 
      traffic_source,
      COUNT(*) as source_count
    FROM analytics_events 
    WHERE event_type = 'page_view' 
    AND DATE(created_at) = target_date
    GROUP BY traffic_source
  ) source_data
  ON CONFLICT (date, metric_type) 
  DO UPDATE SET 
    metric_value = EXCLUDED.metric_value,
    breakdown = EXCLUDED.breakdown;

  -- Signups by traffic source
  INSERT INTO daily_analytics (date, metric_type, metric_value, breakdown)
  SELECT 
    target_date,
    'signups',
    COUNT(*),
    jsonb_build_object('by_source', jsonb_object_agg(
      COALESCE(traffic_source, 'unknown'), 
      source_count
    ))
  FROM (
    SELECT 
      traffic_source,
      COUNT(*) as source_count
    FROM analytics_events 
    WHERE event_type = 'signup' 
    AND DATE(created_at) = target_date
    GROUP BY traffic_source
  ) source_data
  ON CONFLICT (date, metric_type) 
  DO UPDATE SET 
    metric_value = EXCLUDED.metric_value,
    breakdown = EXCLUDED.breakdown;

  -- Rankings created
  INSERT INTO daily_analytics (date, metric_type, metric_value, breakdown)
  SELECT 
    target_date,
    'rankings_created',
    COUNT(*),
    jsonb_build_object('by_category', jsonb_object_agg(
      category_name, 
      category_count
    ))
  FROM (
    SELECT 
      c.name as category_name,
      COUNT(*) as category_count
    FROM user_rankings ur
    JOIN categories c ON ur.category_id = c.id
    WHERE DATE(ur.created_at) = target_date
    GROUP BY c.name
  ) category_data
  ON CONFLICT (date, metric_type) 
  DO UPDATE SET 
    metric_value = EXCLUDED.metric_value,
    breakdown = EXCLUDED.breakdown;

  -- Comments posted
  INSERT INTO daily_analytics (date, metric_type, metric_value)
  SELECT 
    target_date,
    'comments_posted',
    COUNT(*)
  FROM category_comments
  WHERE DATE(created_at) = target_date
  ON CONFLICT (date, metric_type) 
  DO UPDATE SET metric_value = EXCLUDED.metric_value;

  -- Quiz attempts
  INSERT INTO daily_analytics (date, metric_type, metric_value)
  SELECT 
    target_date,
    'quiz_attempts',
    COUNT(*)
  FROM quiz_attempts
  WHERE DATE(completed_at) = target_date
  ON CONFLICT (date, metric_type) 
  DO UPDATE SET metric_value = EXCLUDED.metric_value;

END;
$$;

-- Function to get analytics data for dashboard
CREATE OR REPLACE FUNCTION get_analytics_dashboard(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  metric_type TEXT,
  date_data JSONB,
  total_value BIGINT,
  breakdown_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    da.metric_type,
    jsonb_object_agg(da.date::text, da.metric_value ORDER BY da.date) as date_data,
    SUM(da.metric_value) as total_value,
    jsonb_object_agg(da.date::text, da.breakdown ORDER BY da.date) FILTER (WHERE da.breakdown IS NOT NULL) as breakdown_data
  FROM daily_analytics da
  WHERE da.date BETWEEN start_date AND end_date
  GROUP BY da.metric_type
  ORDER BY da.metric_type;
END;
$$;

-- Function to get conversion funnel data
CREATE OR REPLACE FUNCTION get_conversion_funnel(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  traffic_source TEXT,
  total_sessions BIGINT,
  signups BIGINT,
  conversion_rate DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    COALESCE(us.traffic_source, 'unknown') as traffic_source,
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE us.converted_to_signup = true) as signups,
    ROUND(
      (COUNT(*) FILTER (WHERE us.converted_to_signup = true) * 100.0 / COUNT(*))::decimal, 
      2
    ) as conversion_rate
  FROM user_sessions us
  WHERE DATE(us.created_at) BETWEEN start_date AND end_date
  GROUP BY COALESCE(us.traffic_source, 'unknown')
  ORDER BY total_sessions DESC;
END;
$$;

-- Enable RLS on new tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies (admin only access)
CREATE POLICY "Admin only access to analytics_events" ON public.analytics_events
  FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin only access to daily_analytics" ON public.daily_analytics
  FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin only access to user_sessions" ON public.user_sessions
  FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Trigger to update user_sessions when signup occurs
CREATE OR REPLACE FUNCTION handle_signup_conversion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user_sessions when a user signs up
  UPDATE user_sessions 
  SET 
    user_id = NEW.id,
    signup_completed_at = now(),
    converted_to_signup = true,
    updated_at = now()
  WHERE session_id IN (
    SELECT DISTINCT session_id 
    FROM analytics_events 
    WHERE properties->>'user_email' = NEW.email 
    OR properties->>'temp_user_id' = NEW.id::text
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_signup_conversion();
