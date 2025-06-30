// /api/checkUserPayment.js
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const userRef = db.collection('users').doc(user_id);
    const userDoc = await userRef.get();

    const data = userDoc.exists ? userDoc.data() : null;

    // Уже активировал VPN?
    if (data?.vpnActivated) {
      return res.status(200).json({ success: true, alreadyRewarded: true });
    }

    // Тут должна быть твоя логика проверки оплаты (например, флаг оплаты)
    if (data?.paid === true) {
      await userRef.update({
        coins: (data.coins || 0) + 1000,
        vpnActivated: true,
      });

      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false, message: 'Payment not found' });
    }

  } catch (err) {
    console.error('Ошибка:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
