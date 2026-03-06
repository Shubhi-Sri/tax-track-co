import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useStores } from "@/hooks/useStores";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const { data: stores } = useStores();
  const updateProfile = useUpdateProfile();

  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [currency, setCurrency] = useState("");
  const [email, setEmail] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setBusinessName(profile.business_name || "");
    setGstin(profile.gstin || "");
    setCurrency(profile.currency || "INR");
    setEmail(profile.email || "");
    setInitialized(true);
  }

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        business_name: businessName,
        gstin,
        currency,
        email,
      });
      toast.success("Settings saved!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>;
  }

  const integrations = [
    { name: "Shopify", status: stores?.length ? "Connected" : "Not Connected" },
    { name: "Facebook Ads", status: "Not Connected" },
    { name: "Google Ads", status: "Not Connected" },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your business configuration</p>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Business Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Business Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">GSTIN</Label>
              <Input value={gstin} onChange={(e) => setGstin(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Currency</Label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">API Integrations</h3>
          <Separator />
          <div className="space-y-3">
            {integrations.map((api) => (
              <div key={api.name} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-foreground">{api.name}</span>
                <Badge
                  variant="secondary"
                  className={`border-0 ${api.status === "Connected" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
                >
                  {api.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateProfile.isPending} className="gradient-primary text-primary-foreground border-0">
        {updateProfile.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
