// /api/yookassa-webhook.js

import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: true, // Необходимо для получения JSON от ЮKassa
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const event = req.body;

  if (event.event === 'payment.succeeded') {
    const userId = event.object.metadata?.user_id;

    if (userId) {
      const filePath = path.resolve('./public/payments.json');
      let payments = {};

      if (fs.existsSync(filePath)) {
        payments = JSON.parse(fs.readFileSync(filePath));
      }

      payments[userId] = true;
      fs.writeFileSync(filePath, JSON.stringify(payments, null, 2));
    }
  }

  res.status(200).send('OK');
}

