"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueChart } from "./revenue-chart";
import { DistributionChart } from "./distribution-chart";
import { TrendChart } from "./trend-chart";
import { TransactionsList } from "./transactions-list";
import { Download } from "lucide-react";
import { addDays } from "date-fns";

interface Service {
  _id: string;
  clientId: string;
  value: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  paymentHistory?: {
    amount: number;
    date: Date;
    description: string;
  }[];
}

interface Client {
  _id: string;
  name: string;
}

interface AnalyticsSectionProps {
  userId: string;
}

export function AnalyticsSection({ userId }: AnalyticsSectionProps) {
  const [date, setDate] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchServices(),
      fetchClients()
    ]).finally(() => setIsLoading(false));
  }, []);

  async function fetchServices() {
    try {
      const response = await fetch(`/api/services?userId=${userId}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  }

  async function fetchClients() {
    try {
      const response = await fetch(`/api/clients?userId=${userId}`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  }

  // Filter services based on selected date range, client, and status
  const filteredServices = services.filter(service => {
    const serviceDate = service.endDate ? new Date(service.endDate) : new Date(service.startDate || "");
    const isInDateRange = (!date.from || serviceDate >= date.from) && (!date.to || serviceDate <= date.to);
    const isClientMatch = selectedClient === "all" || service.clientId === selectedClient;
    const isStatusMatch = selectedStatus === "all" || service.status === selectedStatus;
    return isInDateRange && isClientMatch && isStatusMatch;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <DatePickerWithRange date={date} onDateChange={setDate} />
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(client => (
                <SelectItem key={client._id} value={client._id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Service status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart services={filteredServices} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionChart services={filteredServices} clients={clients} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart services={filteredServices} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsList services={filteredServices} clients={clients} />
        </CardContent>
      </Card>
    </div>
  );
}