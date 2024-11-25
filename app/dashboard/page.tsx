import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardContent } from "@/components/dashboard-content";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
// valida a seção iniciada
  if (!session) {
    redirect("/auth/signin");
  }

  return <DashboardContent />;
}