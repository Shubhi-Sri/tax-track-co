import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign } from "lucide-react";

const campaigns = [
  { name: "Summer Sale - Earbuds", platform: "Facebook Ads", spend: "₹45,000", revenue: "₹1,80,000", roas: "4.0x" },
  { name: "Retargeting - Cart Abandon", platform: "Facebook Ads", spend: "₹22,000", revenue: "₹1,10,000", roas: "5.0x" },
  { name: "Brand Awareness", platform: "Google Ads", spend: "₹35,000", revenue: "₹87,500", roas: "2.5x" },
  { name: "Product Launch - Watches", platform: "Facebook Ads", spend: "₹60,000", revenue: "₹2,40,000", roas: "4.0x" },
  { name: "Search - Electronics", platform: "Google Ads", spend: "₹28,000", revenue: "₹98,000", roas: "3.5x" },
  { name: "Lookalike Audience", platform: "Facebook Ads", spend: "₹18,000", revenue: "₹54,000", roas: "3.0x" },
];

const totalSpend = "₹3,24,500";

export default function AdSpend() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ad Spend</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor campaign performance</p>
      </div>

      <Card className="shadow-card border-border max-w-xs">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Total Ad Spend</span>
            <DollarSign className="h-4 w-4 text-muted-foreground/50" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalSpend}</p>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>ROAS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="border-0 text-xs">
                      {c.platform}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">{c.spend}</TableCell>
                  <TableCell className="text-foreground">{c.revenue}</TableCell>
                  <TableCell className="font-semibold text-success">{c.roas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
