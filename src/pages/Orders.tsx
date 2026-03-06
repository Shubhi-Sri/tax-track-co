import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const orders = [
  { id: "#DT-1042", customer: "Rahul Sharma", product: "Wireless Earbuds", value: "₹2,499", gst: "₹450", status: "Delivered", date: "2026-03-05" },
  { id: "#DT-1041", customer: "Priya Patel", product: "Phone Case Set", value: "₹899", gst: "₹162", status: "Shipped", date: "2026-03-04" },
  { id: "#DT-1040", customer: "Amit Kumar", product: "LED Strip Lights", value: "₹1,299", gst: "₹234", status: "Processing", date: "2026-03-04" },
  { id: "#DT-1039", customer: "Sneha Gupta", product: "Laptop Stand", value: "₹1,799", gst: "₹324", status: "Delivered", date: "2026-03-03" },
  { id: "#DT-1038", customer: "Vikram Singh", product: "Smart Watch Band", value: "₹599", gst: "₹108", status: "Cancelled", date: "2026-03-03" },
  { id: "#DT-1037", customer: "Neha Reddy", product: "Portable Charger", value: "₹1,999", gst: "₹360", status: "Delivered", date: "2026-03-02" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-success/10 text-success",
  Shipped: "bg-info/10 text-info",
  Processing: "bg-warning/10 text-warning",
  Cancelled: "bg-destructive/10 text-destructive",
};

export default function Orders() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage all orders</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search orders..." className="pl-9" />
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
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium text-foreground">{o.id}</TableCell>
                  <TableCell className="text-foreground">{o.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{o.product}</TableCell>
                  <TableCell className="text-foreground">{o.value}</TableCell>
                  <TableCell className="text-muted-foreground">{o.gst}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`border-0 ${statusColors[o.status] || ""}`}>
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{o.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
