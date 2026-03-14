import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const storeId = body.store_id;

    if (!storeId) {
      return new Response(JSON.stringify({ error: "store_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get store details (RLS ensures user owns this store)
    const { data: store, error: storeErr } = await supabase
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .single();

    if (storeErr || !store) {
      return new Response(JSON.stringify({ error: "Store not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const shopDomain = store.shop_domain || `${store.shopify_store_name}.myshopify.com`;
    let shopifyOrders: any[] = [];

    if (store.shopify_access_token) {
      try {
        // Fetch orders from Shopify Admin API
        const response = await fetch(
          `https://${shopDomain}/admin/api/2024-01/orders.json?status=any&limit=250`,
          {
            headers: {
              "X-Shopify-Access-Token": store.shopify_access_token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          // Token expired - update store status
          await supabase
            .from("stores")
            .update({ status: "Token Expired" })
            .eq("id", storeId);
          return new Response(JSON.stringify({ error: "Access token expired. Please reconnect your store." }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Shopify rate limit reached. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (response.ok) {
          const result = await response.json();
          shopifyOrders = result.orders || [];
        }
      } catch (e) {
        console.error("Shopify API error:", e);
      }
    }

    if (shopifyOrders.length === 0) {
      return new Response(JSON.stringify({ synced: 0, message: "No orders found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get existing order IDs to avoid duplicates
    const { data: existingOrders } = await supabase
      .from("orders")
      .select("shopify_order_id")
      .eq("store_id", storeId);

    const existingIds = new Set(existingOrders?.map((o) => o.shopify_order_id) || []);

    // Filter out already-synced orders
    const newOrders = shopifyOrders.filter(
      (o: any) => !existingIds.has(String(o.id))
    );

    if (newOrders.length === 0) {
      return new Response(JSON.stringify({ synced: 0, message: "All orders already synced" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ordersToInsert = newOrders.map((o: any) => {
      const totalPrice = parseFloat(o.total_price || "0");
      const totalTax = parseFloat(o.total_tax || "0");
      const shippingLines = o.shipping_lines || [];
      const shippingCost = shippingLines.reduce(
        (s: number, l: any) => s + parseFloat(l.price || "0"),
        0
      );

      return {
        store_id: storeId,
        shopify_order_id: String(o.id),
        customer_name: o.customer
          ? `${o.customer.first_name || ""} ${o.customer.last_name || ""}`.trim()
          : "Unknown",
        product: o.line_items?.[0]?.title || "Unknown",
        order_total: totalPrice,
        revenue: totalPrice,
        gst_amount: totalTax,
        tax: totalTax,
        shipping_cost: shippingCost,
        order_status: o.financial_status === "paid" ? "Delivered" : "Processing",
        order_date: o.created_at || new Date().toISOString(),
      };
    });

    const { data: inserted, error: insertErr } = await supabase
      .from("orders")
      .insert(ordersToInsert)
      .select();

    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({ synced: inserted?.length || 0 }), {
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
