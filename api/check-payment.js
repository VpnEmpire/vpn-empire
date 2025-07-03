import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Метод не поддерживается' });
  }

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ success: false, error: 'user_id обязателен' });
  }

  try {
    const userRef = db.collection('users').doc(user_id.toString());
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: 'Пользователь не найден' });
    }

    const userData = userDoc.data();

    if (userData.paid === true) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error('Ошибка при проверке оплаты:', error);
    return res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
}
