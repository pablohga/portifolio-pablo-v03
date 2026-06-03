import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { User } from "@/models/user";
import { Notification } from "@/models/notification";
import dbConnect from "@/lib/db";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Traduz códigos de erro do Stripe para mensagens amigáveis em PT-BR
 */
function getPaymentErrorMessage(errorCode: string | undefined): string {
  const errorMessages: Record<string, string> = {
    // Cartão recusado
    card_declined: "Seu cartão foi recusado. Entre em contato com seu banco ou tente outro método de pagamento.",
    insufficient_funds: "Saldo insuficiente no cartão. Verifique o limite disponível ou tente outro cartão.",
    lost_card: "O cartão foi reportado como perdido. Use outro método de pagamento.",
    stolen_card: "O cartão foi reportado como roubado. Use outro método de pagamento.",
    expired_card: "Seu cartão está expirado. Atualize os dados com um cartão válido.",
    incorrect_cvc: "O código de segurança (CVC) está incorreto. Verifique e tente novamente.",
    incorrect_number: "O número do cartão está incorreto. Verifique e tente novamente.",
    incorrect_zip: "O CEP informado não corresponde ao do cartão. Verifique o endereço de cobrança.",
    processing_error: "Ocorreu um erro ao processar o pagamento. Tente novamente em alguns minutos.",
    rate_limit: "Muitas tentativas de pagamento. Aguarde alguns minutos antes de tentar novamente.",
    authentication_required: "Seu banco exige autenticação adicional (3DS). Complete a verificação para confirmar o pagamento.",
    authentication_failed: "A autenticação com seu banco falhou. Tente novamente ou use outro método de pagamento.",
    charge_disputed: "O pagamento foi contestado. Entre em contato com o suporte para resolver.",
    // Erros genéricos
    invalid_card_type: "Tipo de cartão não suportado. Use Visa, Mastercard ou outro cartão aceito.",
    invalid_expiry_month: "Mês de validade inválido. Verifique os dados do cartão.",
    invalid_expiry_year: "Ano de validade inválido. Verifique os dados do cartão.",
    invalid_number: "Número do cartão inválido. Verifique os dados informados.",
    // Padrão para códigos não mapeados
  };

  if (!errorCode) {
    return "O pagamento falhou por um motivo não especificado. Verifique seus dados de pagamento e tente novamente.";
  }

  return errorMessages[errorCode] || `O pagamento falhou (erro: ${errorCode}). Atualize seus dados de pagamento e tente novamente.`;
}

/**
 * Extrai o email do customer com fallback para string vazia
 * (Stripe.Customer.email pode ser null)
 */
function getCustomerEmail(customer: Stripe.Customer): string {
  return customer.email || "";
}

/**
 * Envia notificação de falha de pagamento para o usuário
 */
async function sendPaymentFailedNotification(userEmail: string, invoice: Stripe.Invoice) {
  try {
    await dbConnect();
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.error(`User not found for email: ${userEmail}`);
      return;
    }

    // Cria notificação no banco de dados
    await Notification.create({
      userId: user._id.toString(),
      type: "payment",
      title: "Pagamento Falhou",
      message: `O pagamento da sua assinatura falhou. Valor: ${(invoice.amount_due / 100).toFixed(2)}. Data de vencimento: ${invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleDateString('pt-BR') : 'N/A'}. Atualize seus dados de pagamento para evitar o cancelamento.`,
      status: "urgent",
      metadata: {
        amount: invoice.amount_due / 100,
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : undefined,
      },
    });

    console.log(`Notificação de pagamento falho criada para ${userEmail}`);
  } catch (error) {
    console.error("Error creating payment failed notification:", error);
  }
}

/**
 * Atualiza o status do usuário quando a assinatura entra em past_due
 * e envia notificação de alerta
 */
async function handlePastDueSubscription(subscription: Stripe.Subscription, customerEmail: string) {
  try {
    await dbConnect();
    const user = await User.findOne({ email: customerEmail });

    if (!user) {
      console.error(`User not found for email: ${customerEmail}`);
      return;
    }

    // NOTA: Não revertemos para 'free' imediatamente em past_due
    // O usuário mantém acesso durante o período de grace (padrão Stripe: ~3 semanas)
    // Mas marcamos o usuário para monitoramento
    user.subscriptionStatus = "past_due";
    user.subscriptionPastDueSince = new Date();
    await user.save();

    console.log(`Usuário ${customerEmail} marcado com status past_due`);
  } catch (error) {
    console.error("Error handling past_due subscription:", error);
  }
}

/**
 * Restaura o status do usuário quando o pagamento é regularizado
 */
async function handleSubscriptionRestored(customerEmail: string) {
  try {
    await dbConnect();
    const user = await User.findOne({
      email: customerEmail,
      subscriptionStatus: "past_due"
    });

    if (!user) {
      return;
    }

    user.subscriptionStatus = "active";
    user.subscriptionPastDueSince = undefined;
    await user.save();

    console.log(`Assinatura de ${customerEmail} restaurada para active`);
  } catch (error) {
    console.error("Error handling subscription restored:", error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature")!;
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = getCustomerEmail(customer as Stripe.Customer);

        if (!customerEmail) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        const tier =
          priceId === process.env.STRIPE_PRICE_ID_PREMIUM ||
          priceId === process.env.STRIPE_PRICE_ID_PREMIUM_BRL ||
          priceId === process.env.STRIPE_PRICE_ID_PREMIUM_EUR
            ? "premium"
            : "paid";

        await dbConnect();
        await User.findOneAndUpdate(
          { email: customerEmail },
          {
            subscriptionTier: tier,
            subscriptionStatus: "active",
            subscriptionPastDueSince: undefined,
            updatedAt: new Date()
          },
          { upsert: true }
        );

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = getCustomerEmail(customer as Stripe.Customer);

        if (!customerEmail) break;

        // Envia notificação ao usuário sobre a falha
        await sendPaymentFailedNotification(customerEmail, invoice);

        // Marca o usuário com status past_due para monitoramento
        await handlePastDueSubscription(invoice.subscription as Stripe.Subscription, customerEmail);

        console.log(`Pagamento falhou para ${customerEmail}. Notificação enviada.`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = getCustomerEmail(customer as Stripe.Customer);

        if (!customerEmail) break;

        // Restaura o status do usuário se estava em past_due
        await handleSubscriptionRestored(customerEmail);

        console.log(`Pagamento recebido de ${customerEmail}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = getCustomerEmail(customer as Stripe.Customer);

        if (!customerEmail) break;

        await dbConnect();

        // Verifica o status da assinatura
        if (subscription.status === "past_due") {
          // Assinatura com pagamento pendente - notifica mas não cancela imediatamente
          await handlePastDueSubscription(subscription, customerEmail);

          const priceId = subscription.items.data[0].price.id;
          const tier =
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_BRL ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_EUR
              ? "premium"
              : "paid";

          await User.findOneAndUpdate(
            { email: customerEmail },
            {
              subscriptionTier: tier,
              subscriptionStatus: "past_due",
              subscriptionPastDueSince: new Date(),
              updatedAt: new Date()
            }
          );
        } else if (subscription.status === "active" || subscription.status === "trialing") {
          // Assinatura ativa ou em trial - restaura status normal
          await handleSubscriptionRestored(customerEmail);

          const priceId = subscription.items.data[0].price.id;
          const tier =
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_BRL ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_EUR
              ? "premium"
              : "paid";

          await User.findOneAndUpdate(
            { email: customerEmail },
            {
              subscriptionTier: tier,
              subscriptionStatus: "active",
              subscriptionPastDueSince: undefined,
              updatedAt: new Date()
            }
          );
        } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
          // Assinatura cancelada ou não paga após período de grace - reverte para free
          await User.findOneAndUpdate(
            { email: customerEmail },
            {
              subscriptionTier: "free",
              subscriptionStatus: "canceled",
              subscriptionPastDueSince: undefined,
              updatedAt: new Date()
            }
          );
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = getCustomerEmail(customer as Stripe.Customer);

        if (!customerEmail) break;

        await dbConnect();

        // Reverte usuário para free quando assinatura é deletada
        await User.findOneAndUpdate(
          { email: customerEmail },
          {
            subscriptionTier: "free",
            subscriptionStatus: "canceled",
            subscriptionPastDueSince: undefined,
            updatedAt: new Date()
          }
        );

        console.log(`Assinatura de ${customerEmail} cancelada. Usuário revertido para free.`);
        break;
      }

      // ─────────────────────────────────────────────────
      // HANDLER 6: Pagamento requer ação adicional (3DS)
      // Disparado quando o banco do cliente exige autenticação
      // ─────────────────────────────────────────────────
      case "invoice.payment_action_required": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = getCustomerEmail(customer as Stripe.Customer);

        if (!customerEmail) break;

        await dbConnect();
        const user = await User.findOne({ email: customerEmail });

        if (user) {
          // Cria notificação urgente para o usuário confirmar o pagamento
          await Notification.create({
            userId: user._id.toString(),
            type: "payment",
            title: "Ação Necessária no Pagamento",
            message: `Seu banco exige confirmação para o pagamento de ${(invoice.amount_due / 100).toFixed(2)}. Acesse o portal de pagamento para completar a autenticação e evitar o cancelamento da assinatura.`,
            status: "urgent",
            metadata: {
              amount: invoice.amount_due / 100,
              dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : undefined,
            },
          });

          // Marca status como past_due para monitoramento
          user.subscriptionStatus = "past_due";
          user.subscriptionPastDueSince = user.subscriptionPastDueSince || new Date();
          await user.save();

          console.log(`Ação de pagamento requerida para ${customerEmail}`);
        }

        break;
      }

      // ─────────────────────────────────────────────────
      // HANDLER 7: Trial está acabando (3 dias antes)
      // Oportunidade de engajamento para converter trial em pago
      // ─────────────────────────────────────────────────
      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = getCustomerEmail(customer as Stripe.Customer);

        if (!customerEmail) break;

        await dbConnect();
        const user = await User.findOne({ email: customerEmail });

        if (user) {
          const trialEnd = subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toLocaleDateString('pt-BR')
            : 'em breve';

          const priceId = subscription.items.data[0].price.id;
          const planName =
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_BRL ||
            priceId === process.env.STRIPE_PRICE_ID_PREMIUM_EUR
              ? "Premium"
              : "Paid";

          // Cria notificação informativa sobre fim do trial
          await Notification.create({
            userId: user._id.toString(),
            type: "payment",
            title: "Período de Teste Acabando",
            message: `Seu período de teste do plano ${planName} termina em ${trialEnd}. Para manter acesso a todos os recursos, certifique-se de que seus dados de pagamento estão atualizados.`,
            status: "info",
            metadata: {
              amount: subscription.items.data[0].price.unit_amount
                ? subscription.items.data[0].price.unit_amount / 100
                : undefined,
              dueDate: subscription.trial_end
                ? new Date(subscription.trial_end * 1000)
                : undefined,
            },
          });

          // Atualiza status para trialing para rastreamento
          user.subscriptionStatus = "trialing";
          await user.save();

          console.log(`Notificação de fim de trial enviada para ${customerEmail}`);
        }

        break;
      }

      // ─────────────────────────────────────────────────
      // HANDLER 8: Fatura será gerada em breve
      // Lembrete pró-ativo para o usuário verificar pagamento
      // ─────────────────────────────────────────────────
      case "invoice.upcoming": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = getCustomerEmail(customer as Stripe.Customer);

        if (!customerEmail) break;

        await dbConnect();
        const user = await User.findOne({ email: customerEmail });

        if (user && user.paymentReminders) {
          const dueDate = invoice.due_date
            ? new Date(invoice.due_date * 1000).toLocaleDateString('pt-BR')
            : 'em breve';

          // Cria notificação de lembrete de cobrança (respeita preferência do usuário)
          await Notification.create({
            userId: user._id.toString(),
            type: "payment",
            title: "Cobrança Próxima",
            message: `Sua próxima cobrança de ${(invoice.amount_due / 100).toFixed(2)} será processada em ${dueDate}. Certifique-se de que seus dados de pagamento estão atualizados.`,
            status: "info",
            metadata: {
              amount: invoice.amount_due / 100,
              dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : undefined,
            },
          });

          console.log(`Lembrete de cobrança enviado para ${customerEmail}`);
        }

        break;
      }

      // ─────────────────────────────────────────────────
      // HANDLER 9: Payment Intent falhou (mais granular)
      // Dá detalhes sobre o motivo da falha no método de pagamento
      // ─────────────────────────────────────────────────
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerId = paymentIntent.customer as string;

        // PaymentIntent pode não ter customer (pagamento único)
        if (!customerId) break;

        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = getCustomerEmail(customer as Stripe.Customer);

        if (!customerEmail) break;

        await dbConnect();
        const user = await User.findOne({ email: customerEmail });

        if (user) {
          // Mapeia código de erro do Stripe para mensagem amigável
          const errorCode = paymentIntent.last_payment_error?.code;
          const errorMessage = getPaymentErrorMessage(errorCode);

          // Cria notificação com detalhes específicos da falha
          await Notification.create({
            userId: user._id.toString(),
            type: "payment",
            title: "Falha no Método de Pagamento",
            message: errorMessage,
            status: "urgent",
            metadata: {
              amount: paymentIntent.amount / 100,
            },
          });

          // Marca como past_due se ainda não está
          if (user.subscriptionStatus !== "past_due") {
            user.subscriptionStatus = "past_due";
            user.subscriptionPastDueSince = new Date();
            await user.save();
          }

          console.log(`Payment intent falhou para ${customerEmail}. Motivo: ${errorCode}`);
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
