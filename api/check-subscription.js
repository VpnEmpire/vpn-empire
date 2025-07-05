import express from 'express';
import { db } from '../db.js';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/', async (req, res) => {
  const { user_id } = req.query;
  const channelUsername = 'OrdoHereticusVPN';

  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=@${channelUsername}&user_id=${user_id}`);
    const data = await response.json();

    const isMember = data.ok && ['member', 'creator', 'administrator'].includes(data.result.status);

    if (isMember) {
      await db.run(`
        INSERT INTO users (user_id, hasSubscribed)
        VALUES (?, 1)
        ON CONFLICT(user_id) DO UPDATE SET hasSubscribed = 1
      `, [user_id]);

      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error('❌ Ошибка подписки:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
