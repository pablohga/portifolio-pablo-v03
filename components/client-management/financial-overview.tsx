"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";

interface FinancialOverviewProps {
  userId: string;
}

interface FinancialMetrics {
  totalRevenue: number;
  pendingPayments: number;
  completedProjects: number;
  activeProjects: number;
  monthlyRevenue: number;
  lastMonthRevenue: number;
}

export function FinancialOverview({ userId }: FinancialOverviewProps) {
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    pendingPayments: 0,
    completedProjects: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    lastMonthRevenue: 0,
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch(`/api/services?userId=${userId}`);
        const services = await response.json();

        // Calculate metrics from services
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const completedServices = services.filter(
          (service: any) => service.status === "completed"
        );
        const activeServices = services.filter(
          (service: any) =>
            service.status === "pending" || service.status === "in_progress"
        );

        const totalRevenue = completedServices.reduce(
          (sum: number, service: any) => sum + service.value,
          0
        );

        const pendingPayments = activeServices.reduce(
          (sum: number, service: any) => sum + service.value,
          0
        );

        const monthlyRevenue = completedServices
          .filter((service: any) => {
            const endDate = new Date(service.endDate);
            return (
              endDate.getMonth() === currentMonth &&
              endDate.getFullYear() === currentYear
            );
          })
          .reduce((sum: number, service: any) => sum + service.value, 0);

        const lastMonthRevenue = completedServices
          .filter((service: any) => {
            const endDate = new Date(service.endDate);
            return (
              endDate.getMonth() === lastMonth &&
              endDate.getFullYear() === lastMonthYear
            );
          })
          .reduce((sum: number, service: any) => sum + service.value, 0);

        setMetrics({
          totalRevenue,
          pendingPayments,
          completedProjects: completedServices.length,
          activeProjects: activeServices.length,
          monthlyRevenue,
          lastMonthRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch financial metrics:", error);
      }
    }

    fetchMetrics();
  }, [userId]);

  const monthlyGrowth =
    metrics.lastMonthRevenue === 0
      ? 100
      : ((metrics.monthlyRevenue - metrics.lastMonthRevenue) /
          metrics.lastMonthRevenue) *
        100;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(metrics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyGrowth >= 0 ? "+" : ""}
              {monthlyGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(metrics.pendingPayments)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {metrics.activeProjects} active projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Projects
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              All time completed projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(metrics.monthlyRevenue)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {monthlyGrowth >= 0 ? "+" : ""}
                  {monthlyGrowth.toFixed(1)}% from last month (
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(metrics.lastMonthRevenue)}
                  )
                </p>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Revenue
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(metrics.totalRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Pending Payments
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(metrics.pendingPayments)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detailed analytics will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Financial reports will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Financial notifications and alerts will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}