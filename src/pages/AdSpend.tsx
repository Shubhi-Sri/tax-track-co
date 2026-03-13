import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Eye, MousePointer, Target, TrendingUp, BarChart3, Plus } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { useAdMetricsSummary } from "@/hooks/useAdMetrics";
import { useAdAccounts } from "@/hooks/useAdAccounts";
import { useNavigate } from "react-router-dom";

const platformColors: Record<string, string> = {
  meta: "hsl(221, 83%, 53%)",
  google: "hsl(142, 71%, 45%)",
  tiktok: "hsl(263, 70%, 58%)",
  linkedin: "hsl(38, 92%, 50%)",
};

const platformLabels: Record<string, string> = {
  meta: "Meta Ads",
  google: "Google Ads",
  tiktok: "TikTok Ads",
  linkedin: "LinkedIn Ads",
};

const fmt = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtShort = (n: number) => {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString("en-IN");
};

export default function AdSpend() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<string>("30");

  const startDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - parseInt(dateRange));
    return d.toISOString().split("T")[0];
  }, [dateRange]);

  const { data: metrics, summary, isLoading } = useAdMetricsSummary({
    startDate,
    platform: platform === "all" ? undefined : platform,
    campaignName: search || undefined,
  });

  const { data: accounts } = useAdAccounts();

  // Aggregate daily spend for chart
  const dailySpend = useMemo(() => {
    if (!metrics?.length) return [];
    const map: Record<string, number> = {};
    metrics.forEach((m: any) => {
      map[m.date] = (map[m.date] || 0) + m.spend;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, spend]) => ({ date: new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), spend }));
  }, [metrics]);

  // Platform breakdown for pie chart
  const platformBreakdown = useMemo(() => {
    if (!metrics?.length) return [];
    const map: Record<string, number> = {};
    metrics.forEach((m: any) => {
      const p = m.platform || "unknown";
      map[p] = (map[p] || 0) + m.spend;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: platformLabels[name] || name,
      value,
      color: platformColors[name] || "hsl(215, 16%, 47%)",
    }));
  }, [metrics]);

  // Top campaigns
  const campaignData = useMemo(() => {
    if (!metrics?.length) return [];
    const map: Record<string, { spend: number; impressions: number; clicks: number; conversions: number; platform: string }> = {};
    metrics.forEach((m: any) => {
      if (!map[m.campaign_name]) {
        map[m.campaign_name] = { spend: 0, impressions: 0, clicks: 0, conversions: 0, platform: m.platform };
      }
      map[m.campaign_name].spend += m.spend;
      map[m.campaign_name].impressions += m.impressions;
      map[m.campaign_name].clicks += m.clicks;
      map[m.campaign_name].conversions += m.conversions;
    });
    return Object.entries(map)
      .map(([name, d]) => ({
        name,
        ...d,
        ctr: d.impressions > 0 ? ((d.clicks / d.impressions) * 100).toFixed(2) : "0",
        cpc: d.clicks > 0 ? (d.spend / d.clicks).toFixed(2) : "0",
        roas: d.spend > 0 ? ((d.conversions * 500) / d.spend).toFixed(1) : "0",
      }))
      .sort((a, b) => b.spend - a.spend);
  }, [metrics]);

  const hasAccounts = (accounts?.length || 0) > 0;
  const hasData = (metrics?.length || 0) > 0;

  const kpis = [
    { label: "Total Ad Spend", value: summary ? fmt(summary.totalSpend) : "₹0", icon: DollarSign, color: "text-primary" },
    { label: "Impressions", value: summary ? fmtShort(summary.totalImpressions) : "0", icon: Eye, color: "text-secondary" },
    { label: "Clicks", value: summary ? fmtShort(summary.totalClicks) : "0", icon: MousePointer, color: "text-success" },
    { label: "Conversions", value: summary ? fmtShort(summary.totalConversions) : "0", icon: Target, color: "text-warning" },
    { label: "Avg CTR", value: summary ? `${summary.avgCTR.toFixed(2)}%` : "0%", icon: TrendingUp, color: "text-primary" },
    { label: "Avg CPC", value: summary ? fmt(summary.avgCPC) : "₹0", icon: BarChart3, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ad Spend Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor campaign performance across platforms</p>
        </div>
        <Button onClick={() => navigate("/ad-accounts")} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Connect Account
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="meta">Meta Ads</SelectItem>
            <SelectItem value="google">Google Ads</SelectItem>
            <SelectItem value="tiktok">TikTok Ads</SelectItem>
            <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search campaigns..."
          className="max-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-card border-border">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-muted-foreground">{k.label}</span>
                <k.icon className={`h-3.5 w-3.5 ${k.color} opacity-60`} />
              </div>
              <p className="text-lg font-bold text-foreground">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!hasAccounts && !isLoading && (
        <Card className="shadow-card border-border">
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Ad Accounts Connected</h3>
            <p className="text-sm text-muted-foreground mb-4">Connect your ad platforms to start tracking spend and performance.</p>
            <Button onClick={() => navigate("/ad-accounts")}>
              <Plus className="h-4 w-4 mr-1.5" />
              Connect Ad Account
            </Button>
          </CardContent>
        </Card>
      )}

      {(hasData || hasAccounts) && (
        <>
          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-card border-border">
              <CardContent className="pt-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Daily Ad Spend</h3>
                {dailySpend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dailySpend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v: number) => fmt(v)} />
                      <Bar dataKey="spend" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">No data for selected period</div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardContent className="pt-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Spend by Platform</h3>
                {platformBreakdown.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={platformBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                          {platformBreakdown.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => fmt(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                      {platformBreakdown.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          {entry.name}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No data</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Campaign Table */}
          <Card className="shadow-card border-border">
            <CardContent className="p-0">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Campaign Performance</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Spend</TableHead>
                    <TableHead className="text-right">Impressions</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                    <TableHead className="text-right">CPC</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead className="text-right">ROAS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignData.length > 0 ? (
                    campaignData.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="border-0 text-xs">
                            {platformLabels[c.platform] || c.platform}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-foreground">{fmt(c.spend)}</TableCell>
                        <TableCell className="text-right text-foreground">{fmtShort(c.impressions)}</TableCell>
                        <TableCell className="text-right text-foreground">{fmtShort(c.clicks)}</TableCell>
                        <TableCell className="text-right text-foreground">{c.ctr}%</TableCell>
                        <TableCell className="text-right text-foreground">{fmt(Number(c.cpc))}</TableCell>
                        <TableCell className="text-right text-foreground">{c.conversions}</TableCell>
                        <TableCell className="text-right font-semibold text-success">{c.roas}x</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        {isLoading ? "Loading..." : "No campaign data yet. Connect an ad account to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
