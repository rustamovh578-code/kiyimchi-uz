import express from 'express';

const router = express.Router();

// Bot token env dan olinadi
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://kiyimchi-uz.vercel.app';

// Telegram API ga so'rov yuborish
async function telegramAPI(method, body) {
    if (!BOT_TOKEN) return null;
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json();
}

// Webhook handler — Telegram bu endpoint ga xabar yuboradi
router.post('/webhook', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message?.text) return res.sendStatus(200);

        const chatId = message.chat.id;
        const text = message.text;
        const firstName = message.from.first_name || '';

        if (text === '/start') {
            await telegramAPI('sendMessage', {
                chat_id: chatId,
                text: `Assalomu alaykum, ${firstName}! 👋\n\n🛍 *Kiyimchi.uz* — O'zbekistonning eng qulay onlayn kiyim do'koniga xush kelibsiz!\n\nBizda erkaklar, ayollar va bolalar uchun sifatli kiyimlar bor. Quyidagi tugmani bosib do'konni oching:`,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🛒 Do\'konni ochish', web_app: { url: WEBAPP_URL } }],
                        [{ text: '📦 Katalog', web_app: { url: `${WEBAPP_URL}/catalog` } }],
                    ]
                }
            });
        } else if (text === '/catalog') {
            await telegramAPI('sendMessage', {
                chat_id: chatId,
                text: '📦 Katalogni ko\'rish uchun quyidagi tugmani bosing:',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '👔 Erkaklar', web_app: { url: `${WEBAPP_URL}/catalog?category=men` } }],
                        [{ text: '👗 Ayollar', web_app: { url: `${WEBAPP_URL}/catalog?category=women` } }],
                        [{ text: '👶 Bolalar', web_app: { url: `${WEBAPP_URL}/catalog?category=kids` } }],
                        [{ text: '📋 Barcha tovarlar', web_app: { url: `${WEBAPP_URL}/catalog` } }],
                    ]
                }
            });
        } else if (text === '/help') {
            await telegramAPI('sendMessage', {
                chat_id: chatId,
                text: `ℹ️ *Kiyimchi.uz Bot Yordam*\n\n/start — Botni boshlash\n/catalog — Katalogni ko'rish\n/help — Yordam\n\n📞 Bog'lanish: +998 90 111 11 11\n🌐 Sayt: kiyimchi-uz.vercel.app`,
                parse_mode: 'Markdown',
            });
        } else {
            await telegramAPI('sendMessage', {
                chat_id: chatId,
                text: `Kechirasiz, bu buyruqni tushunmadim. /help buyrug'ini yuboring yoki do'konni oching 👇`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🛒 Do\'konni ochish', web_app: { url: WEBAPP_URL } }],
                    ]
                }
            });
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('Telegram webhook error:', err);
        res.sendStatus(200); // Telegram 200 kutadi, xato bo'lsa ham
    }
});

// Webhookni sozlash uchun endpoint (bir marta chaqiriladi)
router.post('/setup-webhook', async (req, res) => {
    if (!BOT_TOKEN) return res.status(400).json({ error: 'TELEGRAM_BOT_TOKEN sozlanmagan' });

    const webhookUrl = req.body.webhookUrl;
    if (!webhookUrl) return res.status(400).json({ error: 'webhookUrl kerak' });

    const result = await telegramAPI('setWebhook', {
        url: `${webhookUrl}/api/telegram/webhook`,
        allowed_updates: ['message'],
    });

    // Menu button sozlash
    await telegramAPI('setChatMenuButton', {
        menu_button: {
            type: 'web_app',
            text: '🛒 Do\'kon',
            web_app: { url: WEBAPP_URL },
        }
    });

    res.json({ webhook: result, menuButton: 'set' });
});

// Webhook holatini tekshirish
router.get('/status', async (req, res) => {
    if (!BOT_TOKEN) return res.json({ configured: false, message: 'TELEGRAM_BOT_TOKEN sozlanmagan' });

    const info = await telegramAPI('getWebhookInfo', {});
    const me = await telegramAPI('getMe', {});
    res.json({ configured: true, bot: me?.result, webhook: info?.result });
});

export default router;
