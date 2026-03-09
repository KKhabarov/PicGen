import type { BotContext } from '../types.js';
import { getUserHistory } from '../services/history.js';
import { buildHistoryKeyboard } from '../keyboards/index.js';
import { truncate, formatDate } from '../utils/helpers.js';

export async function historyCommand(ctx: BotContext) {
  const user = ctx.dbUser!;
  const page = ctx.session.historyPage ?? 1;

  await showHistoryPage(ctx, user.id, page);
}

export async function showHistoryPage(ctx: BotContext, userId: number, page: number) {
  const { items, total, totalPages } = await getUserHistory(userId, page);

  if (items.length === 0) {
    await ctx.reply(ctx.t('history.empty'));
    return;
  }

  const statusMap: Record<string, string> = {
    PENDING: ctx.t('status.pending'),
    PROCESSING: ctx.t('status.processing'),
    COMPLETED: ctx.t('status.completed'),
    FAILED: ctx.t('status.failed'),
  };

  const lines = [ctx.t('history.title'), ''];

  for (const item of items) {
    lines.push(
      ctx.t('history.entry', {
        id: item.id,
        date: formatDate(item.createdAt),
        prompt: truncate(item.prompt, 50),
        style: item.style ?? '—',
        ratio: item.aspectRatio,
        resolution: item.resolution,
        status: statusMap[item.status] ?? item.status,
      }),
    );
    lines.push('');
  }

  lines.push(ctx.t('history.page', { page, total: totalPages }));

  ctx.session.historyPage = page;

  const keyboard = buildHistoryKeyboard(page, totalPages, items, ctx);

  if (ctx.callbackQuery) {
    await ctx.editMessageText(lines.join('\n'), { reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } else {
    await ctx.reply(lines.join('\n'), { reply_markup: keyboard });
  }
}
