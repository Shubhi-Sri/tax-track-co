import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useStores } from "@/hooks/useStores";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const statusColors: Record<string, string> = {
  Delivered: "bg-success/10 text-success",
  Shipped: "bg-info/10 text-info",
  Processing: "bg-warning/10 text-warning",
  Cancelled: "bg-destructive/10 text-destructive",
};

export default function Orders() {
  const { data: orders, isLoading } = useOrders();
  const { data: stores } = useStores();
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const handleSync = async () => {
    if (!stores?.length) {
      toast.error("Connect a store first");
      return;
    }
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-orders", {
        body: null,
        headers: {},
      });
      // Use query params approach
      const response = await supabase.functions.invoke("sync-orders", {
        body: null,
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Orders synced!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const filtered = orders?.filter(o =>
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.shopify_order_id.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage all orders</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleSync} disabled={syncing}>
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> Sync Orders
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search orders..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
              ) : !filtered?.length ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No orders found</TableCell></TableRow>
              ) : filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium text-foreground">{o.shopify_order_id}</TableCell>
                  <TableCell className="text-foreground">{o.customer_name}</TableCell>
                  <TableCell className="text-muted-foreground">{o.product}</TableCell>
                  <TableCell className="text-foreground">{formatCurrency(o.order_total)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatCurrency(o.gst_amount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`border-0 ${statusColors[o.order_status] || ""}`}>
                      {o.order_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(o.order_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
