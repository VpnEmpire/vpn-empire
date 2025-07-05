import { buffer } from 'micro';
import { getDb, initDb } from '../../db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const rawBody = await buffer(req);
    const json = JSON.parse(rawBody.toString());

    console.log('📥 Webhook получен:', JSON.stringify(json));

    if (
      json.type === 'notification' &&
      json.event === 'payment.succeeded' &&
      json.object.status === 'succeeded'
    ) {
      const description = json.object.description;
      const userIdMatch = description.match(/\d+/);
      const user_id = userIdMatch ? userIdMatch[0] : null;

      if (!user_id) {
        console.log('❌ Не найден user_id в description:', description);
        return res.status(400).json({ error: 'user_id not found' });
      }

      await initDb();
      const db = await getDb();

      // Проверка: выполнено ли уже
      const existing = await db.get(`SELECT activateVpn FROM users WHERE user_id = ?`, [user_id]);
      if (existing?.activateVpn) {
        console.log(`⚠️ Задание уже выполнено: ${user_id}`);
        return res.status(200).json({ success: true });
      }

      // Обновление или вставка пользователя
      await db.run(
        `INSERT INTO users (user_id, coins, hasVpnBoost, activateVpn)
         VALUES (?, 1000, 1, 1)
         ON CONFLICT(user_id) DO UPDATE SET
           coins = coins + 1000,
           hasVpnBoost = 1,
           activateVpn = 1`,
        [user_id]
      );

      console.log(`🎉 ${user_id} получил 1000 монет и VPN Boost`);
      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Ошибка в webhook:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
