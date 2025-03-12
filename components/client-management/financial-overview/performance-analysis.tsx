"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAnalyticsData } from "@/hooks/use-analytics-data"; // Hook utilizado no analytics-section.tsx

interface FinancialOverviewProps {
  userId: string;
}

interface FinancialData {
  month: string;
  revenue: number;
  expenses: number;
}

interface MetricsData {
  totalRevenue: number;
  totalExpenses: number;
  averagePayment: number;
  averagePaymentTime: number;
}

export function PerformanceAnalysis({ userId }: FinancialOverviewProps) {
  const { services, clients, isLoading } = useAnalyticsData(userId);
  const [data, setData] = useState<FinancialData[]>([]);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (services.length > 0) {
      // Agrupar receitas e despesas por mês
      const monthlyData: { [key: string]: { revenue: number; expenses: number } } = {};
      let totalRevenue = 0;
      let totalExpenses = 0;
      let totalDaysToPay = 0;
      let totalPayments = 0;

      services.forEach((service) => {
        const month = service.startDate
          ? new Date(service.startDate).toLocaleString("default", { month: "short" })
          : service.endDate
          ? new Date(service.endDate).toLocaleString("default", { month: "short" })
          : "N/A";

        if (!monthlyData[month]) {
          monthlyData[month] = { revenue: 0, expenses: 0 };
        }

        monthlyData[month].revenue += service.value || 0;
        totalRevenue += service.value || 0;

        if (service.expense) {
          monthlyData[month].expenses += service.expense || 0;
          totalExpenses += service.expense || 0;
        }

        // Cálculo do tempo médio para recebimento
        if (service.startDate && service.endDate) {
          const start = new Date(service.startDate).getTime();
          const end = new Date(service.endDate).getTime();
          const days = Math.max(1, (end - start) / (1000 * 60 * 60 * 24)); // Converter para dias
          totalDaysToPay += days;
          totalPayments++;
        }
      });

      const formattedData = Object.keys(monthlyData).map((month) => ({
        month,
        revenue: monthlyData[month].revenue,
        expenses: monthlyData[month].expenses,
      }));

      setData(formattedData);

      setMetrics({
        totalRevenue,
        totalExpenses,
        averagePayment: clients.length > 0 ? totalRevenue / clients.length : 0,
        averagePaymentTime: totalPayments > 0 ? totalDaysToPay / totalPayments : 0,
      });
    }
  }, [services, clients, isLoading]);

  if (isLoading) return <p>Carregando...</p>;

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-xl">📊 Análise de Desempenho Financeiro</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Gráfico de Barras: Receita Mensal vs Gastos */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-2">Receita Mensal vs Gastos 💰</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4CAF50" name="Receita" />
              <Bar dataKey="expenses" fill="#FF5733" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Informações Financeiras Rápidas */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-md">
            <h4 className="text-md font-medium">🏦 Lucro Líquido:</h4>
            <p className="text-lg font-semibold text-green-600">
              {metrics ? `R$ ${(metrics.totalRevenue - metrics.totalExpenses).toFixed(2)}` : "Carregando..."}
            </p>
          </div>

          <div className="p-4 rounded-md">
            <h4 className="text-md font-medium">🤝 Média de Pagamento por Cliente:</h4>
            <p className="text-lg font-semibold text-blue-600">
              {metrics ? `R$ ${metrics.averagePayment.toFixed(2)}` : "Carregando..."}
            </p>
          </div>

          <div className="p-4 rounded-md">
            <h4 className="text-md font-medium">⏳ Tempo Médio para Recebimento:</h4>
            <p className="text-lg font-semibold text-purple-600">
              {metrics ? `${metrics.averagePaymentTime.toFixed(0)} dias` : "Carregando..."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
