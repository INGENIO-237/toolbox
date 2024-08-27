import { Service } from "typedi";
import { Stripe } from "stripe";
import config from "../../config";
import { CreatePaymentInput } from "../../schemas/payments";
import { StripePaymentRepository } from "../../repositories/payments";
import {
  BALANCE_TYPE,
  PAYMENT_STATUS,
  TRANSACTION_TYPE,
} from "../../utils/enums/payment";
import ApiError from "../../utils/errors/errors.base";
import HTTP from "../../utils/constants/http.responses";
import { StripePaymentDocument } from "../../models/payments/stripe.model";
import AppsService from "../apps.services";

@Service()
export default class StripePaymentService {
  private _secretKey: string = config.STRIPE_SECRET_KEY;
  private _webHookSecret: string = config.STRIPE_WEBHOOK_ENDPOINT_SECRET;
  private _stripe: Stripe;
  private _fees = 3.1;

  constructor(
    private repository: StripePaymentRepository,
    private appService: AppsService
  ) {
    this._stripe = new Stripe(this._secretKey);
  }

  async initializePayment({
    amount,
    currency,
    app,
  }: CreatePaymentInput["body"] & { app: string }) {
    const { client_secret, paymentIntent, customerId } =
      await this.createPaymentIntent({
        amount: amount + (amount * this._fees) / 100,
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
        currency: currency as string,
        customer: customerId,
      });

    return { client_secret, paymentIntent, customerId };
  }

  async handlePaymentHook(
    signature: string | string[] | Buffer,
    data: string | Buffer
  ) {
    let event: Stripe.Event;

    try {
      event = this._stripe.webhooks.constructEvent(
        data,
        signature,
        this._webHookSecret
      );
    } catch (err: any) {
      throw new ApiError(`Webhook Error: ${err.message}`, HTTP.BAD_REQUEST);
    }

    const { type: eventType } = event;

    if (eventType === "charge.captured" || eventType === "charge.succeeded") {
      const paymentIntent = event.data.object.payment_intent as string;
      const receipt = event.data.object.receipt_url as string;

      await this.handleSuccessfullPayment({ paymentIntent, receipt });
    }

    if (eventType === "charge.expired" || eventType === "charge.failed") {
      const paymentIntent = event.data.object.payment_intent as string;
      const { failure_message: failMessage } = event.data.object;

      await this.handleFailedPayment({
        paymentIntent,
        failMessage: failMessage as string,
      });
    }
  }

  private async handleSuccessfullPayment({
    paymentIntent,
    receipt,
  }: {
    paymentIntent: string;
    receipt: string;
  }) {
    await this.repository.updatePayment({
      paymentIntent,
      receipt,
      status: PAYMENT_STATUS.SUCCEEDED,
    });

    // Update app balance
    const payment = (await this.repository.getPayment({
      paymentIntent,
    })) as StripePaymentDocument;

    await this.appService.updateBalance(
      payment.app as string,
      payment.amount,
      BALANCE_TYPE.CARD,
      TRANSACTION_TYPE.CASHIN
    );
  }

  private async handleFailedPayment({
    paymentIntent,
    failMessage,
  }: {
    paymentIntent: string;
    failMessage: string;
  }) {
    await this.repository.updatePayment({
      paymentIntent,
      failMessage,
      status: PAYMENT_STATUS.FAILED,
    });
  }
}
