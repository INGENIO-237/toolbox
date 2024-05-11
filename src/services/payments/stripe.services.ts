import { Service } from "typedi";
import { Stripe } from "stripe";
import config from "../../config";
import { CreatePaymentInput } from "../../schemas/payments";
import { StripePaymentRepository } from "../../repositories/payments";
import { TRANSACTION_TYPE } from "../../utils/enums/payment";

@Service()
export default class StripePaymentService {
  private _secretKey: string = config.STRIPE_SECRET_KEY;
  private _stripe: Stripe;

  constructor(private repository: StripePaymentRepository) {
    this._stripe = new Stripe(this._secretKey);
  }

  async initializePayment({
    amount,
    currency,
    app,
  }: CreatePaymentInput["body"] & { app: string }) {
    const { client_secret, paymentIntent, customerId } =
      await this.createPaymentIntent({
        amount,
        currency,
      });

    const ephemeralKey = await this._stripe.ephemeralKeys.create(
      {
        customer: customerId,
      },
      { apiVersion: config.STRIPE_API_VERSION }
    );

    const { ref } = await this.repository.initializePayment({
      amount,
      app,
      currency,
      paymentIntent,
      transactionType: TRANSACTION_TYPE.CASHIN,
      clientSecret: client_secret as string,
    });

    /**
     * @return
     * client_side, ephemeralKey, paymentIntent: will be used on the client-side to confirm the payment
     * ref: will be used as the payment reference on the backend for traceability purpose
     */
    return {
      clientSecret: client_secret,
      ephemeralKey,
      paymentIntent,
      paymentRef: ref,
    };
  }

  private async createPaymentIntent({
    amount,
    currency,
  }: CreatePaymentInput["body"]) {
    const { id: customerId } = await this._stripe.customers.create();
    const { client_secret, id: paymentIntent } =
      await this._stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
      });

    return { client_secret, paymentIntent, customerId };
  }

  async handlePaymentHook() {}
}
