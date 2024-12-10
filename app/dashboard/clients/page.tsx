import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientManagement } from "@/components/client-management";

export default async function ClientsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <ClientManagement userId={user._id.toString()} />;
}