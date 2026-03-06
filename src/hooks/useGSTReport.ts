import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useGSTReport() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["gst-report", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*, orders!inner(order_total, order_date, stores!inner(user_id))");
      if (error) throw error;

      // Aggregate by month
      const monthlyMap = new Map<string, { revenue: number; cgst: number; sgst: number; igst: number }>();

      for (const inv of data) {
        const date = new Date(inv.orders.order_date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const label = date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

        if (!monthlyMap.has(key)) {
          monthlyMap.set(key, { revenue: 0, cgst: 0, sgst: 0, igst: 0 });
        }
        const entry = monthlyMap.get(key)!;
        entry.revenue += inv.orders.order_total;
        entry.cgst += inv.cgst;
        entry.sgst += inv.sgst;
        entry.igst += inv.igst;
      }

      const totalCGST = data.reduce((s, i) => s + i.cgst, 0);
      const totalSGST = data.reduce((s, i) => s + i.sgst, 0);
      const totalIGST = data.reduce((s, i) => s + i.igst, 0);

      return {
        summary: {
          outputGST: totalCGST + totalSGST + totalIGST,
          inputGST: 0, // placeholder - would come from purchase records
          netPayable: totalCGST + totalSGST + totalIGST,
          totalCGST,
          totalSGST,
          totalIGST,
        },
        monthly: Array.from(monthlyMap.entries())
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([key, val]) => {
            const [y, m] = key.split("-");
            const label = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
            return { month: label, ...val };
          }),
      };
    },
    enabled: !!user,
  });
}
