import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')
export async function fetchSubscritionByEmail(email: string){
  const customers = await stripe.customers.list({
    limit: 1,
    email: email,
    expand: ['data.subscriptions']
  })
  if (customers.data.length === 0){
    return null
  }
  const customer = customers.data[0]

  if (customer.subscriptions?.data.length === 0){
    return null
  }

  const subscription = customer.subscriptions?.data[0]

  return subscription
}