import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useInvoices() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*, orders!inner(customer_name, order_total, stores!inner(shopify_store_name))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useGenerateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, isInterstate }: { orderId: string; isInterstate: boolean }) => {
      // Get order details
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();
      if (orderErr) throw orderErr;

      const gstRate = 18;
      const gstAmount = order.order_total * (gstRate / 100);
      const cgst = isInterstate ? 0 : gstAmount / 2;
      const sgst = isInterstate ? 0 : gstAmount / 2;
      const igst = isInterstate ? gstAmount : 0;

      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

      const { data, error } = await supabase.from("invoices").insert({
        order_id: orderId,
        invoice_number: invoiceNumber,
        gst_rate: gstRate,
        cgst,
        sgst,
        igst,
        total_amount: order.order_total + gstAmount,
        status: "Draft",
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
}
