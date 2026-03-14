import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const shop = url.searchParams.get("shop");
    const state = url.searchParams.get("state");

    if (!code || !shop) {
      return redirectWithError("Missing code or shop parameter");
    }

    const clientId = Deno.env.get("SHOPIFY_API_KEY");
    const clientSecret = Deno.env.get("SHOPIFY_API_SECRET");

    if (!clientId || !clientSecret) {
      return redirectWithError("Shopify credentials not configured");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Token exchange failed:", errText);
      return redirectWithError("Failed to exchange authorization code");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return redirectWithError("No access token received");
    }

    // Fetch shop info
    let shopName = shop.replace(".myshopify.com", "");
    try {
      const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
        headers: { "X-Shopify-Access-Token": accessToken },
      });
      if (shopResponse.ok) {
        const shopData = await shopResponse.json();
        shopName = shopData.shop?.name || shopName;
      }
    } catch (e) {
      console.error("Failed to fetch shop info:", e);
    }

    // Store the credentials - we pass them as URL params to the frontend
    // The frontend will then save them via authenticated Supabase call
    const appUrl = Deno.env.get("APP_URL") || "https://tax-track-co.lovable.app";
    const redirectUrl = new URL(`${appUrl}/shopify-callback`);
    redirectUrl.searchParams.set("shop", shop);
    redirectUrl.searchParams.set("shop_name", shopName);
    redirectUrl.searchParams.set("token", accessToken);
    redirectUrl.searchParams.set("state", state || "");

    return new Response(null, {
      status: 302,
      headers: { Location: redirectUrl.toString() },
    });
  } catch (err) {
    console.error("OAuth callback error:", err);
    return redirectWithError(err.message);
  }
});

function redirectWithError(message: string) {
  const appUrl = Deno.env.get("APP_URL") || "https://tax-track-co.lovable.app";
  const redirectUrl = new URL(`${appUrl}/shopify-callback`);
  redirectUrl.searchParams.set("error", message);
  return new Response(null, {
    status: 302,
    headers: { Location: redirectUrl.toString() },
  });
}
