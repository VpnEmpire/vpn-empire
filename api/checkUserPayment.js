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

  const event = req.body;

  // Проверка, что пришёл успешный платёж
  if (event.event === 'payment.succeeded') {
    try {
      const paymentData = event.object;

      // Предполагается, что вы передаёте user_id как metadata.user_id
      const userId = paymentData.metadata?.user_id;

      if (!userId) {
        return res.status(400).json({ error: 'No user_id in metadata' });
      }

      // Добавим монеты пользователю в Firestore
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const currentCoins = userDoc.data().coins || 0;
        await userRef.update({ coins: currentCoins + 1000 });
      } else {
        await userRef.set({ coins: 1000 });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Ошибка при обработке оплаты:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(200).json({ message: 'Event ignored' });
  }
}
