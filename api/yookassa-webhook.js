import admin from 'firebase-admin';
import { buffer } from 'micro';

const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method not Allowed');
  }

  const rawBody = await buffer(req);
  console.log('Raw webhook body:', rawBody.toString());

  const json = JSON.parse(rawBody.toString());
  console.log('Parsed webhook JSON:', json);

  let userId = null;
  if (json.object.metadata?.user_id) {
    userId = json.object.metadata.user_id;
  } else if (json.object.description) {
    const match = json.object.description.match(/\d+/);
    if (match) {
      userId = match[0];
    }
  }

  if (json.event === 'payment.succeeded' && userId) {
    const amount = json.object.amount?.value;

    await db.collection('users').doc(userId).set({
      paid: true,
      amount: Number(amount),
      timestamp: Date.now(),
    }, { merge: true });

      if (!doc.exists) {
      // Новый пользователь — создаём запись
      await userRef.set({
        coins: 1000,
        vpnActivated: true,
        paid: true,
        amount: Number(amount),
        timestamp: Date.now(),
      });
    } else {
      const data = doc.data();
      if (!data.vpnActivated) {
        // Повторно не выдаём награду
        await userRef.update({
          coins: (data.coins || 0) + 1000,
          vpnActivated: true,
          paid: true,
          amount: Number(amount),
          timestamp: Date.now(),
        });
      }
    }
    return res.status(200).send('OK');
  }

  return res.status(400).send('Invalid payload');
}
