// /api/check-payment.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { user_id } = req.query;

  const filePath = path.resolve('./public/payments.json');
  if (!fs.existsSync(filePath)) return res.json({ paid: false });

  const payments = JSON.parse(fs.readFileSync(filePath));
  const paid = payments[user_id] === true;

  res.json({ paid });
}

