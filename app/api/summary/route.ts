// app/api/summary/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const from = fromParam ? startOfDay(new Date(fromParam)) : undefined;
    const to = toParam ? endOfDay(new Date(toParam)) : undefined;

    const dateFilter = from && to
      ? { gte: from, lte: to }
      : from
      ? { gte: from }
      : to
      ? { lte: to }
      : undefined;

    // 1) GASTOS POR PROVEEDOR (ProviderPayment)
    const providerPayments = await db.providerPayment.findMany({
      where: {
        ...(dateFilter && { paidAt: dateFilter }),
      },
      include: {
        provider: true,
      },
    });

    const providerStatsMap = new Map<
      string,
      {
        providerId: string;
        providerName: string;
        totalPaid: number;
        totalPayments: number;
        lastPayment: Date | null;
        methodsCount: Record<string, number>;
      }
    >();

    for (const payment of providerPayments) {
      const providerId = payment.providerId;
      const key = providerId;

      if (!providerStatsMap.has(key)) {
        providerStatsMap.set(key, {
          providerId,
          providerName:
            payment.provider.name ||
            `${payment.provider.first_name ?? ""} ${payment.provider.last_name ?? ""}`.trim(),
          totalPaid: 0,
          totalPayments: 0,
          lastPayment: null,
          methodsCount: {},
        });
      }

      const stats = providerStatsMap.get(key)!;
      stats.totalPaid += payment.amount;
      stats.totalPayments += 1;
      stats.lastPayment =
        !stats.lastPayment || payment.paidAt > stats.lastPayment
          ? payment.paidAt
          : stats.lastPayment;

      const method = payment.payMethod || "DESCONOCIDO";
      stats.methodsCount[method] = (stats.methodsCount[method] || 0) + 1;
    }

    const providerStats = Array.from(providerStatsMap.values()).map((s) => {
      const mostUsedMethod =
        Object.entries(s.methodsCount).sort((a, b) => b[1] - a[1])[0]?.[0] ??
        null;

      return {
        providerId: s.providerId,
        providerName: s.providerName,
        totalPaid: s.totalPaid,
        totalPayments: s.totalPayments,
        lastPayment: s.lastPayment,
        mostUsedPaymentMethod: mostUsedMethod,
      };
    });

    // 2) GANANCIAS (ingresos por ventas / pagos de clientes)
    // Supongamos que Payment está ligado a Transaction y esta a Client
    const payments = await db.payment.findMany({
      where: {
        ...(dateFilter && { paidAt: dateFilter }),
      },
      include: {
        transaction: {
          include: {
            client: true,
          },
        },
      },
    });

    const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalTransactions = new Set(
      payments.map((p) => p.transactionId)
    ).size;

    const income = {
      totalIncome,
      totalTransactions,
      from: from ?? null,
      to: to ?? null,
    };

    // 3) CLIENTES PENDIENTES POR PAGAR
    const clients = await db.client.findMany({
      include: {
        transaction: {
          include: {
            payments: true,
          },
        },
      },
    });

    const pendingClients = clients
      .map((client) => {
        const pendingAmount =
          client.transaction?.reduce((clientDebt, t) => {
            const paymentsSum =
              t.payments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
            const transactionDebt =
              t.status === "PENDIENTE" ? t.total - paymentsSum : 0;
            return clientDebt + Math.max(0, transactionDebt);
          }, 0) ?? 0;

        const pendingTransactionsCount =
          client.transaction?.filter((t) => t.status === "PENDIENTE")
            .length ?? 0;

        return {
          clientId: client.id,
          clientName: `${client.first_name} ${client.last_name}`.trim(),
          pendingAmount,
          transactionsCount: pendingTransactionsCount,
        };
      })
      .filter((c) => c.pendingAmount > 0);

    return NextResponse.json(
      {
        providerStats,
        income,
        pendingClients,
        profit: {
          totalIncome,           // Total ingresos (ya calculado)
          totalExpenses: providerStats.reduce((sum, p) => sum + p.totalPaid, 0),
          netProfit: totalIncome - providerStats.reduce((sum, p) => sum + p.totalPaid, 0),
        },

      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/summary:", error);
    return NextResponse.json(
      { error: "Error al obtener el resumen" },
      { status: 500 }
    );
  }
}
