"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ServiceDialog } from "./service-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ExpenseDialog } from "./expense-dialog";

interface Service {
  _id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  value: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  startDate?: Date;
  endDate?: Date;
}

interface Expense {
  _id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  value: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  startDate?: Date;
  endDate?: Date;
}

interface Client {
  _id: string;
  name: string;
  email: string;
}

interface ServiceListProps {
  userId: string;
}

export function ServiceList({ userId }: ServiceListProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpenExpense, setIsDialogOpenExpense] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { toast } = useToast();
  const { t, ready } = useTranslation();

  useEffect(() => {
    Promise.all([ fetchServices(), fetchClients()]).finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchServices() {
    try {
      const response = await fetch(`/api/services?userId=${userId}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setServices(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    }
  }

  

  async function fetchClients() {
    try {
      const response = await fetch(`/api/clients?userId=${userId}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setClients(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
    }
  }

  function handleAddService() {
    setSelectedService(null);
    setIsDialogOpen(true);
  }

  function handleAddExpense() {
    setSelectedExpense(null);
    setIsDialogOpenExpense(true);
  }

  function handleEditService(service: Service) {
    setSelectedService(service);
    setIsDialogOpen(true);
  }


  async function handleDeleteService(id: string) {
    try {
      const response = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();

      setServices(services.filter(service => service._id !== id));
      toast({ title: "Success", description: "Service deleted successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
    }
  }


  function handleServiceSubmit(updatedService: Service) {
    if (selectedService) {
      setServices(services.map(service => (service._id === updatedService._id ? updatedService : service)));
    } else {
      setServices([...services, updatedService]);
    }
  }


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("ServiceList.title")}</h2>
        <Button onClick={handleAddService}>
          <Plus className="w-4 h-4 mr-2" />
          {t("ServiceList.addService")}
        </Button>
        
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t("ServiceList.noServicesFound")}
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.title}</TableCell>
                  <TableCell>
                    {clients.find(c => c._id === service.clientId)?.name || 'Unknown Client'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(service.value)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        service.paymentStatus === 'paid' 
                          ? 'default' 
                          : service.paymentStatus === 'partial' 
                          ? 'secondary' 
                          : 'destructive'
                      }
                    >
                      {service.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("ServiceList.deleteService")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("ServiceList.deleteConfirmation")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteService(service._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ServiceDialog clients={clients} service={selectedService} open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleServiceSubmit} />

    </div>
  );
}
