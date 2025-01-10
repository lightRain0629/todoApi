require('dotenv').config();
const express = require('express');
const sql = require('mssql');

// Инициализация Express
const app = express();

// Получение данных из .env
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: 'localhost',
  database: process.env.DB_NAME,
  options: {
    encrypt: true,  // для Azure, если используется
    trustServerCertificate: true, // для работы с сертификатами
  },
};

// Конфигурация и подключение к базе данных
async function getTodos() {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Todos');
    return result.recordset;
  } catch (err) {
    console.error(err);
    throw new Error('Database query failed');
  }
}

// Эндпоинт для получения списка задач
app.get('/api/todoList', async (req, res) => {
  try {
    const todos = await getTodos();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving data' });
  }
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
