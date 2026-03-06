import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download } from "lucide-react";

const invoices = [
  { number: "INV-2026-042", client: "TrendyDrops Store", amount: "₹45,000", gst: "₹8,100", status: "Paid" },
  { number: "INV-2026-041", client: "GadgetHub Store", amount: "₹32,000", gst: "₹5,760", status: "Pending" },
  { number: "INV-2026-040", client: "FashionVault Store", amount: "₹28,500", gst: "₹5,130", status: "Paid" },
  { number: "INV-2026-039", client: "HomeEssentials Store", amount: "₹18,000", gst: "₹3,240", status: "Overdue" },
  { number: "INV-2026-038", client: "TrendyDrops Store", amount: "₹52,000", gst: "₹9,360", status: "Paid" },
];

const statusColors: Record<string, string> = {
  Paid: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Overdue: "bg-destructive/10 text-destructive",
};

export default function Invoices() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and generate invoices</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0 gap-2">
          <Plus className="h-4 w-4" /> Generate Invoice
        </Button>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.number}>
                  <TableCell className="font-medium text-foreground">{inv.number}</TableCell>
                  <TableCell className="text-foreground">{inv.client}</TableCell>
                  <TableCell className="text-foreground">{inv.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.gst}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`border-0 ${statusColors[inv.status] || ""}`}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                      <Download className="h-3 w-3" /> PDF
                    </Button>
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
