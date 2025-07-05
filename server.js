import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';

// Для корректной работы __dirname в ES-модуле
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создание папки data, если её нет
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Путь к базе данных
const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[DB ERROR]', err.message);
  } else {
    console.log('База данных подключена');
  }
});

// Загрузка init.sql
const initSqlPath = path.join(__dirname, 'init.sql');
const initSql = fs.readFileSync(initSqlPath, 'utf-8');
db.exec(initSql, (err) => {
  if (err) {
    console.error('[INIT SQL ERROR]', err.message);
  } else {
    console.log('Таблицы успешно инициализированы');
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Пример API
app.get('/', (req, res) => {
  res.send('Сервер работает ✅');
});

app.listen(3001, () => {
  console.log('Сервер запущен на http://localhost:3001');
});
