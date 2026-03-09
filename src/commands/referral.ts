import type { BotContext } from '../types.js';
import { getReferralStats } from '../services/referral.js';
import { config } from '../config.js';

export async function referralCommand(ctx: BotContext) {
  const user = ctx.dbUser!;
  const stats = await getReferralStats(user.id);

  const referralLink = `https://t.me/${config.botUsername}?start=ref_${user.referralCode}`;

  const text = [
    ctx.t('referral.title'),
    ctx.t('referral.link', { link: referralLink }),
    ctx.t('referral.stats', { count: stats.count, earned: stats.earned }),
    ctx.t('referral.how_it_works'),
  ].join('');

  await ctx.reply(text);
}
