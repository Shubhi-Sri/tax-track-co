import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function ShopifyCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting your Shopify store...");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setStatus("error");
      setMessage(error);
      toast.error(error);
      setTimeout(() => navigate("/stores"), 3000);
      return;
    }

    const shop = searchParams.get("shop");
    const shopName = searchParams.get("shop_name");
    const token = searchParams.get("token");

    if (!shop || !token || !user) {
      setStatus("error");
      setMessage("Missing connection data. Please try again.");
      setTimeout(() => navigate("/stores"), 3000);
      return;
    }

    const saveStore = async () => {
      try {
        // Check if store already exists
        const { data: existing } = await supabase
          .from("stores")
          .select("id")
          .eq("shop_domain", shop)
          .eq("user_id", user.id)
          .maybeSingle();

        if (existing) {
          // Update existing store
          await supabase
            .from("stores")
            .update({
              shopify_access_token: token,
              shopify_store_name: shopName || shop.replace(".myshopify.com", ""),
              status: "Active",
            })
            .eq("id", existing.id);
        } else {
          // Insert new store
          const { error: insertErr } = await supabase.from("stores").insert({
            user_id: user.id,
            shopify_store_name: shopName || shop.replace(".myshopify.com", ""),
            shop_domain: shop,
            shopify_access_token: token,
            status: "Active",
          });
          if (insertErr) throw insertErr;
        }

        setStatus("success");
        setMessage("Store connected successfully!");
        toast.success("Shopify store connected!");
        setTimeout(() => navigate("/stores"), 2000);
      } catch (err: any) {
        console.error("Save store error:", err);
        setStatus("error");
        setMessage(err.message || "Failed to save store");
        toast.error("Failed to connect store");
        setTimeout(() => navigate("/stores"), 3000);
      }
    };

    saveStore();
  }, [searchParams, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full shadow-card border-border">
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
          {status === "loading" && (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-10 w-10 text-success" />
          )}
          {status === "error" && (
            <XCircle className="h-10 w-10 text-destructive" />
          )}
          <p className="text-foreground font-medium">{message}</p>
          <p className="text-sm text-muted-foreground">
            {status === "loading" ? "Please wait..." : "Redirecting to stores..."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
