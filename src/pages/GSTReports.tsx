import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";

const gstSummary = [
  { label: "Output GST", value: "₹2,24,244" },
  { label: "Input GST", value: "₹1,31,844" },
  { label: "Net GST Payable", value: "₹92,400" },
];

const monthlyReports = [
  { month: "March 2026", revenue: "₹7,10,000", collected: "₹1,27,800", paid: "₹74,200", payable: "₹53,600" },
  { month: "February 2026", revenue: "₹5,80,000", collected: "₹1,04,400", paid: "₹62,100", payable: "₹42,300" },
  { month: "January 2026", revenue: "₹4,20,000", collected: "₹75,600", paid: "₹48,900", payable: "₹26,700" },
  { month: "December 2025", revenue: "₹6,20,000", collected: "₹1,11,600", paid: "₹67,800", payable: "₹43,800" },
  { month: "November 2025", revenue: "₹5,10,000", collected: "₹91,800", paid: "₹55,400", payable: "₹36,400" },
];

export default function GSTReports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">GST Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">GST compliance and filing data</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0 gap-2">
          <Download className="h-4 w-4" /> Export GST Report
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {gstSummary.map((g) => (
          <Card key={g.label} className="shadow-card border-border">
            <CardContent className="pt-5 pb-4">
              <span className="text-xs font-medium text-muted-foreground">{g.label}</span>
              <p className="text-xl font-bold text-foreground mt-1">{g.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>GST Collected</TableHead>
                <TableHead>GST Paid</TableHead>
                <TableHead>GST Payable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyReports.map((r) => (
                <TableRow key={r.month}>
                  <TableCell className="font-medium text-foreground">{r.month}</TableCell>
                  <TableCell className="text-foreground">{r.revenue}</TableCell>
                  <TableCell className="text-foreground">{r.collected}</TableCell>
                  <TableCell className="text-foreground">{r.paid}</TableCell>
                  <TableCell className="font-semibold text-foreground">{r.payable}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
