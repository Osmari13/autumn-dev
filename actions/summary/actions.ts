'use client';

import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export type ProviderStats = {
  providerId: string;
  providerName: string;
  totalPaid: number;
  totalPayments: number;
  lastPayment: Date | null;
  mostUsedPaymentMethod: string | null;
};

export type IncomeStats = {
  totalIncome: number;
  totalTransactions: number;
  from: Date | null;
  to: Date | null;
};

export type PendingClient = {
  clientId: string;
  clientName: string;
  pendingAmount: number;
  transactionsCount: number;
};

export type ProfitStats = {
  totalIncome: number
  totalExpenses: number
  netProfit: number
}

export type SummaryData = {
  providerStats: ProviderStats[];
  income: IncomeStats;
  pendingClients: PendingClient[];
  profit: ProfitStats; 
};

export const useGetSummary = () => {
  const params = useSearchParams();

  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const summaryQuery = useQuery<SummaryData>({
    queryKey: ["dashboardSummary", from, to],
    queryFn: async () => {
      const { data } = await axios.get('/api/summary', {
        params: { from, to },
      });

      // Adaptar y transformar la respuesta de la API al tipo SummaryData
      const providerStats: ProviderStats[] = (data.providerStats || []).map(
        (p: any) => ({
          providerId: p.providerId,
          providerName: p.providerName,
          totalPaid: p.totalPaid,
          totalPayments: p.totalPayments,
          lastPayment: p.lastPayment ? new Date(p.lastPayment) : null,
          mostUsedPaymentMethod: p.mostUsedPaymentMethod ?? null,
        })
      );

      const income: IncomeStats = {
        totalIncome: data.income?.totalIncome || 0,
        totalTransactions: data.income?.totalTransactions || 0,
        from: data.income?.from ? new Date(data.income.from) : null,
        to: data.income?.to ? new Date(data.income.to) : null,
      };

      const pendingClients: PendingClient[] = (data.pendingClients || []).map(
        (c: any) => ({
          clientId: c.clientId,
          clientName: c.clientName,
          pendingAmount: c.pendingAmount,
          transactionsCount: c.transactionsCount,
        })
      );

      const profit: ProfitStats = {
        totalIncome: data.profit?.totalIncome || 0,
        totalExpenses: data.profit?.totalExpenses || 0,
        netProfit: data.profit?.netProfit || 0,
      };

      return {
        providerStats,
        income,
        pendingClients,
        profit,  // ← NUEVO
      };
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  return {
    data: summaryQuery.data,
    loading: summaryQuery.isLoading,
    error: summaryQuery.isError ? summaryQuery.error : null,
  };
};
