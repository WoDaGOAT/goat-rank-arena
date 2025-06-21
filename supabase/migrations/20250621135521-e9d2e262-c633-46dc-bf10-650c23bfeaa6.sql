
-- Create category_reactions table
CREATE TABLE public.category_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('thumbs-up', 'trophy', 'flame', 'frown')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, category_id, reaction_type)
);

-- Create ranking_reactions table
CREATE TABLE public.ranking_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ranking_id UUID NOT NULL REFERENCES public.user_rankings(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('thumbs-up', 'trophy', 'flame', 'frown')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, ranking_id, reaction_type)
);

-- Create ranking_comments table (referenced in SocialActions but doesn't exist)
CREATE TABLE public.ranking_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ranking_id UUID NOT NULL REFERENCES public.user_rankings(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.ranking_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add Row Level Security policies for category_reactions
ALTER TABLE public.category_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read category reactions" ON public.category_reactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert category reactions" ON public.category_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own category reactions" ON public.category_reactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own category reactions" ON public.category_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Add Row Level Security policies for ranking_reactions
ALTER TABLE public.ranking_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read ranking reactions" ON public.ranking_reactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert ranking reactions" ON public.ranking_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ranking reactions" ON public.ranking_reactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ranking reactions" ON public.ranking_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Add Row Level Security policies for ranking_comments
ALTER TABLE public.ranking_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read ranking comments" ON public.ranking_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert ranking comments" ON public.ranking_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ranking comments" ON public.ranking_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ranking comments" ON public.ranking_comments
  FOR DELETE USING (auth.uid() = user_id);
