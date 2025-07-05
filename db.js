const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'data', 'database.sqlite');

if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath));
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка при подключении к базе данных:', err.message);
  } else {
    console.log('✅ База данных подключена');
  }
});

module.exports = db;
