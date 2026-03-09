import { PrismaClient } from '@prisma/client';
import { generateReferralCode } from '../utils/helpers.js';
import { config } from '../config.js';
import { FREE_CREDITS_ON_REGISTER } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export { prisma };

export async function findOrCreateUser(telegramUser: {
  id: bigint;
  username?: string | null;
  firstName: string;
  lastName?: string | null;
  languageCode?: string | null;
}) {
  let user = await prisma.user.findUnique({
    where: { telegramId: telegramUser.id },
  });

  if (!user) {
    const isAdmin = config.adminTelegramIds.includes(telegramUser.id);
    const language =
      telegramUser.languageCode === 'en' ? 'en' : 'ru';

    user = await prisma.user.create({
      data: {
        telegramId: telegramUser.id,
        username: telegramUser.username ?? null,
        firstName: telegramUser.firstName,
        lastName: telegramUser.lastName ?? null,
        language,
        freeCredits: FREE_CREDITS_ON_REGISTER,
        isAdmin,
        referralCode: generateReferralCode(),
      },
    });

    logger.info('New user registered', { telegramId: telegramUser.id, userId: user.id });
  }

  return user;
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByTelegramId(telegramId: bigint) {
  return prisma.user.findUnique({ where: { telegramId } });
}

export async function getUserByReferralCode(code: string) {
  return prisma.user.findUnique({ where: { referralCode: code } });
}

export async function updateUserLanguage(userId: number, language: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { language },
  });
}

export async function addCredits(userId: number, amount: number) {
  return prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
  });
}

export async function deductCredits(userId: number, amount: number): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;

  const totalAvailable = user.freeCredits + user.credits;
  if (totalAvailable < amount) return false;

  // Use free credits first
  if (user.freeCredits >= amount) {
    await prisma.user.update({
      where: { id: userId },
      data: { freeCredits: { decrement: amount } },
    });
  } else {
    const remainingCost = amount - user.freeCredits;
    await prisma.user.update({
      where: { id: userId },
      data: {
        freeCredits: 0,
        credits: { decrement: remainingCost },
      },
    });
  }

  return true;
}

export async function getTotalCredits(userId: number): Promise<number> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return 0;
  return user.freeCredits + user.credits;
}

export async function banUser(userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: { isBanned: true },
  });
}

export async function unbanUser(userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: { isBanned: false },
  });
}

export async function searchUser(query: string) {
  if (/^\d+$/.test(query)) {
    return prisma.user.findFirst({
      where: { telegramId: BigInt(query) },
    });
  }
  const username = query.startsWith('@') ? query.slice(1) : query;
  return prisma.user.findFirst({
    where: { username },
  });
}
