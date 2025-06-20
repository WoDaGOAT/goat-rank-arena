
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const RATE_LIMIT_ACTION = 'post_comment';
const RATE_LIMIT_COUNT = 5; // 5 comments
const RATE_LIMIT_WINDOW_MINUTES = 5; // per 5 minutes

Deno.serve(async (req) => {
  console.log('🚀 Post-comment function called');
  console.log('📝 Method:', req.method);
  console.log('🔗 URL:', req.url);
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('📦 Parsing request body...');
    const { categoryId, commentText } = await req.json();
    console.log('📝 Received data:', { categoryId, commentText: commentText?.substring(0, 50) + '...' });
    
    if (!categoryId || !commentText) {
        console.error('❌ Missing required fields:', { categoryId: !!categoryId, commentText: !!commentText });
        return new Response(JSON.stringify({ error: 'Missing categoryId or commentText' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    console.log('🔐 Creating user client...');
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    console.log('👤 Getting user...');
    const { data: { user } } = await userClient.auth.getUser();
    console.log('👤 User:', user ? { id: user.id, email: user.email } : 'null');

    if (!user) {
        console.error('❌ User not authenticated');
        return new Response(JSON.stringify({ error: 'User not authenticated' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
        });
    }

    console.log('🔧 Creating service client...');
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    console.log('🚦 Checking rate limits...');
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    
    const { count, error: rateLimitError } = await serviceClient
      .from('rate_limit_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('action', RATE_LIMIT_ACTION)
      .gt('created_at', windowStart);

    if (rateLimitError) {
      console.error('❌ Rate limit check error:', rateLimitError);
      throw rateLimitError;
    }

    console.log('📊 Rate limit check:', { count, limit: RATE_LIMIT_COUNT });

    if (count !== null && count >= RATE_LIMIT_COUNT) {
        console.warn('⚠️ Rate limit exceeded for user:', user.id);
        return new Response(JSON.stringify({ error: `You can only post ${RATE_LIMIT_COUNT} comments every ${RATE_LIMIT_WINDOW_MINUTES} minutes.` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 429,
        });
    }
    
    console.log('💬 Inserting comment...');
    const { data: commentData, error: commentError } = await userClient
      .from("category_comments")
      .insert({ user_id: user.id, category_id: categoryId, comment: commentText })
      .select("*, profiles (id, full_name, avatar_url)")
      .single();

    if (commentError) {
      console.error('❌ Comment insertion error:', commentError);
      throw commentError;
    }
    
    if (!commentData) {
      console.error('❌ No comment data returned');
      throw new Error("Comment could not be created.");
    }

    console.log('✅ Comment created:', { id: commentData.id });

    console.log('📝 Logging rate limit event...');
    const { error: logError } = await serviceClient.from('rate_limit_events').insert({
        user_id: user.id,
        action: RATE_LIMIT_ACTION,
    });
    
    if (logError) {
      console.error("⚠️ Failed to log rate limit event:", logError);
    }
    
    console.log('🎉 Comment posting successful');
    return new Response(JSON.stringify(commentData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
