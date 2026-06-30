"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientList } from "./client-list";
import { ServiceList } from "./service-list";
import { ExpenseList } from "./expense-list";
import { FinancialOverview } from "./financial-overview";
import { ReportsSection } from "./reports/reports-section";
import { useTranslation } from "react-i18next";

interface ClientManagementProps {
  userId: string;
  defaultTab?: string;
}

export function ClientManagement({ userId, defaultTab = "clients" }: ClientManagementProps) {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto py-20 max-w-[960px]">
      <h1 className="text-3xl font-bold mb-8">{t("ClientManagement.title")}</h1>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8 font-bold">
          <TabsTrigger className="font-bold" value="clients">{t("ClientManagement.tabs.clients")}</TabsTrigger>
          <TabsTrigger className="font-bold" value="services">{t("ClientManagement.tabs.services")}</TabsTrigger>
          <TabsTrigger className="font-bold" value="expenses">{t("ClientManagement.tabs.expenses")}</TabsTrigger>
          <TabsTrigger className="font-bold" value="financial">{t("ClientManagement.tabs.financial")}</TabsTrigger>
          <TabsTrigger className="font-bold" value="reports">{t("ClientManagement.tabs.reports")}</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <ClientList userId={userId} />
        </TabsContent>

        <TabsContent value="services">
          <ServiceList userId={userId} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseList userId={userId} />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialOverview userId={userId} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsSection userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}