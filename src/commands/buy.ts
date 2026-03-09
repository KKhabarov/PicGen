import type { BotContext } from '../types.js';
import { buildBuyKeyboard } from '../keyboards/index.js';

export async function buyCommand(ctx: BotContext) {
  await ctx.reply(ctx.t('buy.title'), {
    reply_markup: buildBuyKeyboard(),
  });
}
