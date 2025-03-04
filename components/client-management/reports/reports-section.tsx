"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FinancialReport } from "./financial-report";
import { ClientsReport } from "./clients-report";
import { ServicesReport } from "./services-report";
import { ProductivityReport } from "./productivity-report";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useTranslation } from "react-i18next";

interface ReportsSectionProps {
  userId: string;
}

export function ReportsSection({ userId }: ReportsSectionProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedServiceType, setSelectedServiceType] = useState("all");
  
  const { t, ready } = useTranslation(); // Hook do i18next para traduções
  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export to PDF");
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log("Export to Excel");
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={(newDate) => setDateRange(newDate || { 
              from: addDays(new Date(), -30),
              to: new Date()
            })}
          />
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("ReportsSection.selectClient")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("ReportsSection.allClients")}</SelectItem>
              {/* Add client options dynamically */}
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
          <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("ReportsSection.serviceType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("ReportsSection.allTypes")}</SelectItem>
              {/* Add service type options dynamically */}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              {t("ReportsSection.exportPDF")}

            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="mr-2 h-4 w-4" />
              {t("ReportsSection.exportExcel")}

            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">{t("ReportsSection.financialReport")}</TabsTrigger>
          <TabsTrigger value="clients">{t("ReportsSection.clientsReport")}</TabsTrigger>
          <TabsTrigger value="services">{t("ReportsSection.servicesReport")}</TabsTrigger>
          <TabsTrigger value="productivity">{t("ReportsSection.productivityReport")}</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialReport
            userId={userId}
            dateRange={dateRange}
            selectedClient={selectedClient}
            selectedStatus={selectedStatus}
          />
        </TabsContent>

        <TabsContent value="clients">
          <ClientsReport
            userId={userId}
            dateRange={dateRange}
            selectedStatus={selectedStatus}
          />
        </TabsContent>

        <TabsContent value="services">
          <ServicesReport
            userId={userId}
            dateRange={dateRange}
            selectedClient={selectedClient}
            selectedStatus={selectedStatus}
            selectedServiceType={selectedServiceType}
          />
        </TabsContent>

        <TabsContent value="productivity">
          <ProductivityReport
            userId={userId}
            dateRange={dateRange}
            selectedClient={selectedClient}
            selectedStatus={selectedStatus}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
