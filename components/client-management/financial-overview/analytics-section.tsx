/* import { useState, useEffect } from "react"; */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueChart } from "./revenue-chart";
import { DistributionChart } from "./distribution-chart";
import { TrendChart } from "./trend-chart";
import { TransactionsList } from "./transactions-list";
import { Download } from "lucide-react";
import { useAnalyticsData } from "@/hooks/use-analytics-data";
import { useAnalyticsFilters } from "@/hooks/use-analytics-filters";
import { useTranslation } from "react-i18next";
import { Service } from "@/types/service";

interface AnalyticsSectionProps {
  userId: string;
}

export function AnalyticsSection({ userId }: AnalyticsSectionProps) {
  const { t } = useTranslation();
  const { services, clients, isLoading } = useAnalyticsData(userId);
  const {
    dateRange,
    setDateRange,
    selectedClient,
    setSelectedClient,
    selectedStatus,
    setSelectedStatus,
    filteredServices
  } = useAnalyticsFilters(services);

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export to PDF");
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log("Export to Excel");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={(newDate) => setDateRange(newDate || { 
              from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              to: new Date()
            })}
          />
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("ReportsSection.selectClient")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("ReportsSection.allClients")}</SelectItem>
              {clients.map(client => (
                <SelectItem key={client._id} value={client._id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("ReportsSection.serviceStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("ReportsSection.allStatus")}</SelectItem>
              <SelectItem value="pending">{t("ReportsSection.pending")}</SelectItem>
              <SelectItem value="in_progress">{t("ReportsSection.inProgress")}</SelectItem>
              <SelectItem value="completed">{t("ReportsSection.completed")}</SelectItem>
              <SelectItem value="cancelled">{t("ReportsSection.cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            {t("ReportsSection.exportPDF")}
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            {t("ReportsSection.exportExcel")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("FinancialOverview.revenueByMonth")}</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart services={filteredServices} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("FinancialOverview.revenueDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionChart services={filteredServices} clients={clients} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("FinancialOverview.paymentTrends")}</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart services={filteredServices} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("FinancialOverview.recentTransactions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsList services={filteredServices} clients={clients} />
        </CardContent>
      </Card>
    </div>
  );
}