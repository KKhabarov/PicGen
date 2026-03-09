export const ru: Record<string, string> = {
  // General
  'error.general': '❌ Произошла ошибка. Попробуйте позже.',
  'error.banned': '🚫 Ваш аккаунт заблокирован.',
  'error.not_admin': '🚫 У вас нет доступа к этой команде.',

  // Start command
  'start.welcome':
    '👋 Привет, {name}!\n\nДобро пожаловать в PicGen — бот для генерации изображений с помощью ИИ.\n\n🎁 Вам начислено {freeCredits} бесплатных кредита для пробных генераций!\n\nИспользуйте /generate для создания изображения.',
  'start.welcome_back': '👋 С возвращением, {name}!',
  'start.referral_bonus': '🎁 Вы получили +{credits} кредит за приглашение!',

  // Balance
  'balance.title': '💰 Ваш баланс',
  'balance.credits': 'Платные кредиты: {credits}',
  'balance.free_credits': 'Бесплатные кредиты: {freeCredits}',
  'balance.total': 'Итого: {total} кредитов',
  'balance.buy': '🛒 Купить кредиты',

  // Generate
  'generate.enter_prompt':
    '✏️ Введите описание изображения (на любом языке):\n\nМинимум 3 символа, максимум 1000.',
  'generate.select_style': '🎨 Выберите стиль изображения:',
  'generate.select_ratio': '📐 Выберите соотношение сторон:',
  'generate.select_resolution': '🔍 Выберите разрешение:',
  'generate.confirm': '✅ Готово к генерации!\n\n📝 Промпт: {prompt}\n🎨 Стиль: {style}\n📐 Соотношение: {ratio}\n🔍 Разрешение: {resolution}\n💰 Стоимость: {credits} кредит(ов)',
  'generate.insufficient_credits':
    '❌ Недостаточно кредитов.\n\nНужно: {required}\nЕсть: {available}\n\nПополните баланс: /buy',
  'generate.processing': '⏳ Генерирую изображение... Это займёт до 30 секунд.',
  'generate.success': '✅ Изображение готово!\n\n📝 {prompt}\n💰 Использовано: {credits} кредит(ов)',
  'generate.failed': '❌ Ошибка генерации. Кредиты не списаны. Попробуйте снова.',
  'generate.rate_limit_minute': '⏱️ Слишком много запросов. Подождите 1 минуту.',
  'generate.rate_limit_hour': '⏱️ Достигнут лимит генераций в час (20). Попробуйте позже.',
  'generate.prompt_too_short': '❌ Описание слишком короткое (минимум 3 символа).',
  'generate.prompt_too_long': '❌ Описание слишком длинное (максимум 1000 символов).',
  'generate.cancelled': '❌ Генерация отменена.',

  // Buy
  'buy.title': '🛒 Покупка кредитов\n\nВыберите пакет:',
  'buy.pack': '{name} — {credits} кредитов за {price}₽',
  'buy.invoice_title': 'PicGen — {name}',
  'buy.invoice_description': '{credits} кредитов для генерации изображений в PicGen',
  'buy.success': '✅ Оплата прошла успешно! Начислено {credits} кредитов.\n\nВаш баланс: {total} кредитов.',

  // History
  'history.title': '📚 История генераций',
  'history.empty': '📭 История пуста. Создайте первое изображение с /generate',
  'history.entry': '#{id} | {date}\n📝 {prompt}\n🎨 {style} | {ratio} | {resolution}\nСтатус: {status}',
  'history.page': 'Страница {page} из {total}',
  'history.regenerate': '🔄 Перегенерировать',
  'history.prev': '◀️ Назад',
  'history.next': 'Вперёд ▶️',

  // Referral
  'referral.title': '👥 Реферальная программа',
  'referral.link': '🔗 Ваша реферальная ссылка:\n{link}',
  'referral.stats':
    '\n\n📊 Статистика:\n👥 Приглашено: {count}\n💰 Заработано: {earned} кредитов',
  'referral.how_it_works':
    '\n\n💡 Как это работает:\n• Вы получаете +2 кредита за каждого приглашённого\n• Новый пользователь получает +1 кредит',

  // Settings
  'settings.title': '⚙️ Настройки',
  'settings.language': 'Язык: {lang}',
  'settings.change_language': '🌐 Сменить язык',
  'settings.language_changed': '✅ Язык изменён на {lang}.',

  // Help
  'help.text':
    '📖 Справка по PicGen\n\n🤖 Команды:\n/start — Начало работы\n/generate — Создать изображение\n/balance — Ваш баланс\n/buy — Купить кредиты\n/history — История генераций\n/referral — Реферальная программа\n/settings — Настройки\n/help — Справка\n\n💡 Стоимость генерации:\n• 1K — 1 кредит\n• 2K — 2 кредита\n• 4K — 4 кредита\n\n📞 Поддержка: @support',

  // Admin
  'admin.title': '🔧 Панель администратора',
  'admin.stats': '📊 Статистика',
  'admin.users': '👥 Пользователи',
  'admin.promo': '🎟️ Промокоды',
  'admin.broadcast': '📢 Рассылка',
  'admin.stats_text':
    '📊 Статистика\n\n👥 Всего пользователей: {totalUsers}\n📅 Активны сегодня: {activeToday}\n🖼️ Всего генераций: {totalGenerations}\n💰 Общая выручка: {totalRevenue}₽',
  'admin.user_not_found': '❌ Пользователь не найден.',
  'admin.user_info':
    '👤 Пользователь #{id}\nTelegram ID: {telegramId}\nИмя: {name}\nКредиты: {credits}\nБаланс: {freeCredits} бесплатных\nЗабанен: {banned}\nАдмин: {admin}\nРегистрация: {date}',
  'admin.user_banned': '✅ Пользователь заблокирован.',
  'admin.user_unbanned': '✅ Пользователь разблокирован.',
  'admin.credits_added': '✅ Начислено {credits} кредитов пользователю #{id}.',
  'admin.promo_created': '✅ Промокод создан:\nКод: {code}\nКредиты: {credits}\nМакс. использований: {maxUses}',
  'admin.broadcast_confirm': '❓ Отправить сообщение {count} пользователям?\n\n{text}',
  'admin.broadcast_done': '✅ Рассылка завершена. Отправлено: {sent}, ошибок: {errors}.',
  'admin.enter_user_id': '👤 Введите Telegram ID или @username пользователя:',
  'admin.enter_credits': '💰 Введите количество кредитов:',
  'admin.enter_broadcast': '📝 Введите текст рассылки:',
  'admin.enter_promo_code': '🎟️ Введите код промокода:',
  'admin.enter_promo_credits': '💰 Введите количество кредитов:',
  'admin.enter_promo_max_uses': '🔢 Введите максимальное количество использований:',

  // Promo
  'promo.enter': '🎟️ Введите промокод:',
  'promo.success': '✅ Промокод применён! Начислено {credits} кредитов.',
  'promo.not_found': '❌ Промокод не найден или неактивен.',
  'promo.already_used': '❌ Вы уже использовали этот промокод.',
  'promo.expired': '❌ Промокод истёк.',
  'promo.limit_reached': '❌ Промокод достиг лимита использований.',

  // Buttons
  'btn.generate': '🎨 Генерировать',
  'btn.balance': '💰 Баланс',
  'btn.buy': '🛒 Купить кредиты',
  'btn.history': '📚 История',
  'btn.referral': '👥 Реферальная',
  'btn.settings': '⚙️ Настройки',
  'btn.help': '❓ Помощь',
  'btn.back': '◀️ Назад',
  'btn.cancel': '❌ Отмена',
  'btn.confirm': '✅ Подтвердить',

  // Status
  'status.pending': '⏳ В очереди',
  'status.processing': '🔄 В обработке',
  'status.completed': '✅ Завершено',
  'status.failed': '❌ Ошибка',
};
