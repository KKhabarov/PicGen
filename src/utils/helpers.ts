import { nanoid } from 'nanoid';

/**
 * Generate a unique 8-character referral code.
 */
export function generateReferralCode(): string {
  return nanoid(8);
}

/**
 * Truncate a string to a max length, appending '...' if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Format a date to a readable Russian date string.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Sleep for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse a Telegram start payload. Returns null if no payload.
 */
export function parseStartPayload(payload: string): { type: string; value: string } | null {
  if (!payload) return null;
  const parts = payload.split('_');
  if (parts.length < 2) return null;
  return { type: parts[0], value: parts.slice(1).join('_') };
}

/**
 * Format credits count with proper Russian pluralization.
 */
export function formatCredits(count: number): string {
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;

  if (mod100 >= 11 && mod100 <= 14) return `${count} кредитов`;
  if (mod10 === 1) return `${count} кредит`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} кредита`;
  return `${count} кредитов`;
}

/**
 * Escape special MarkdownV2 characters.
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!\\-]/g, '\\$&');
}
