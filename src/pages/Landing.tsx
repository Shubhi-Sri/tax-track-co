import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Shield,
  BarChart3,
  FileText,
  Store,
  Zap,
  Check,
  ArrowRight,
} from "lucide-react";

const features = [
  { icon: TrendingUp, title: "Profit Analytics", desc: "Track revenue, costs, and profit across all your stores in real-time." },
  { icon: Shield, title: "GST Compliance", desc: "Automated GST calculations and report generation for hassle-free filing." },
  { icon: BarChart3, title: "Ad Spend Tracking", desc: "Monitor Facebook & Google Ads spend with ROAS analytics." },
  { icon: FileText, title: "Invoice Generation", desc: "Create and manage professional invoices with GST details." },
  { icon: Store, title: "Multi-Store Support", desc: "Connect and manage multiple Shopify stores from one dashboard." },
  { icon: Zap, title: "Real-time Sync", desc: "Automatic data sync with your stores and ad platforms." },
];

const plans = [
  { name: "Starter", price: "₹999", period: "/mo", features: ["1 Store", "Basic Analytics", "GST Reports", "Email Support"], popular: false },
  { name: "Growth", price: "₹2,499", period: "/mo", features: ["5 Stores", "Advanced Analytics", "Ad Spend Tracking", "Invoice Generation", "Priority Support"], popular: true },
  { name: "Agency", price: "₹4,999", period: "/mo", features: ["Unlimited Stores", "Full Analytics Suite", "All Integrations", "White Label", "Dedicated Support"], popular: false },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            Drop<span className="text-primary">Tax</span>
          </span>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <Zap className="h-3 w-3" /> Built for Dropshipping Agencies
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Manage Dropshipping Profit & GST in One Dashboard
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track store revenue, monitor ad spend, analyze profit margins, and stay GST compliant — all from a single, powerful dashboard built for agencies.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/login">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 gap-2 px-6">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl border border-border shadow-floating bg-card p-2">
            <div className="rounded-lg bg-muted/50 h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-primary/40" />
                <p className="text-sm font-medium">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">Everything you need to scale</h2>
            <p className="mt-3 text-muted-foreground">Powerful tools designed for dropshipping agencies</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="shadow-card border-border hover:shadow-elevated transition-shadow">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">Simple, transparent pricing</h2>
            <p className="mt-3 text-muted-foreground">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`shadow-card border-border relative ${plan.popular ? "ring-2 ring-primary shadow-elevated" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-primary text-primary-foreground text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <CardContent className="pt-8 pb-6">
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-success shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 ${plan.popular ? "gradient-primary text-primary-foreground border-0" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-tight">
            Drop<span className="text-primary">Tax</span>
          </span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Support</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 DropTax. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
