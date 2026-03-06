import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { useGSTReport } from "@/hooks/useGSTReport";

export default function GSTReports() {
  const { data: report, isLoading } = useGSTReport();

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const gstSummary = report
    ? [
        { label: "Output GST", value: fmt(report.summary.outputGST) },
        { label: "Input GST", value: fmt(report.summary.inputGST) },
        { label: "Net GST Payable", value: fmt(report.summary.netPayable) },
      ]
    : [
        { label: "Output GST", value: "₹0" },
        { label: "Input GST", value: "₹0" },
        { label: "Net GST Payable", value: "₹0" },
      ];

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
                <TableHead>CGST</TableHead>
                <TableHead>SGST</TableHead>
                <TableHead>IGST</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center text-muted-foreground py-8">Loading...</td></tr>
              ) : !report?.monthly?.length ? (
                <tr><td colSpan={5} className="text-center text-muted-foreground py-8">No GST data yet</td></tr>
              ) : report.monthly.map((r) => (
                <TableRow key={r.month}>
                  <TableCell className="font-medium text-foreground">{r.month}</TableCell>
                  <TableCell className="text-foreground">{fmt(r.revenue)}</TableCell>
                  <TableCell className="text-foreground">{fmt(r.cgst)}</TableCell>
                  <TableCell className="text-foreground">{fmt(r.sgst)}</TableCell>
                  <TableCell className="font-semibold text-foreground">{fmt(r.igst)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
