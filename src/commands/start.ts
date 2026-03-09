import type { BotContext } from '../types.js';
import { getUserByReferralCode } from '../services/user.js';
import { processReferral } from '../services/referral.js';
import { parseStartPayload } from '../utils/helpers.js';
import { REFERRED_BONUS_CREDITS } from '../utils/constants.js';
import { buildMainKeyboard } from '../keyboards/index.js';
import { logger } from '../utils/logger.js';

export async function startCommand(ctx: BotContext) {
  const user = ctx.dbUser!;
  const payload = ctx.match as string | undefined;

  // Handle referral
  if (payload) {
    const parsed = parseStartPayload(payload);
    if (parsed?.type === 'ref' && parsed.value) {
      try {
        const referrer = await getUserByReferralCode(parsed.value);
        if (referrer && referrer.id !== user.id && !user.referredById) {
          await processReferral(referrer.id, user.id);
          await ctx.reply(ctx.t('start.referral_bonus', { credits: REFERRED_BONUS_CREDITS }));
        }
      } catch (error) {
        logger.error('Error processing referral in start command', { error });
      }
    }
  }

  const isNewUser = !user.updatedAt || user.createdAt.getTime() === user.updatedAt.getTime();

  if (isNewUser) {
    await ctx.reply(
      ctx.t('start.welcome', {
        name: user.firstName,
        freeCredits: user.freeCredits,
      }),
      { reply_markup: buildMainKeyboard(ctx) },
    );
  } else {
    await ctx.reply(ctx.t('start.welcome_back', { name: user.firstName }), {
      reply_markup: buildMainKeyboard(ctx),
    });
  }
}
