import { Response } from 'express'
import { STRIPE_KEY } from '../config/secrets'
import Stripe from 'stripe'

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2022-08-01',
})

interface PaymentRequest {
  body: { totalPrice: number; orderId: string }
}

const createPayment = async (req: PaymentRequest, res: Response) => {
  const { totalPrice, orderId } = req.body
  // TODO: improve handling of result and errors
  const paymentIntent = await stripe.paymentIntents.create({
    description: orderId,
    amount: totalPrice * 100, // Multiplying by 100 since Stripe deals in cents
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
  })

  res.send({
    clientSecret: paymentIntent.client_secret,
  })
}

export { createPayment }
