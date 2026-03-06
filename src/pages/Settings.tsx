import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
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
              <Input defaultValue="DropShip Agency Pvt Ltd" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">GSTIN</Label>
              <Input defaultValue="27AAPFU0939F1ZV" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Currency</Label>
              <Input defaultValue="INR (₹)" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input defaultValue="admin@dropshipagency.in" className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Tax Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Default GST Rate</Label>
              <Input defaultValue="18%" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Tax Filing Frequency</Label>
              <Input defaultValue="Monthly" className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">API Integrations</h3>
          <Separator />
          <div className="space-y-3">
            {[
              { name: "Shopify", status: "Connected" },
              { name: "Facebook Ads", status: "Connected" },
              { name: "Google Ads", status: "Not Connected" },
            ].map((api) => (
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

      <Button className="gradient-primary text-primary-foreground border-0">Save Changes</Button>
    </div>
  );
}
