
-- Add more detailed analytics events for tracking user flows
ALTER TABLE public.analytics_events 
ADD COLUMN IF NOT EXISTS page_url TEXT,
ADD COLUMN IF NOT EXISTS previous_page_url TEXT,
ADD COLUMN IF NOT EXISTS interaction_type TEXT,
ADD COLUMN IF NOT EXISTS form_step TEXT,
ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER;

-- Create function to calculate bounce rates
CREATE OR REPLACE FUNCTION get_bounce_rates(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  page_url TEXT,
  total_sessions BIGINT,
  bounced_sessions BIGINT,
  bounce_rate DECIMAL
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
  WITH page_sessions AS (
    SELECT 
      ae.session_id,
      ae.page_url,
      COUNT(*) as page_views
    FROM analytics_events ae
    WHERE ae.event_type = 'page_view'
    AND DATE(ae.created_at) BETWEEN start_date AND end_date
    AND ae.page_url IN ('/', '/auth/signin', '/auth/signup')
    GROUP BY ae.session_id, ae.page_url
  )
  SELECT 
    ps.page_url,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN ps.page_views = 1 THEN 1 END) as bounced_sessions,
    ROUND(
      (COUNT(CASE WHEN ps.page_views = 1 THEN 1 END) * 100.0 / COUNT(*))::decimal, 
      2
    ) as bounce_rate
  FROM page_sessions ps
  GROUP BY ps.page_url
  ORDER BY ps.page_url;
END;
$$;

-- Create function to analyze registration flow
CREATE OR REPLACE FUNCTION get_registration_flow_analytics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  step_name TEXT,
  started_count BIGINT,
  completed_count BIGINT,
  conversion_rate DECIMAL,
  avg_time_seconds DECIMAL
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
  WITH registration_steps AS (
    SELECT 
      ae.session_id,
      ae.form_step,
      ae.event_type,
      ae.time_spent_seconds,
      ae.created_at,
      ROW_NUMBER() OVER (PARTITION BY ae.session_id, ae.form_step ORDER BY ae.created_at) as step_order
    FROM analytics_events ae
    WHERE ae.event_type IN ('form_step_start', 'form_step_complete', 'signup')
    AND DATE(ae.created_at) BETWEEN start_date AND end_date
    AND ae.form_step IS NOT NULL
  ),
  step_stats AS (
    SELECT 
      rs.form_step as step_name,
      COUNT(CASE WHEN rs.event_type = 'form_step_start' THEN 1 END) as started,
      COUNT(CASE WHEN rs.event_type = 'form_step_complete' THEN 1 END) as completed,
      AVG(rs.time_spent_seconds) as avg_time
    FROM registration_steps rs
    GROUP BY rs.form_step
  )
  SELECT 
    ss.step_name,
    ss.started as started_count,
    ss.completed as completed_count,
    CASE 
      WHEN ss.started > 0 THEN ROUND((ss.completed * 100.0 / ss.started)::decimal, 2)
      ELSE 0
    END as conversion_rate,
    ROUND(COALESCE(ss.avg_time, 0)::decimal, 2) as avg_time_seconds
  FROM step_stats ss
  ORDER BY ss.step_name;
END;
$$;

-- Create function to analyze ranking creation flow
CREATE OR REPLACE FUNCTION get_ranking_flow_analytics(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  step_name TEXT,
  started_count BIGINT,
  completed_count BIGINT,
  conversion_rate DECIMAL,
  avg_completion_time_seconds DECIMAL
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
  WITH ranking_steps AS (
    SELECT 
      ae.session_id,
      ae.properties->>'step' as step_name,
      ae.event_type,
      ae.time_spent_seconds,
      ae.created_at
    FROM analytics_events ae
    WHERE ae.event_type IN ('ranking_flow_start', 'ranking_step_complete', 'ranking_created')
    AND DATE(ae.created_at) BETWEEN start_date AND end_date
    AND ae.properties->>'step' IS NOT NULL
  ),
  step_conversions AS (
    SELECT 
      rs.step_name,
      COUNT(DISTINCT rs.session_id) as sessions_at_step,
      AVG(rs.time_spent_seconds) as avg_time
    FROM ranking_steps rs
    GROUP BY rs.step_name
  ),
  completion_stats AS (
    SELECT 
      COUNT(DISTINCT session_id) as total_completed
    FROM ranking_steps
    WHERE event_type = 'ranking_created'
  )
  SELECT 
    sc.step_name,
    sc.sessions_at_step as started_count,
    cs.total_completed as completed_count,
    CASE 
      WHEN sc.sessions_at_step > 0 THEN ROUND((cs.total_completed * 100.0 / sc.sessions_at_step)::decimal, 2)
      ELSE 0
    END as conversion_rate,
    ROUND(COALESCE(sc.avg_time, 0)::decimal, 2) as avg_completion_time_seconds
  FROM step_conversions sc
  CROSS JOIN completion_stats cs
  ORDER BY sc.step_name;
END;
$$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_page_url ON public.analytics_events(page_url);
CREATE INDEX IF NOT EXISTS idx_analytics_events_form_step ON public.analytics_events(form_step);
CREATE INDEX IF NOT EXISTS idx_analytics_events_interaction_type ON public.analytics_events(interaction_type);
