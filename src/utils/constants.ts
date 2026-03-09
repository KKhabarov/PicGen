export const STYLES = [
  { id: 'realistic', label: '📷 Реалистичный', labelEn: '📷 Realistic' },
  { id: 'anime', label: '🎌 Аниме', labelEn: '🎌 Anime' },
  { id: 'digital_art', label: '💻 Цифровое искусство', labelEn: '💻 Digital Art' },
  { id: 'oil_painting', label: '🎨 Масло', labelEn: '🎨 Oil Painting' },
  { id: 'watercolor', label: '🖌️ Акварель', labelEn: '🖌️ Watercolor' },
  { id: 'pixel_art', label: '👾 Пиксель-арт', labelEn: '👾 Pixel Art' },
  { id: '3d_render', label: '🔮 3D Рендер', labelEn: '🔮 3D Render' },
  { id: 'sketch', label: '✏️ Набросок', labelEn: '✏️ Sketch' },
];

export const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 (Квадрат)', labelEn: '1:1 (Square)' },
  { id: '16:9', label: '16:9 (Пейзаж)', labelEn: '16:9 (Landscape)' },
  { id: '9:16', label: '9:16 (Портрет)', labelEn: '9:16 (Portrait)' },
  { id: '4:3', label: '4:3', labelEn: '4:3' },
  { id: '3:4', label: '3:4', labelEn: '3:4' },
];

export const RESOLUTIONS = [
  { id: '1k', label: '1K — 1 кредит', labelEn: '1K — 1 credit', credits: 1 },
  { id: '2k', label: '2K — 2 кредита', labelEn: '2K — 2 credits', credits: 2 },
  { id: '4k', label: '4K — 4 кредита', labelEn: '4K — 4 credits', credits: 4 },
];

export const GENERATION_COST: Record<string, number> = {
  '1k': 1,
  '2k': 2,
  '4k': 4,
};

export const REFERRER_BONUS_CREDITS = 2;
export const REFERRED_BONUS_CREDITS = 1;
export const FREE_CREDITS_ON_REGISTER = 3;

export const HISTORY_PAGE_SIZE = 5;
export const MAX_PROMPT_LENGTH = 1000;
export const MIN_PROMPT_LENGTH = 3;

export const RATE_LIMIT_PER_MINUTE = 5;
export const RATE_LIMIT_PER_HOUR = 20;

export const GENERATION_POLL_INTERVAL_MS = 3000;
export const GENERATION_MAX_POLLS = 60;
