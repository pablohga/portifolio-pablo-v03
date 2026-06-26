import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayoutWrapper } from "@/components/dashboard/layout-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayoutWrapper>
      {children}
    </DashboardLayoutWrapper>
  );
}