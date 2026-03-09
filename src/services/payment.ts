import { prisma } from './user.js';
import { addCredits } from './user.js';
import type { PaymentStatus } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { CREDIT_PACKS } from '../types.js';

export { CREDIT_PACKS };

export async function createPayment(data: {
  userId: number;
  amount: number;
  credits: number;
  currency: string;
  telegramPaymentId: string;
}) {
  return prisma.payment.create({
    data: {
      userId: data.userId,
      amount: data.amount,
      credits: data.credits,
      currency: data.currency,
      telegramPaymentId: data.telegramPaymentId,
      status: 'PENDING',
    },
  });
}

export async function completePayment(telegramPaymentId: string): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { telegramPaymentId },
  });

  if (!payment) {
    logger.error('Payment not found', { telegramPaymentId });
    return;
  }

  await prisma.payment.update({
    where: { telegramPaymentId },
    data: { status: 'COMPLETED' },
  });

  await addCredits(payment.userId, payment.credits);

  logger.info('Payment completed', { telegramPaymentId, userId: payment.userId, credits: payment.credits });
}

export async function getPaymentByTelegramId(telegramPaymentId: string) {
  return prisma.payment.findUnique({ where: { telegramPaymentId } });
}

export async function getTotalRevenue(): Promise<number> {
  const result = await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });
  return Number(result._sum.amount ?? 0);
}

export function findPackById(packId: string) {
  return CREDIT_PACKS.find((p) => p.id === packId);
}
