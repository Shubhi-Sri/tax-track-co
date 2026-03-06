import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, ShoppingCart, Receipt, FileText } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

const metrics = [
  { label: "Total Revenue", value: "₹12,45,800", change: "+12.5%", icon: DollarSign, positive: true },
  { label: "Total Ad Spend", value: "₹3,24,500", change: "+8.2%", icon: TrendingUp, positive: false },
  { label: "Total Product Cost", value: "₹4,12,300", change: "-3.1%", icon: ShoppingCart, positive: true },
  { label: "Total Profit", value: "₹5,09,000", change: "+18.7%", icon: Receipt, positive: true },
  { label: "GST Payable", value: "₹92,400", change: "+5.3%", icon: FileText, positive: false },
];

const revenueData = [
  { month: "Jan", revenue: 420000, adSpend: 110000 },
  { month: "Feb", revenue: 380000, adSpend: 95000 },
  { month: "Mar", revenue: 510000, adSpend: 130000 },
  { month: "Apr", revenue: 470000, adSpend: 125000 },
  { month: "May", revenue: 620000, adSpend: 150000 },
  { month: "Jun", revenue: 580000, adSpend: 140000 },
  { month: "Jul", revenue: 710000, adSpend: 165000 },
];

const profitBreakdown = [
  { name: "Product Cost", value: 41, color: "hsl(221, 83%, 53%)" },
  { name: "Ad Spend", value: 26, color: "hsl(263, 70%, 58%)" },
  { name: "Profit", value: 33, color: "hsl(142, 71%, 45%)" },
];

const dailyRevenue = [
  { day: "Mon", revenue: 82000 },
  { day: "Tue", revenue: 95000 },
  { day: "Wed", revenue: 78000 },
  { day: "Thu", revenue: 110000 },
  { day: "Fri", revenue: 125000 },
  { day: "Sat", revenue: 98000 },
  { day: "Sun", revenue: 72000 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your business metrics</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="shadow-card border-border">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
                <m.icon className="h-4 w-4 text-muted-foreground/50" />
              </div>
              <p className="text-xl font-bold text-foreground">{m.value}</p>
              <span className={`text-xs font-medium ${m.positive ? "text-success" : "text-warning"}`}>
                {m.change}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card border-border">
          <CardContent className="pt-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Revenue vs Ad Spend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="adSpend" stroke="hsl(263, 70%, 58%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardContent className="pt-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Profit Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={profitBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {profitBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {profitBreakdown.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="pt-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Daily Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
