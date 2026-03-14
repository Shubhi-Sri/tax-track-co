import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { shop_domain } = await req.json();

    if (!shop_domain) {
      return new Response(JSON.stringify({ error: "shop_domain is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normalize domain
    const cleanDomain = shop_domain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .replace(/\.myshopify\.com$/, "");
    const shopDomain = `${cleanDomain}.myshopify.com`;

    const clientId = Deno.env.get("SHOPIFY_API_KEY");
    if (!clientId) {
      return new Response(JSON.stringify({ error: "Shopify API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const scopes = "read_orders,read_products,read_inventory,read_customers,read_analytics";
    const redirectUri = `${Deno.env.get("SUPABASE_URL")}/functions/v1/shopify-oauth-callback`;

    // Generate a random nonce for CSRF protection
    const nonce = crypto.randomUUID();

    const authUrl = `https://${shopDomain}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${nonce}`;

    return new Response(JSON.stringify({ auth_url: authUrl, nonce, shop_domain: shopDomain }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
