
-- Ad accounts table
CREATE TABLE public.ad_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('meta', 'google', 'tiktok', 'linkedin')),
  account_name TEXT,
  account_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, platform, account_id)
);

-- Ad campaign metrics table
CREATE TABLE public.ad_campaign_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.ad_accounts(id) ON DELETE CASCADE,
  campaign_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  date DATE NOT NULL,
  spend NUMERIC NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  ctr NUMERIC NOT NULL DEFAULT 0,
  cpc NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (account_id, campaign_id, date)
);

-- Enable RLS
ALTER TABLE public.ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaign_metrics ENABLE ROW LEVEL SECURITY;

-- RLS for ad_accounts
CREATE POLICY "Users can view own ad accounts"
  ON public.ad_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ad accounts"
  ON public.ad_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ad accounts"
  ON public.ad_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ad accounts"
  ON public.ad_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS for ad_campaign_metrics
CREATE POLICY "Users can view own campaign metrics"
  ON public.ad_campaign_metrics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ad_accounts
    WHERE ad_accounts.id = ad_campaign_metrics.account_id
    AND ad_accounts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own campaign metrics"
  ON public.ad_campaign_metrics FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ad_accounts
    WHERE ad_accounts.id = ad_campaign_metrics.account_id
    AND ad_accounts.user_id = auth.uid()
  ));

-- Trigger for updated_at on ad_accounts
CREATE TRIGGER update_ad_accounts_updated_at
  BEFORE UPDATE ON public.ad_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for campaign metrics
ALTER PUBLICATION supabase_realtime ADD TABLE public.ad_campaign_metrics;
