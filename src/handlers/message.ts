import type { BotContext } from '../types.js';
import { MIN_PROMPT_LENGTH, MAX_PROMPT_LENGTH } from '../utils/constants.js';
import { buildStyleKeyboard } from '../keyboards/index.js';
import {
  handleAdminSearchUser,
  handleAdminCreditsInput,
  handleBroadcastMessage,
  handleCreatePromo,
} from '../commands/admin.js';
import type { Bot } from 'grammy';

export function createMessageHandler(bot: Bot<BotContext>) {
  return async (ctx: BotContext) => {
    const text = ctx.message?.text;
    if (!text || !ctx.dbUser) return;

    const step = ctx.session.step;

    // Generate flow
    if (step === 'prompt') {
      if (text.length < MIN_PROMPT_LENGTH) {
        await ctx.reply(ctx.t('generate.prompt_too_short'));
        return;
      }
      if (text.length > MAX_PROMPT_LENGTH) {
        await ctx.reply(ctx.t('generate.prompt_too_long'));
        return;
      }

      ctx.session.prompt = text;
      ctx.session.step = 'style';

      await ctx.reply(ctx.t('generate.select_style'), {
        reply_markup: buildStyleKeyboard(ctx.dbUser.language),
      });
      return;
    }

    // Admin flows
    if (step === 'admin_search_user') {
      ctx.session.step = undefined;
      await handleAdminSearchUser(ctx, text);
      return;
    }

    if (step === 'admin_add_credits') {
      const amount = parseInt(text, 10);
      if (isNaN(amount) || amount <= 0) {
        await ctx.reply('❌ Введите корректное число кредитов.');
        return;
      }
      ctx.session.step = undefined;
      await handleAdminCreditsInput(ctx, amount);
      return;
    }

    if (step === 'admin_broadcast') {
      ctx.session.step = undefined;
      await handleBroadcastMessage(ctx, bot, text);
      return;
    }

    if (step === 'admin_promo_code') {
      ctx.session.adminAction = text;
      ctx.session.step = 'admin_promo_credits';
      await ctx.reply(ctx.t('admin.enter_promo_credits'));
      return;
    }

    if (step === 'admin_promo_credits') {
      const credits = parseInt(text, 10);
      if (isNaN(credits) || credits <= 0) {
        await ctx.reply('❌ Введите корректное число кредитов.');
        return;
      }
      ctx.session.adminAction = `${ctx.session.adminAction}:${credits}`;
      ctx.session.step = 'admin_promo_max_uses';
      await ctx.reply(ctx.t('admin.enter_promo_max_uses'));
      return;
    }

    if (step === 'admin_promo_max_uses') {
      const maxUses = parseInt(text, 10);
      if (isNaN(maxUses) || maxUses <= 0) {
        await ctx.reply('❌ Введите корректное число.');
        return;
      }

      const [code, creditsStr] = (ctx.session.adminAction ?? ':').split(':');
      const credits = parseInt(creditsStr ?? '0', 10);

      ctx.session.step = undefined;
      ctx.session.adminAction = undefined;

      await handleCreatePromo(ctx, code, credits, maxUses);
      return;
    }

    // Promo code flow
    if (step === 'promo') {
      ctx.session.step = undefined;
      await handlePromoCode(ctx, text);
      return;
    }
  };
}

async function handlePromoCode(ctx: BotContext, code: string) {
  const { prisma } = await import('../services/user.js');

  const promo = await prisma.promoCode.findUnique({ where: { code } });

  if (!promo || !promo.isActive) {
    await ctx.reply(ctx.t('promo.not_found'));
    return;
  }

  if (promo.expiresAt && promo.expiresAt < new Date()) {
    await ctx.reply(ctx.t('promo.expired'));
    return;
  }

  if (promo.usedCount >= promo.maxUses) {
    await ctx.reply(ctx.t('promo.limit_reached'));
    return;
  }

  const userId = ctx.dbUser!.id;
  const existing = await prisma.promoCodeUsage.findUnique({
    where: { promoCodeId_userId: { promoCodeId: promo.id, userId } },
  });

  if (existing) {
    await ctx.reply(ctx.t('promo.already_used'));
    return;
  }

  await prisma.$transaction([
    prisma.promoCodeUsage.create({ data: { promoCodeId: promo.id, userId } }),
    prisma.promoCode.update({
      where: { id: promo.id },
      data: { usedCount: { increment: 1 } },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: promo.credits } },
    }),
  ]);

  await ctx.reply(ctx.t('promo.success', { credits: promo.credits }));
}
