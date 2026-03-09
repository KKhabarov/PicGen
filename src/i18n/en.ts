export const en: Record<string, string> = {
  // General
  'error.general': '❌ An error occurred. Please try again later.',
  'error.banned': '🚫 Your account has been banned.',
  'error.not_admin': '🚫 You do not have access to this command.',

  // Start command
  'start.welcome':
    '👋 Hello, {name}!\n\nWelcome to PicGen — AI image generation bot.\n\n🎁 You have been given {freeCredits} free credits for trial generations!\n\nUse /generate to create an image.',
  'start.welcome_back': '👋 Welcome back, {name}!',
  'start.referral_bonus': '🎁 You received +{credits} credit for joining via referral!',

  // Balance
  'balance.title': '💰 Your Balance',
  'balance.credits': 'Paid credits: {credits}',
  'balance.free_credits': 'Free credits: {freeCredits}',
  'balance.total': 'Total: {total} credits',
  'balance.buy': '🛒 Buy credits',

  // Generate
  'generate.enter_prompt':
    '✏️ Enter the image description (any language):\n\nMinimum 3 characters, maximum 1000.',
  'generate.select_style': '🎨 Select image style:',
  'generate.select_ratio': '📐 Select aspect ratio:',
  'generate.select_resolution': '🔍 Select resolution:',
  'generate.confirm': '✅ Ready to generate!\n\n📝 Prompt: {prompt}\n🎨 Style: {style}\n📐 Ratio: {ratio}\n🔍 Resolution: {resolution}\n💰 Cost: {credits} credit(s)',
  'generate.insufficient_credits':
    '❌ Insufficient credits.\n\nRequired: {required}\nAvailable: {available}\n\nTop up: /buy',
  'generate.processing': '⏳ Generating image... This may take up to 30 seconds.',
  'generate.success': '✅ Image ready!\n\n📝 {prompt}\n💰 Used: {credits} credit(s)',
  'generate.failed': '❌ Generation failed. Credits not charged. Please try again.',
  'generate.rate_limit_minute': '⏱️ Too many requests. Please wait 1 minute.',
  'generate.rate_limit_hour': '⏱️ Hourly generation limit reached (20). Try again later.',
  'generate.prompt_too_short': '❌ Description too short (minimum 3 characters).',
  'generate.prompt_too_long': '❌ Description too long (maximum 1000 characters).',
  'generate.cancelled': '❌ Generation cancelled.',

  // Buy
  'buy.title': '🛒 Buy Credits\n\nSelect a pack:',
  'buy.pack': '{name} — {credits} credits for {price}₽',
  'buy.invoice_title': 'PicGen — {name}',
  'buy.invoice_description': '{credits} credits for AI image generation in PicGen',
  'buy.success': '✅ Payment successful! {credits} credits added.\n\nYour balance: {total} credits.',

  // Payment (mock mode)
  'payment.mock_confirm': '💳 {pack}\n\n{credits} credits for {price}₽\n\n⚠️ Test mode: payment is processed automatically.',
  'payment.mock_confirm_btn': '✅ Confirm purchase',
  'payment.mock_success': '✅ Purchase successful! {credits} credits added.\n\n💰 Your balance: {balance} credits',
  'payment.mock_cancelled': '❌ Purchase cancelled',

  // History
  'history.title': '📚 Generation History',
  'history.empty': '📭 History is empty. Create your first image with /generate',
  'history.entry': '#{id} | {date}\n📝 {prompt}\n🎨 {style} | {ratio} | {resolution}\nStatus: {status}',
  'history.page': 'Page {page} of {total}',
  'history.regenerate': '🔄 Regenerate',
  'history.prev': '◀️ Previous',
  'history.next': 'Next ▶️',

  // Referral
  'referral.title': '👥 Referral Program',
  'referral.link': '🔗 Your referral link:\n{link}',
  'referral.stats': '\n\n📊 Stats:\n👥 Referred: {count}\n💰 Earned: {earned} credits',
  'referral.how_it_works':
    '\n\n💡 How it works:\n• You earn +2 credits for each referral\n• New user gets +1 credit',

  // Settings
  'settings.title': '⚙️ Settings',
  'settings.language': 'Language: {lang}',
  'settings.change_language': '🌐 Change language',
  'settings.language_changed': '✅ Language changed to {lang}.',

  // Help
  'help.text':
    '📖 PicGen Help\n\n🤖 Commands:\n/start — Get started\n/generate — Create an image\n/balance — Your balance\n/buy — Buy credits\n/history — Generation history\n/referral — Referral program\n/settings — Settings\n/help — Help\n\n💡 Generation cost:\n• 1K — 1 credit\n• 2K — 2 credits\n• 4K — 4 credits\n\n📞 Support: @support',

  // Admin
  'admin.title': '🔧 Admin Panel',
  'admin.stats': '📊 Statistics',
  'admin.users': '👥 Users',
  'admin.promo': '🎟️ Promo Codes',
  'admin.broadcast': '📢 Broadcast',
  'admin.stats_text':
    '📊 Statistics\n\n👥 Total users: {totalUsers}\n📅 Active today: {activeToday}\n🖼️ Total generations: {totalGenerations}\n💰 Total revenue: {totalRevenue}₽',
  'admin.user_not_found': '❌ User not found.',
  'admin.user_info':
    '👤 User #{id}\nTelegram ID: {telegramId}\nName: {name}\nCredits: {credits}\nFree credits: {freeCredits}\nBanned: {banned}\nAdmin: {admin}\nJoined: {date}',
  'admin.user_banned': '✅ User has been banned.',
  'admin.user_unbanned': '✅ User has been unbanned.',
  'admin.credits_added': '✅ Added {credits} credits to user #{id}.',
  'admin.promo_created': '✅ Promo code created:\nCode: {code}\nCredits: {credits}\nMax uses: {maxUses}',
  'admin.broadcast_confirm': '❓ Send message to {count} users?\n\n{text}',
  'admin.broadcast_done': '✅ Broadcast completed. Sent: {sent}, errors: {errors}.',
  'admin.enter_user_id': '👤 Enter user Telegram ID or @username:',
  'admin.enter_credits': '💰 Enter the number of credits:',
  'admin.enter_broadcast': '📝 Enter broadcast message:',
  'admin.enter_promo_code': '🎟️ Enter promo code:',
  'admin.enter_promo_credits': '💰 Enter the number of credits:',
  'admin.enter_promo_max_uses': '🔢 Enter maximum number of uses:',

  // Promo
  'promo.enter': '🎟️ Enter promo code:',
  'promo.success': '✅ Promo code applied! {credits} credits added.',
  'promo.not_found': '❌ Promo code not found or inactive.',
  'promo.already_used': '❌ You have already used this promo code.',
  'promo.expired': '❌ Promo code has expired.',
  'promo.limit_reached': '❌ Promo code usage limit reached.',

  // Buttons
  'btn.generate': '🎨 Generate',
  'btn.balance': '💰 Balance',
  'btn.buy': '🛒 Buy Credits',
  'btn.history': '📚 History',
  'btn.referral': '👥 Referral',
  'btn.settings': '⚙️ Settings',
  'btn.help': '❓ Help',
  'btn.back': '◀️ Back',
  'btn.cancel': '❌ Cancel',
  'btn.confirm': '✅ Confirm',

  // Status
  'status.pending': '⏳ Pending',
  'status.processing': '🔄 Processing',
  'status.completed': '✅ Completed',
  'status.failed': '❌ Failed',
};
