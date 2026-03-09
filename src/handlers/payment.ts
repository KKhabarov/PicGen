import type { BotContext } from '../types.js';
import { createPayment, completePayment, findPackById } from '../services/payment.js';
import { getUserById } from '../services/user.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

export async function handlePreCheckoutQuery(ctx: BotContext) {
  await ctx.answerPreCheckoutQuery(true);
}

export async function handleSuccessfulPayment(ctx: BotContext) {
  const payment = ctx.message?.successful_payment;
  if (!payment || !ctx.dbUser) return;

  try {
    const payload = JSON.parse(payment.invoice_payload) as { packId: string };
    const pack = findPackById(payload.packId);

    if (!pack) {
      logger.error('Pack not found for payment', { packId: payload.packId });
      return;
    }

    await completePayment(payment.telegram_payment_charge_id);

    const user = await getUserById(ctx.dbUser.id);
    const total = (user?.credits ?? 0) + (user?.freeCredits ?? 0) + pack.credits;

    await ctx.reply(
      ctx.t('buy.success', {
        credits: pack.credits,
        total,
      }),
    );

    logger.info('Payment successful', {
      userId: ctx.dbUser.id,
      telegramPaymentId: payment.telegram_payment_charge_id,
      credits: pack.credits,
    });
  } catch (error) {
    logger.error('Error handling successful payment', { error });
    await ctx.reply(ctx.t('error.general'));
  }
}

export async function sendInvoice(ctx: BotContext, packId: string) {
  const pack = findPackById(packId);
  if (!pack || !ctx.dbUser) return;

  const payload = JSON.stringify({ packId: pack.id, userId: ctx.dbUser.id });

  // Create a pending payment record
  // (will be finalized on successful_payment)
  await createPayment({
    userId: ctx.dbUser.id,
    amount: pack.price / 100,
    credits: pack.credits,
    currency: pack.currency,
    telegramPaymentId: `pending_${Date.now()}_${ctx.dbUser.id}`,
  });

  await ctx.replyWithInvoice(
    ctx.t('buy.invoice_title', { name: pack.name }),
    ctx.t('buy.invoice_description', { credits: pack.credits }),
    payload,
    pack.currency,
    [{ label: pack.name, amount: pack.price }],
    {
      provider_token: config.paymentProviderToken,
      start_parameter: `buy_${pack.id}`,
      photo_url: undefined,
      need_name: false,
      need_phone_number: false,
      need_email: false,
      need_shipping_address: false,
      is_flexible: false,
    },
  );
}
