// api/yookassa-webhook.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

router.use(express.json());

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    console.log('📥 Webhook получен:', JSON.stringify(data));

    if (
      data.type === 'notification' &&
      data.event === 'payment.succeeded' &&
      data.object.status === 'succeeded'
    ) {
      const description = data.object.description;
      const userIdMatch = description.match(/\d+/);
      const user_id = userIdMatch ? userIdMatch[0] : null;

      if (!user_id) {
        console.log('❌ Не удалось извлечь user_id из description:', description);
        return res.status(400).json({ error: 'user_id not found' });
      }

      // Проверяем — уже выполнено?
      const row = await db.get('SELECT activateVpn FROM users WHERE user_id = ?', user_id);
      if (row?.activateVpn) {
        console.log(`⚠️ Задание уже выполнено для user_id: ${user_id}`);
        return res.status(200).json({ success: true });
      }

      // ✅ Начисляем награду
      await db.run(
        `INSERT INTO users (user_id, coins, hasVpnBoost, activateVpn)
         VALUES (?, 1000, 1, 1)
         ON CONFLICT(user_id) DO UPDATE SET
           coins = coins + 1000,
           hasVpnBoost = 1,
           activateVpn = 1`,
        [user_id]
      );

      console.log(`🎉 Награда выдана: 1000 монет + x2 Boost активирован для user_id: ${user_id}`);
      return res.status(200).json({ success: true });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Ошибка в обработке webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
