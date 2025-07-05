import express from 'express';
import { buffer } from 'micro';
import db from '../db.js';

export const config = { api: { bodyParser: false } };
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const rawBody = await buffer(req);
    const data = JSON.parse(rawBody.toString());

    if (
      data.type === 'notification' &&
      data.event === 'payment.succeeded' &&
      data.object.status === 'succeeded'
    ) {
      const description = data.object.description;
      const userIdMatch = description.match(/\d+/);
      const user_id = userIdMatch ? userIdMatch[0] : null;

      if (!user_id) return res.status(400).json({ error: 'user_id not found' });

      const row = await db.get(`SELECT hasVpnBoost FROM users WHERE user_id = ?`, [user_id]);
      if (row?.hasVpnBoost) return res.json({ success: true });

      await db.run(`
        INSERT INTO users (user_id, hasVpnBoost, coins)
        VALUES (?, 1, 1000)
        ON CONFLICT(user_id) DO UPDATE SET hasVpnBoost = 1, coins = coins + 1000
      `, [user_id]);

      return res.json({ success: true });
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Ошибка webhook:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
