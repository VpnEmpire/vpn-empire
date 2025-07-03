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
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const rawBody = await buffer(req);
    console.log('Raw webhook body:', rawBody.toString());

    const json = JSON.parse(rawBody.toString());
    console.log('Parsed webhook JSON:', json);

    if (json.event === 'payment.succeeded') {
      // Попытка взять userId из metadata
      let userId = json.object.metadata?.user_id;

      // Если user_id нет в metadata, попробуем достать из description
      if (!userId && json.object.description) {
        const match = json.object.description.match(/(\d+)/);
        if (match) {
          userId = match[1];
          console.log('User ID parsed from description:', userId);
        }
      }

      const amount = json.object.amount?.value;

      if (userId) {
        await db.collection('users').doc(userId).set({
          paid: true,
          amount: Number(amount),
          timestamp: Date.now(),
        }, { merge: true });

        console.log(`Payment recorded for user ${userId} amount ${amount}`);
        return res.status(200).send('OK');
      } else {
        console.log('User ID not found in webhook payload');
      }
    }

    return res.status(400).send('Invalid payload');
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).send('Internal Server Error');
  }
}

