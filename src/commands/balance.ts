import type { BotContext } from '../types.js';

export async function balanceCommand(ctx: BotContext) {
  const user = ctx.dbUser!;
  const total = user.credits + user.freeCredits;

  const text = [
    ctx.t('balance.title'),
    '',
    ctx.t('balance.credits', { credits: user.credits }),
    ctx.t('balance.free_credits', { freeCredits: user.freeCredits }),
    ctx.t('balance.total', { total }),
  ].join('\n');

  await ctx.reply(text, {
    reply_markup: {
      inline_keyboard: [[{ text: ctx.t('balance.buy'), callback_data: 'main:buy' }]],
    },
  });
}
