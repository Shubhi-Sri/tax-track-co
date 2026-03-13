import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { useAdAccounts, useConnectAdAccount, useDisconnectAdAccount } from "@/hooks/useAdAccounts";
import { useState } from "react";
import { toast } from "sonner";

const platforms = [
  { value: "meta", label: "Meta Ads", description: "Facebook & Instagram Marketing API", icon: "📘" },
  { value: "google", label: "Google Ads", description: "Google Ads API", icon: "🔍" },
  { value: "tiktok", label: "TikTok Ads", description: "TikTok Marketing API", icon: "🎵" },
  { value: "linkedin", label: "LinkedIn Ads", description: "LinkedIn Marketing API", icon: "💼" },
];

export default function AdAccounts() {
  const { data: accounts, isLoading } = useAdAccounts();
  const connectMutation = useConnectAdAccount();
  const disconnectMutation = useDisconnectAdAccount();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ platform: "", account_id: "", account_name: "", access_token: "" });

  const handleConnect = async () => {
    if (!form.platform || !form.account_id || !form.access_token) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await connectMutation.mutateAsync(form);
      toast.success("Ad account connected successfully");
      setOpen(false);
      setForm({ platform: "", account_id: "", account_name: "", access_token: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to connect account");
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      await disconnectMutation.mutateAsync(id);
      toast.success("Ad account disconnected");
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ad Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect and manage your advertising platforms</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Connect Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Ad Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                  <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="flex items-center gap-2">
                          <span>{p.icon}</span>
                          <span>{p.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Account ID</Label>
                <Input
                  placeholder="e.g. act_123456789"
                  value={form.account_id}
                  onChange={(e) => setForm({ ...form, account_id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Name (optional)</Label>
                <Input
                  placeholder="e.g. My Business Account"
                  value={form.account_name}
                  onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Access Token</Label>
                <Input
                  type="password"
                  placeholder="Paste your access token"
                  value={form.access_token}
                  onChange={(e) => setForm({ ...form, access_token: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  {form.platform === "meta" && "Get from Meta Business Suite → Settings → Advanced → System User Token"}
                  {form.platform === "google" && "Get from Google Ads API Console → OAuth credentials"}
                  {form.platform === "tiktok" && "Get from TikTok Marketing API → App Management → Access Token"}
                  {form.platform === "linkedin" && "Get from LinkedIn Marketing Developer Portal → OAuth Token"}
                  {!form.platform && "Select a platform first"}
                </p>
              </div>
              <Button onClick={handleConnect} className="w-full" disabled={connectMutation.isPending}>
                {connectMutation.isPending ? "Connecting..." : "Connect Account"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Platform Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((p) => {
          const connected = accounts?.filter((a) => a.platform === p.value) || [];
          return (
            <Card key={p.value} className="shadow-card border-border">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{p.label}</h3>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                </div>
                <div className="mt-3">
                  {connected.length > 0 ? (
                    <Badge variant="secondary" className="text-success border-success/20 bg-success/10">
                      {connected.length} connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">Not connected</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connected Accounts List */}
      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Connected Accounts</h3>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : (accounts?.length || 0) > 0 ? (
            <div className="divide-y divide-border">
              {accounts?.map((account) => {
                const p = platforms.find((pl) => pl.value === account.platform);
                return (
                  <div key={account.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p?.icon || "📊"}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {account.account_name || account.account_id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p?.label} · {account.account_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={account.status === "active"
                          ? "text-success border-success/20 bg-success/10"
                          : "text-destructive border-destructive/20 bg-destructive/10"
                        }
                      >
                        {account.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(account.id)}
                        disabled={disconnectMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No ad accounts connected yet. Click "Connect Account" to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
