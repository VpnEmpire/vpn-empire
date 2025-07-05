import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    const row = await db.get(`SELECT hasVpnBoost FROM users WHERE user_id = ?`, [user_id]);
    if (row?.hasVpnBoost) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error('❌ Ошибка при проверке оплаты VPN:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
