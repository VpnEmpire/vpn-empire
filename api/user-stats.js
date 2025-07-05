import { getDb, initDb } from '../../db';

export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  try {
    await initDb();
    const db = await getDb();

    const user = await db.get(`
      SELECT coins, hasVpnBoost, activateVpn
      FROM users
      WHERE user_id = ?
    `, [user_id]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ stats: user });
  } catch (err) {
    console.error('❌ Ошибка при получении пользователя:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

