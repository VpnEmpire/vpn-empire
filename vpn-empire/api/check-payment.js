// /api/check-payment.js

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { user_id } = req.query;
  const YOOKASSA_SECRET = process.env.YOOKASSA_SECRET;

  try {
    // Сначала пробуем проверить локальный файл
    const filePath = path.resolve('./public/payments.json');
    if (fs.existsSync(filePath)) {
      const payments = JSON.parse(fs.readFileSync(filePath));
      if (payments[user_id] === true) {
        return res.status(200).json({ success: true, source: 'local' });
      }
    }

    // Если в локальном файле нет — делаем запрос к ЮKassa
    const response = await fetch(`https://api.yookassa.ru/v3/payments`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(YOOKASSA_SECRET + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    const paymentFound = data.items?.some(payment =>
      payment.amount.value >= 100 &&
      payment.status === 'succeeded' &&
      payment.metadata?.user_id === user_id
    );

    if (paymentFound) {
      return res.status(200).json({ success: true, source: 'yookassa' });
    } else {
      return res.status(200).json({ success: false });
    }

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}


