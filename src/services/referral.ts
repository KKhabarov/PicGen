import { prisma } from './user.js';
import { addCredits } from './user.js';
import { REFERRER_BONUS_CREDITS, REFERRED_BONUS_CREDITS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

export async function processReferral(referrerId: number, newUserId: number): Promise<void> {
  try {
    // Check if referral already exists
    const existing = await prisma.referral.findUnique({
      where: { referredId: newUserId },
    });

    if (existing) return;

    // Create referral record
    await prisma.referral.create({
      data: {
        referrerId,
        referredId: newUserId,
        bonusCredits: REFERRER_BONUS_CREDITS,
      },
    });

    // Award credits to referrer
    await addCredits(referrerId, REFERRER_BONUS_CREDITS);

    // Award bonus credits to new user
    await prisma.user.update({
      where: { id: newUserId },
      data: { credits: { increment: REFERRED_BONUS_CREDITS } },
    });

    // Update referredById
    await prisma.user.update({
      where: { id: newUserId },
      data: { referredById: referrerId },
    });

    logger.info('Referral processed', { referrerId, newUserId });
  } catch (error) {
    logger.error('Error processing referral', { error, referrerId, newUserId });
  }
}

export async function getReferralStats(userId: number) {
  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
  });

  const totalEarned = referrals.reduce((sum, r) => sum + r.bonusCredits, 0);

  return {
    count: referrals.length,
    earned: totalEarned,
  };
}
