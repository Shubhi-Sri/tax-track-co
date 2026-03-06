import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useStores, useConnectStore } from "@/hooks/useStores";
import { toast } from "sonner";

export default function Stores() {
  const { data: stores, isLoading } = useStores();
  const connectStore = useConnectStore();
  const [storeName, setStoreName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [open, setOpen] = useState(false);

  const handleConnect = async () => {
    if (!storeName || !accessToken) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await connectStore.mutateAsync({ storeName, accessToken });
      toast.success("Store connected!");
      setOpen(false);
      setStoreName("");
      setAccessToken("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stores</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your connected stores</p>
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
              <div>
                <Label>Store Name</Label>
                <Input placeholder="my-store" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Access Token</Label>
                <Input placeholder="shpat_..." value={accessToken} onChange={(e) => setAccessToken(e.target.value)} className="mt-1" type="password" />
              </div>
              <Button onClick={handleConnect} disabled={connectStore.isPending} className="w-full gradient-primary text-primary-foreground border-0">
                {connectStore.isPending ? "Connecting..." : "Connect Store"}
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
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Connected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
              ) : !stores?.length ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No stores connected yet</TableCell></TableRow>
              ) : stores.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-foreground">{s.shopify_store_name}</TableCell>
                  <TableCell className="text-muted-foreground">Shopify</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "Active" ? "default" : "secondary"} className={s.status === "Active" ? "bg-success/10 text-success border-0" : ""}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
