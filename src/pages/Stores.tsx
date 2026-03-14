import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { useStores } from "@/hooks/useStores";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function Stores() {
  const { data: stores, isLoading } = useStores();
  const [shopDomain, setShopDomain] = useState("");
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleConnect = async () => {
    if (!shopDomain) {
      toast.error("Please enter your Shopify store domain");
      return;
    }

    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("shopify-oauth-init", {
        body: { shop_domain: shopDomain },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.auth_url) {
        // Store nonce for CSRF verification
        localStorage.setItem("shopify_oauth_nonce", data.nonce);
        // Redirect to Shopify authorization
        window.location.href = data.auth_url;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate connection");
    } finally {
      setConnecting(false);
    }
  };

  const handleSyncOrders = async (storeId: string) => {
    setSyncing(storeId);
    try {
      const { data, error } = await supabase.functions.invoke("sync-orders", {
        body: { store_id: storeId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Synced ${data?.synced || 0} orders`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnect = async (storeId: string) => {
    try {
      const { error } = await supabase.from("stores").delete().eq("id", storeId);
      if (error) throw error;
      toast.success("Store disconnected");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stores</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your connected Shopify stores</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0 gap-2">
              <Plus className="h-4 w-4" /> Connect Shopify Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Shopify Store</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Enter your Shopify store domain to securely connect via OAuth. You'll be redirected to Shopify to authorize the connection.
              </p>
              <div>
                <Label>Store Domain</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="mystore"
                    value={shopDomain}
                    onChange={(e) => setShopDomain(e.target.value)}
                  />
                  <span className="flex items-center text-sm text-muted-foreground whitespace-nowrap">.myshopify.com</span>
                </div>
              </div>
              <Button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full gradient-primary text-primary-foreground border-0 gap-2"
              >
                {connecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" /> Authorize with Shopify
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Connected</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
              ) : !stores?.length ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No stores connected yet. Click "Connect Shopify Store" to get started.</TableCell></TableRow>
              ) : stores.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-foreground">{s.shopify_store_name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.shop_domain || `${s.shopify_store_name}.myshopify.com`}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "Active" ? "default" : "secondary"} className={s.status === "Active" ? "bg-success/10 text-success border-0" : ""}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleSyncOrders(s.id)}
                        disabled={syncing === s.id}
                      >
                        <RefreshCw className={`h-3 w-3 ${syncing === s.id ? "animate-spin" : ""}`} />
                        Sync
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleDisconnect(s.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
