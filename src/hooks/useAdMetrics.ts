import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AdCampaignMetric {
  id: string;
  account_id: string;
  campaign_id: string;
  campaign_name: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

interface UseAdMetricsOptions {
  startDate?: string;
  endDate?: string;
  platform?: string;
  campaignName?: string;
}

export function useAdMetrics(options?: UseAdMetricsOptions) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["ad_campaign_metrics", user?.id, options],
    enabled: !!user,
    queryFn: async () => {
      let query = supabase
        .from("ad_campaign_metrics")
        .select("*, ad_accounts!inner(platform, account_name, user_id)")
        .order("date", { ascending: false });

      if (options?.startDate) {
        query = query.gte("date", options.startDate);
      }
      if (options?.endDate) {
        query = query.lte("date", options.endDate);
      }
      if (options?.platform) {
        query = query.eq("ad_accounts.platform", options.platform);
      }
      if (options?.campaignName) {
        query = query.ilike("campaign_name", `%${options.campaignName}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((row: any) => ({
        id: row.id,
        account_id: row.account_id,
        campaign_id: row.campaign_id,
        campaign_name: row.campaign_name,
        date: row.date,
        spend: Number(row.spend),
        impressions: row.impressions,
        clicks: row.clicks,
        conversions: row.conversions,
        ctr: Number(row.ctr),
        cpc: Number(row.cpc),
        platform: row.ad_accounts?.platform,
      }));
    },
  });
}

export function useAdMetricsSummary(options?: UseAdMetricsOptions) {
  const { data: metrics, ...rest } = useAdMetrics(options);

  const summary = metrics
    ? {
        totalSpend: metrics.reduce((s, m) => s + m.spend, 0),
        totalImpressions: metrics.reduce((s, m) => s + m.impressions, 0),
        totalClicks: metrics.reduce((s, m) => s + m.clicks, 0),
        totalConversions: metrics.reduce((s, m) => s + m.conversions, 0),
        avgCTR: metrics.length ? metrics.reduce((s, m) => s + m.ctr, 0) / metrics.length : 0,
        avgCPC: metrics.length ? metrics.reduce((s, m) => s + m.cpc, 0) / metrics.length : 0,
      }
    : null;

  return { data: metrics, summary, ...rest };
}
