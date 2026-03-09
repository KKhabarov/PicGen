import type { BotContext } from '../types.js';

export async function generateCommand(ctx: BotContext) {
  ctx.session.step = 'prompt';
  ctx.session.style = undefined;
  ctx.session.aspectRatio = undefined;
  ctx.session.resolution = undefined;
  ctx.session.prompt = undefined;

  await ctx.reply(ctx.t('generate.enter_prompt'));
}
