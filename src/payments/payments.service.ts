import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripe_secret);

  createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    return this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel',
    });
  }

  stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    // testing
    // const endpointSecret =
    //   'whsec_52ebf075ba010bce616e53cfdc12386b19151a2aea33f39e6d96014d681aeb93';

    const endpointSecret = 'whsec_5Bbb7CYG9j5SRcMuQsnoLk9CVaEYTeMV';
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        console.log({
          metadata: chargeSucceeded.metadata,
        });

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json(sig);
  }
}
