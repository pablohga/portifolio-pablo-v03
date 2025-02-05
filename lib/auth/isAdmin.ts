import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function isAdmin(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "admin") {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}