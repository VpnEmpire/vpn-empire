import admin from 'firebase-admin';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL,
  });
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const rawBody = await buffer(req);
    const json = JSON.parse(rawBody.toString());
    const data = json;

    console.log('📥 Webhook получен:', JSON.stringify(json));

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

      // Проверка: уже выполнено?
      const taskSnapshot = await db.ref(`users/${user_id}/completedTasks/activateVpn`).once('value');
      const alreadyCompleted = taskSnapshot.val();

      if (alreadyCompleted) {
        console.log(`⚠️ Задание уже выполнено для user_id: ${user_id}`);
        return res.status(200).json({ success: true });
      }

      // ✅ Обновляем Firebase Realtime Database
      await db.ref(`users/${user_id}/completedTasks/activateVpn`).set(true);
      await db.ref(`users/${user_id}/hasVpnBoost`).set(true);
      await db.ref(`users/${user_id}/coins`).transaction(current => (current || 0) + 1000);

      console.log(`🎉 Награда выдана: 1000 монет, VPN Boost активирован для user_id: ${user_id}`);
      return res.status(200).json({ success: true });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Ошибка в обработке webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
