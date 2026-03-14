-- Add shop_domain to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS shop_domain text;

-- Add cost breakdown columns to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS revenue numeric DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_cost numeric DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost numeric DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tax numeric DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();