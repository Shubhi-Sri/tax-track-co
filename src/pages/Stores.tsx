import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const stores = [
  { name: "TrendyDrops", platform: "Shopify", revenue: "₹5,42,000", orders: 342, profit: "₹2,18,000", status: "Active" },
  { name: "GadgetHub", platform: "Shopify", revenue: "₹3,89,000", orders: 256, profit: "₹1,45,000", status: "Active" },
  { name: "FashionVault", platform: "Shopify", revenue: "₹2,14,800", orders: 178, profit: "₹89,000", status: "Paused" },
  { name: "HomeEssentials", platform: "Shopify", revenue: "₹1,00,000", orders: 84, profit: "₹57,000", status: "Active" },
];

export default function Stores() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stores</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your connected stores</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0 gap-2">
          <Plus className="h-4 w-4" /> Connect Shopify Store
        </Button>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((s) => (
                <TableRow key={s.name}>
                  <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.platform}</TableCell>
                  <TableCell className="text-foreground">{s.revenue}</TableCell>
                  <TableCell className="text-foreground">{s.orders}</TableCell>
                  <TableCell className="text-foreground">{s.profit}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "Active" ? "default" : "secondary"} className={s.status === "Active" ? "bg-success/10 text-success border-0" : ""}>
                      {s.status}
                    </Badge>
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
