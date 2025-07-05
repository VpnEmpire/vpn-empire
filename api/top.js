import { getDb, initDb } from '../../db';

export default async function handler(req, res) {
  try {
    await initDb();
    const db = await getDb();

    const topPlayers = await db.all(`
      SELECT user_id, coins
      FROM users
      ORDER BY coins DESC
      LIMIT 50
    `);

    res.status(200).json({ top: topPlayers });
  } catch (err) {
    console.error('❌ Ошибка при получении топа:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

