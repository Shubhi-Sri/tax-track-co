import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AdAccount {
  id: string;
  user_id: string;
  platform: string;
  account_name: string | null;
  account_id: string;
  status: string;
  created_at: string;
}

export function useAdAccounts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["ad_accounts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_accounts")
        .select("id, user_id, platform, account_name, account_id, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AdAccount[];
    },
  });
}

export function useConnectAdAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { platform: string; account_id: string; account_name: string; access_token: string; refresh_token?: string }) => {
      const { data, error } = await supabase.functions.invoke("connect-ad-account", {
        body: payload,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ad_accounts"] }),
  });
}

export function useDisconnectAdAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase.from("ad_accounts").delete().eq("id", accountId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ad_accounts"] }),
  });
}
