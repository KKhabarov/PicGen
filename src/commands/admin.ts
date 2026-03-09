import type { BotContext } from '../types.js';
import { buildAdminKeyboard } from '../keyboards/index.js';
import { prisma } from '../services/user.js';
import {
  searchUser,
  banUser,
  unbanUser,
  addCredits,
} from '../services/user.js';
import { getTotalGenerations } from '../services/history.js';
import { getTotalRevenue } from '../services/payment.js';
import { formatDate } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';
import { nanoid } from 'nanoid';

export async function adminCommand(ctx: BotContext) {
  await ctx.reply(ctx.t('admin.title'), { reply_markup: buildAdminKeyboard(ctx) });
}

export async function handleAdminStats(ctx: BotContext) {
  const [totalUsers, totalGenerations, totalRevenue] = await Promise.all([
    prisma.user.count(),
    getTotalGenerations(),
    getTotalRevenue(),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeToday = await prisma.generation.groupBy({
    by: ['userId'],
    where: { createdAt: { gte: today } },
    _count: true,
  });

  await ctx.editMessageText(
    ctx.t('admin.stats_text', {
      totalUsers,
      activeToday: activeToday.length,
      totalGenerations,
      totalRevenue: totalRevenue.toFixed(2),
    }),
    {
      reply_markup: {
        inline_keyboard: [[{ text: ctx.t('btn.back'), callback_data: 'admin:menu' }]],
      },
    },
  );
  await ctx.answerCallbackQuery();
}

export async function handleAdminUsers(ctx: BotContext) {
  ctx.session.step = 'admin_search_user';
  await ctx.answerCallbackQuery();
  await ctx.reply(ctx.t('admin.enter_user_id'));
}

export async function handleAdminSearchUser(ctx: BotContext, query: string) {
  const user = await searchUser(query);

  if (!user) {
    await ctx.reply(ctx.t('admin.user_not_found'));
    return;
  }

  ctx.session.adminTargetUserId = user.id;

  const text = ctx.t('admin.user_info', {
    id: user.id,
    telegramId: user.telegramId.toString(),
    name: `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`,
    credits: user.credits,
    freeCredits: user.freeCredits,
    banned: user.isBanned ? '✅' : '❌',
    admin: user.isAdmin ? '✅' : '❌',
    date: formatDate(user.createdAt),
  });

  await ctx.reply(text, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: user.isBanned ? '✅ Разбанить' : '🚫 Забанить', callback_data: `admin:toggle_ban:${user.id}` },
          { text: '💰 Кредиты', callback_data: `admin:add_credits:${user.id}` },
        ],
        [{ text: ctx.t('btn.back'), callback_data: 'admin:menu' }],
      ],
    },
  });
}

export async function handleAdminToggleBan(ctx: BotContext, userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    await ctx.answerCallbackQuery(ctx.t('admin.user_not_found'));
    return;
  }

  if (user.isBanned) {
    await unbanUser(userId);
    await ctx.answerCallbackQuery(ctx.t('admin.user_unbanned'));
  } else {
    await banUser(userId);
    await ctx.answerCallbackQuery(ctx.t('admin.user_banned'));
  }
}

export async function handleAdminAddCredits(ctx: BotContext, userId: number) {
  ctx.session.step = 'admin_add_credits';
  ctx.session.adminTargetUserId = userId;
  await ctx.answerCallbackQuery();
  await ctx.reply(ctx.t('admin.enter_credits'));
}

export async function handleAdminCreditsInput(ctx: BotContext, amount: number) {
  const userId = ctx.session.adminTargetUserId;
  if (!userId) return;

  await addCredits(userId, amount);
  ctx.session.step = undefined;
  await ctx.reply(ctx.t('admin.credits_added', { credits: amount, id: userId }));
}

export async function handleAdminPromo(ctx: BotContext) {
  ctx.session.step = 'admin_promo_code';
  await ctx.answerCallbackQuery();
  await ctx.reply(ctx.t('admin.enter_promo_code'));
}

export async function handleAdminBroadcast(ctx: BotContext) {
  ctx.session.step = 'admin_broadcast';
  await ctx.answerCallbackQuery();
  await ctx.reply(ctx.t('admin.enter_broadcast'));
}

export async function handleBroadcastMessage(ctx: BotContext, bot: import('grammy').Bot<BotContext>, text: string) {
  const users = await prisma.user.findMany({
    where: { isBanned: false },
    select: { telegramId: true },
  });

  // Store full text in session for later execution
  ctx.session.broadcastText = text;

  await ctx.reply(ctx.t('admin.broadcast_confirm', { count: users.length, text }), {
    reply_markup: {
      inline_keyboard: [
        [
          { text: ctx.t('btn.confirm'), callback_data: 'admin:broadcast_send' },
          { text: ctx.t('btn.cancel'), callback_data: 'admin:menu' },
        ],
      ],
    },
  });

  ctx.session.step = undefined;
}

export async function executeBroadcast(
  ctx: BotContext,
  bot: import('grammy').Bot<BotContext>,
  text: string,
) {
  const users = await prisma.user.findMany({
    where: { isBanned: false },
    select: { telegramId: true },
  });

  let sent = 0;
  let errors = 0;

  for (const user of users) {
    try {
      await bot.api.sendMessage(user.telegramId.toString(), text);
      sent++;
    } catch {
      errors++;
    }
    // Small delay to avoid hitting rate limits
    await new Promise((r) => setTimeout(r, 50));
  }

  await ctx.editMessageText(ctx.t('admin.broadcast_done', { sent, errors }));
  await ctx.answerCallbackQuery();
}

export async function handleCreatePromo(
  ctx: BotContext,
  code: string,
  credits: number,
  maxUses: number,
) {
  await prisma.promoCode.create({
    data: { code, credits, maxUses },
  });

  await ctx.reply(ctx.t('admin.promo_created', { code, credits, maxUses }));
}
