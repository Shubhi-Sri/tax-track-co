import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const revenueVsCost = [
  { month: "Jan", revenue: 420000, cost: 280000 },
  { month: "Feb", revenue: 380000, cost: 250000 },
  { month: "Mar", revenue: 510000, cost: 310000 },
  { month: "Apr", revenue: 470000, cost: 300000 },
  { month: "May", revenue: 620000, cost: 370000 },
  { month: "Jun", revenue: 580000, cost: 340000 },
];

const profitByStore = [
  { name: "TrendyDrops", value: 218000, color: "hsl(221, 83%, 53%)" },
  { name: "GadgetHub", value: 145000, color: "hsl(263, 70%, 58%)" },
  { name: "FashionVault", value: 89000, color: "hsl(142, 71%, 45%)" },
  { name: "HomeEssentials", value: 57000, color: "hsl(38, 92%, 50%)" },
];

const topProducts = [
  { name: "Wireless Earbuds", profit: 125000 },
  { name: "Smart Watch Band", profit: 98000 },
  { name: "LED Strip Lights", profit: 87000 },
  { name: "Laptop Stand", profit: 72000 },
  { name: "Portable Charger", profit: 65000 },
];

export default function ProfitAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profit Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep dive into your profitability</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border">
          <CardContent className="pt-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Revenue vs Cost</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueVsCost}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" fill="hsl(263, 70%, 58%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardContent className="pt-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Profit by Store</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={profitByStore} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {profitByStore.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {profitByStore.map((entry) => (
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
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Products by Profit</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-5">{i + 1}.</span>
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">₹{(p.profit / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
