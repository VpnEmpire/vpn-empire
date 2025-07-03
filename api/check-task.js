import { json } from 'micro';
import admin from 'firebase-admin';
import serviceAccount from '../../firebase-secret.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://vpn-empire-admin.firebaseio.com',
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const body = await json(req);
    const { user_id } = body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'Missing user_id' });
    }

    const userRef = db.collection('users').doc(user_id);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = doc.data();

    if (userData.hasPaidVpn) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false, message: 'Payment not found' });
    }
  } catch (err) {
    console.error('Error checking task:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
