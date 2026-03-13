import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Placeholder: In production, replace with actual API calls to Meta/Google/TikTok/LinkedIn
async function fetchMetaAdsData(accessToken: string, accountId: string, startDate: string, endDate: string) {
  // TODO: Replace with real Meta Marketing API call
  // GET https://graph.facebook.com/v18.0/{accountId}/insights
  // ?fields=campaign_name,campaign_id,spend,impressions,clicks,actions,ctr,cpc
  // &time_range={'since':startDate,'until':endDate}
  // &level=campaign
  // &access_token={accessToken}
  console.log(`[Meta] Would fetch data for account ${accountId} from ${startDate} to ${endDate}`);
  return [];
}

async function fetchGoogleAdsData(accessToken: string, accountId: string, startDate: string, endDate: string) {
  // TODO: Replace with real Google Ads API call
  console.log(`[Google] Would fetch data for account ${accountId} from ${startDate} to ${endDate}`);
  return [];
}

async function fetchTikTokAdsData(accessToken: string, accountId: string, startDate: string, endDate: string) {
  // TODO: Replace with real TikTok Marketing API call
  console.log(`[TikTok] Would fetch data for account ${accountId} from ${startDate} to ${endDate}`);
  return [];
}

async function fetchLinkedInAdsData(accessToken: string, accountId: string, startDate: string, endDate: string) {
  // TODO: Replace with real LinkedIn Marketing API call
  console.log(`[LinkedIn] Would fetch data for account ${accountId} from ${startDate} to ${endDate}`);
  return [];
}

const fetcherMap: Record<string, typeof fetchMetaAdsData> = {
  meta: fetchMetaAdsData,
  google: fetchGoogleAdsData,
  tiktok: fetchTikTokAdsData,
  linkedin: fetchLinkedInAdsData,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get date range (default: last 7 days)
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const endDate = body.end_date || new Date().toISOString().split("T")[0];
    const startDate = body.start_date || (() => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return d.toISOString().split("T")[0];
    })();

    // Optional: filter by specific account
    const accountFilter = body.account_id;

    let query = supabase.from("ad_accounts").select("*").eq("status", "active");
    if (accountFilter) {
      query = query.eq("id", accountFilter);
    }

    const { data: accounts, error: accountsErr } = await query;
    if (accountsErr) throw accountsErr;

    const results: { account_id: string; platform: string; synced: number; errors: string[] }[] = [];

    for (const account of accounts || []) {
      const fetcher = fetcherMap[account.platform];
      if (!fetcher) {
        results.push({ account_id: account.id, platform: account.platform, synced: 0, errors: [`Unknown platform: ${account.platform}`] });
        continue;
      }

      try {
        const metrics = await fetcher(account.access_token, account.account_id, startDate, endDate);

        if (metrics.length > 0) {
          const rows = metrics.map((m: any) => ({
            account_id: account.id,
            campaign_id: m.campaign_id,
            campaign_name: m.campaign_name,
            date: m.date,
            spend: m.spend || 0,
            impressions: m.impressions || 0,
            clicks: m.clicks || 0,
            conversions: m.conversions || 0,
            ctr: m.ctr || 0,
            cpc: m.cpc || 0,
          }));

          const { error: insertErr } = await supabase
            .from("ad_campaign_metrics")
            .upsert(rows, { onConflict: "account_id,campaign_id,date" });

          if (insertErr) throw insertErr;
        }

        results.push({ account_id: account.id, platform: account.platform, synced: metrics.length, errors: [] });
      } catch (err) {
        console.error(`Error syncing ${account.platform} account ${account.id}:`, err);
        results.push({
          account_id: account.id,
          platform: account.platform,
          synced: 0,
          errors: [err.message || "Unknown error"],
        });

        // Mark account as errored if token issue
        if (err.message?.includes("token") || err.message?.includes("unauthorized")) {
          await supabase.from("ad_accounts").update({ status: "token_expired" }).eq("id", account.id);
        }
      }
    }

    return new Response(JSON.stringify({ synced_accounts: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
