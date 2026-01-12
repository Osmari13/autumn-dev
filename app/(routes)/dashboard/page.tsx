// app/(routes)/dashboard/page.tsx
"use client";

import { useGetSummary } from "@/actions/summary/actions";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { ContentLayout } from "@/components/sidebar/ContentLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const COLORS = ["#d4a574", "#c9915f", "#bf7f4f", "#b56c3f", "#ab5a30"]

export default function DashboardPage() {
  const { data, loading, error } = useGetSummary();
  console.log(data)
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500">Error cargando estadísticas.</div>;
  }

  const { providerStats, income, pendingClients } = data;

  // Datos para gráfico de barras: gastos por proveedor
  const profitBarData = providerStats.map((p) => ({
    name: p.providerName,
    expenses: p.totalPaid,
    income: data?.profit?.totalIncome / providerStats.length || 0, // Distribuir ganancias
  }));

  // Datos para gráfico de pastel: distribución de gastos por proveedor
  const providerPieData = providerStats.map((p) => ({
    name: p.providerName,
    value: p.totalPaid,
  }));

  // Total de deuda pendiente
  const totalPending = pendingClients.reduce(
    (sum, c) => sum + c.pendingAmount,
    0
  );

  return (
      <ContentLayout title='Dashboard'>
        <ProtectedRoute roles={['ADMIN']}>
          <>
            <div className="space-y-6 p-6">
              {/* Título */}
              <div>
                <h1 className="text-2xl font-bold text-amber-500">Dashboard Financiero</h1>
                <p className="text-sm text-muted-foreground">
                  Estadísticas de gastos por proveedor, ganancias e ingresos pendientes.
                </p>
              </div>

              {/* Cards resumen */}
              <section className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Gastos a Proveedores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">
                      ${providerStats.reduce((s, p) => s + p.totalPaid, 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Pagos realizados en el rango seleccionado.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Ganancias (Ingresos)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-amber-600">${income.totalIncome.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{income.totalTransactions} transacciones cobradas.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Deuda Pendiente Clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-yellow-700">${totalPending.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{pendingClients.length} clientes con deuda pendiente.</p>
                  </CardContent>
                </Card>
              </section>

              {/* Gráfico de barras y pastel */}
              <section className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Gastos por proveedor</CardTitle>
                  </CardHeader>
                  <div className="h-80 w-full">
                    <CardContent className="h-full">
                      {profitBarData.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay pagos registrados para el rango seleccionado.</p>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={profitBarData}>
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip />
                            {/* <Bar dataKey="totalPaid" fill="#c9915f" /> */}
                            <Bar dataKey="expenses" name="Gastos" fill="#ef4444" />
                            <Bar dataKey="income" name="Ingresos" fill="#22c55e" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>

                  </div>
                </Card>

                {/* Gráfico de pastel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Distribución de gastos por proveedor</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-hidden">
                    <div className="h-80 w-full flex items-center justify-center">
                      {providerPieData.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay datos de gastos para mostrar.</p>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={providerPieData}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={100}
                              label={(entry) => entry.name}
                            >
                              {providerPieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Tabla: clientes pendientes */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Clientes con pagos pendientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingClients.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No hay clientes con deuda pendiente.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b text-xs text-muted-foreground">
                            <tr>
                              <th className="py-2 text-left">Cliente</th>
                              <th className="py-2 text-right">Deuda</th>
                              <th className="py-2 text-right">Transacciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingClients.map((c) => (
                              <tr key={c.clientId} className="border-b last:border-0">
                                <td className="py-2">{c.clientName}</td>
                                <td className="py-2 text-right text-amber-600 font-semibold">${c.pendingAmount.toFixed(2)}</td>
                                <td className="py-2 text-right">{c.transactionsCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            </div>
          </>

        </ProtectedRoute>
      </ContentLayout>
  );
}
