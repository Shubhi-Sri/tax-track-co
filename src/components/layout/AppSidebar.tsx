import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  FileText,
  Receipt,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Stores", url: "/stores", icon: Store },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Ad Spend", url: "/ad-spend", icon: DollarSign },
  { title: "Profit Analytics", url: "/profit-analytics", icon: TrendingUp },
  { title: "GST Reports", url: "/gst-reports", icon: FileText },
  { title: "Invoices", url: "/invoices", icon: Receipt },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-200 sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="h-14 flex items-center px-4 border-b border-border justify-between">
        {!collapsed && (
          <span className="text-lg font-bold text-foreground tracking-tight">
            Drop<span className="text-primary">Tax</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
