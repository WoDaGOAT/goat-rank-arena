
-- Insert GOAT subcategories
INSERT INTO public.categories (name, description, parent_id) VALUES
('Football/Soccer GOAT', 'Greatest football/soccer players of all time', (SELECT id FROM public.categories WHERE name = 'GOAT' LIMIT 1)),
('Basketball GOAT', 'Greatest basketball players of all time', (SELECT id FROM public.categories WHERE name = 'GOAT' LIMIT 1)),
('Tennis GOAT', 'Greatest tennis players of all time', (SELECT id FROM public.categories WHERE name = 'GOAT' LIMIT 1)),
('American Football GOAT', 'Greatest American football players of all time', (SELECT id FROM public.categories WHERE name = 'GOAT' LIMIT 1)),
('Baseball GOAT', 'Greatest baseball players of all time', (SELECT id FROM public.categories WHERE name = 'GOAT' LIMIT 1)),
('Boxing GOAT', 'Greatest boxers of all time', (SELECT id FROM public.categories WHERE name = 'GOAT' LIMIT 1)),
('Swimming GOAT', 'Greatest swimmers of all time', (SELECT id FROM public.categories WHERE name = 'GOAT' LIMIT 1)),
('Track & Field GOAT', 'Greatest track and field athletes of all time', (SELECT id FROM public.categories WHERE name = 'GOAT' LIMIT 1));
