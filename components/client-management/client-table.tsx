"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  document?: string;
}

interface ClientTableProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export function ClientTable({ clients, onView, onEdit, onDelete }: ClientTableProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("ClientTable.name")}</TableHead>
            <TableHead>{t("ClientTable.email")}</TableHead>
            <TableHead>{t("ClientTable.phone")}</TableHead>
            <TableHead>{t("ClientTable.whatsapp")}</TableHead>
            <TableHead>{t("ClientTable.document")}</TableHead>
            <TableHead>{t("ClientTable.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client._id}>
              <TableCell>
                <button
                  onClick={() => onView(client)}
                  className="text-left hover:text-primary hover:underline"
                >
                  {client.name}
                </button>
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone || "-"}</TableCell>
              <TableCell>{client.whatsapp || "-"}</TableCell>
              <TableCell>{client.document || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onView(client)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(client)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("ClientTable.deleteClient")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("ClientTable.deleteConfirm")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("ClientTable.deleteCancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(client._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t("ClientTable.deleteAction")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {t("ClientTable.noClientsFound")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}