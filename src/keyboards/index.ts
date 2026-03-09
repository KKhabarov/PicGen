import { InlineKeyboard } from 'grammy';
import { STYLES, ASPECT_RATIOS, RESOLUTIONS } from '../utils/constants.js';
import { CREDIT_PACKS } from '../types.js';
import type { BotContext } from '../types.js';

export function buildMainKeyboard(ctx: BotContext): InlineKeyboard {
  return new InlineKeyboard()
    .text(ctx.t('btn.generate'), 'main:generate')
    .text(ctx.t('btn.balance'), 'main:balance')
    .row()
    .text(ctx.t('btn.buy'), 'main:buy')
    .text(ctx.t('btn.history'), 'main:history')
    .row()
    .text(ctx.t('btn.referral'), 'main:referral')
    .text(ctx.t('btn.settings'), 'main:settings')
    .row()
    .text(ctx.t('btn.help'), 'main:help');
}

export function buildStyleKeyboard(lang: string = 'ru'): InlineKeyboard {
  const kb = new InlineKeyboard();
  STYLES.forEach((style, i) => {
    const label = lang === 'en' ? style.labelEn : style.label;
    kb.text(label, `style:${style.id}`);
    if ((i + 1) % 2 === 0) kb.row();
  });
  kb.row().text('❌ Отмена', 'generate:cancel');
  return kb;
}

export function buildAspectRatioKeyboard(lang: string = 'ru'): InlineKeyboard {
  const kb = new InlineKeyboard();
  ASPECT_RATIOS.forEach((ratio) => {
    const label = lang === 'en' ? ratio.labelEn : ratio.label;
    kb.text(label, `ratio:${ratio.id}`).row();
  });
  kb.text('❌ Отмена', 'generate:cancel');
  return kb;
}

export function buildResolutionKeyboard(lang: string = 'ru'): InlineKeyboard {
  const kb = new InlineKeyboard();
  RESOLUTIONS.forEach((res) => {
    const label = lang === 'en' ? res.labelEn : res.label;
    kb.text(label, `resolution:${res.id}`).row();
  });
  kb.text('❌ Отмена', 'generate:cancel');
  return kb;
}

export function buildConfirmGenerationKeyboard(ctx: BotContext): InlineKeyboard {
  return new InlineKeyboard()
    .text(ctx.t('btn.confirm'), 'generate:confirm')
    .text(ctx.t('btn.cancel'), 'generate:cancel');
}

export function buildBuyKeyboard(): InlineKeyboard {
  const kb = new InlineKeyboard();
  CREDIT_PACKS.forEach((pack) => {
    kb.text(`${pack.name} — ${pack.credits} кр. за ${pack.price / 100}₽`, `buy:${pack.id}`).row();
  });
  return kb;
}

export function buildHistoryKeyboard(
  page: number,
  totalPages: number,
  entries: { id: number }[],
  ctx: BotContext,
): InlineKeyboard {
  const kb = new InlineKeyboard();
  entries.forEach((entry) => {
    kb.text(`🔄 #${entry.id}`, `history:regen:${entry.id}`).row();
  });

  const navRow: Array<{ text: string; callback_data: string }> = [];
  if (page > 1) navRow.push({ text: ctx.t('history.prev'), callback_data: `history:page:${page - 1}` });
  if (page < totalPages) navRow.push({ text: ctx.t('history.next'), callback_data: `history:page:${page + 1}` });

  if (navRow.length > 0) {
    navRow.forEach((btn) => kb.text(btn.text, btn.callback_data));
  }

  return kb;
}

export function buildAdminKeyboard(ctx: BotContext): InlineKeyboard {
  return new InlineKeyboard()
    .text(ctx.t('admin.stats'), 'admin:stats')
    .row()
    .text(ctx.t('admin.users'), 'admin:users')
    .row()
    .text(ctx.t('admin.promo'), 'admin:promo')
    .row()
    .text(ctx.t('admin.broadcast'), 'admin:broadcast');
}

export function buildSettingsKeyboard(ctx: BotContext): InlineKeyboard {
  const otherLang = ctx.dbUser?.language === 'ru' ? 'en' : 'ru';
  return new InlineKeyboard().text(
    ctx.t('settings.change_language'),
    `settings:lang:${otherLang}`,
  );
}
