// /api/yookassa-webhook.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../../firebase-secret.json'; // путь к твоему ключу

// Инициализация Firebase Admin SDK
const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const event = req.body;

    if (
      event.event === 'payment.succeeded' &&
      event.object &&
      event.object.status === 'succeeded'
    ) {
      const userId = event.object.metadata?.user_id;

      if (!userId) {
        return res.status(400).json({ success: false, error: 'user_id missing in metadata' });
      }

      // Записываем в Firestore, что пользователь оплатил
      await db.collection('payments').doc(userId).set({
        paid: true,
        amount: event.object.amount.value,
        currency: event.object.amount.currency,
        timestamp: new Date(),
      });

      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid event data' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
