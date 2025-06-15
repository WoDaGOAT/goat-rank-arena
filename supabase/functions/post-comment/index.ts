
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const RATE_LIMIT_ACTION = 'post_comment';
const RATE_LIMIT_COUNT = 5; // 5 comments
const RATE_LIMIT_WINDOW_MINUTES = 5; // per 5 minutes

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { categoryId, commentText } = await req.json();
    if (!categoryId || !commentText) {
        return new Response(JSON.stringify({ error: 'Missing categoryId or commentText' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { data: { user } } = await userClient.auth.getUser();

    if (!user) {
        return new Response(JSON.stringify({ error: 'User not authenticated' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
        });
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    
    const { count, error: rateLimitError } = await serviceClient
      .from('rate_limit_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('action', RATE_LIMIT_ACTION)
      .gt('created_at', windowStart);

    if (rateLimitError) throw rateLimitError;

    if (count !== null && count >= RATE_LIMIT_COUNT) {
        return new Response(JSON.stringify({ error: `You can only post ${RATE_LIMIT_COUNT} comments every ${RATE_LIMIT_WINDOW_MINUTES} minutes.` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 429,
        });
    }
    
    const { data: commentData, error: commentError } = await userClient
      .from("category_comments")
      .insert({ user_id: user.id, category_id: categoryId, comment: commentText })
      .select("*, profiles (id, full_name, avatar_url)")
      .single();

    if (commentError) throw commentError;
    if (!commentData) throw new Error("Comment could not be created.");

    const { error: logError } = await serviceClient.from('rate_limit_events').insert({
        user_id: user.id,
        action: RATE_LIMIT_ACTION,
    });
    
    if (logError) {
      console.error("Failed to log rate limit event:", logError);
    }
    
    return new Response(JSON.stringify(commentData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
