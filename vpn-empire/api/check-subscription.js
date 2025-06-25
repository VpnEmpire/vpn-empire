// /api/check-subscription.js
import fetch from 'node-fetch';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Убедись, что в .env указано TELEGRAM_BOT_TOKEN
const CHANNEL_ID = '@OrdoHereticusVPN';

export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getChatMember?chat_id=${CHANNEL_ID}&user_id=${user_id}`;
    const tgRes = await fetch(tgUrl);
    const tgData = await tgRes.json();

    const isMember =
      tgData.ok &&
      ['member', 'creator', 'administrator'].includes(tgData?.result?.status);

    return res.status(200).json({ subscribed: isMember });
  } catch (err) {
    console.error('Ошибка при проверке подписки:', err);
    return res.status(500).json({ error: 'Subscription check failed' });
  }
}
