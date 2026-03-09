import type { BotContext } from '../types.js';

export async function helpCommand(ctx: BotContext) {
  await ctx.reply(ctx.t('help.text'));
}
