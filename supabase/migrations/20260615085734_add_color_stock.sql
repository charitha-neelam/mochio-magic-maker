-- Per-colour stock map, e.g. {"Pink": 5, "Blue": 2}
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS color_stock jsonb DEFAULT '{}'::jsonb;
