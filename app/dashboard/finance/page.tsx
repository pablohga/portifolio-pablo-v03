import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientManagement } from "@/components/client-management";

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export default async function FinancePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  if (user.subscriptionTier !== "premium") {
    redirect("/dashboard/upgrade");
  }

  return <ClientManagement userId={user._id.toString()} defaultTab="financial" />;
}
