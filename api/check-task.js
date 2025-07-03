// /api/check-task.js

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Метод не поддерживается' });
  }

  try {
    const { user_id, taskKey, taskType } = req.body;

    if (!user_id || taskType !== 'vpn') {
      return res.status(400).json({ success: false, error: 'Неверные данные запроса' });
    }

    const userRef = db.collection('users').doc(user_id.toString());
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, error: 'Пользователь не найден' });
    }

    const user = userSnap.data();

    if (user.paidVpn) {
      await userRef.update({
        coins: (user.coins || 0) + 1000,
        [`tasks.${taskKey}`]: true,
      });

      return res.status(200).json({ success: true, message: 'VPN оплачен, монеты начислены' });
    } else {
      return res.status(200).json({ success: false, message: 'Оплата не найдена' });
    }

  } catch (err) {
    console.error('Ошибка в check-task:', err);
    return res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
}
