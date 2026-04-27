import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/db";
import { User } from "@/models/user";
import { stripe } from "@/lib/stripe";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionTier, manualTierOverride } = body;

    await dbConnect();
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ─── Caso 1: Alterar o plano manualmente (ativa o override automaticamente)
    if (subscriptionTier !== undefined) {
      user.subscriptionTier = subscriptionTier;
      user.manualTierOverride = true;
      await user.save();

      return NextResponse.json({
        message: "Subscription tier updated",
        subscriptionTier: user.subscriptionTier,
        manualTierOverride: user.manualTierOverride,
      });
    }

    // ─── Caso 2: Toggle do manualTierOverride via checkbox
    if (manualTierOverride !== undefined) {

      // Desativando o override → volta para free e cancela no Stripe
      if (manualTierOverride === false) {
        // Cancela assinatura ativa no Stripe (se houver)
        try {
          const subscriptions = await stripe.subscriptions.list({
            customer: undefined,
            limit: 10,
          });

          // Busca pelo email do usuário no Stripe
          const customers = await stripe.customers.list({
            email: user.email,
            limit: 1,
          });

          if (customers.data.length > 0) {
            const customerId = customers.data[0].id;
            const activeSubs = await stripe.subscriptions.list({
              customer: customerId,
              status: "active",
              limit: 10,
            });

            for (const sub of activeSubs.data) {
              await stripe.subscriptions.cancel(sub.id);
            }
          }
        } catch (stripeError) {
          console.error("Stripe cancellation error:", stripeError);
          // Não bloqueia — continua mesmo se o Stripe falhar
        }

        user.subscriptionTier = "free";
        user.manualTierOverride = false;
      } else {
        // Apenas ativando o override sem mudar o plano
        user.manualTierOverride = true;
      }

      await user.save();

      return NextResponse.json({
        message: manualTierOverride
          ? "Override ativado"
          : "Override desativado — usuário retornou ao plano free",
        subscriptionTier: user.subscriptionTier,
        manualTierOverride: user.manualTierOverride,
      });
    }

    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });

  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}