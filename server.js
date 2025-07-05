import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Сервер работает!');
});

app.listen(3001, () => {
  console.log('🚀 Сервер запущен на http://localhost:3001');
});
