require("dotenv").config();
const express = require("express");
const sql = require("mssql");

// Инициализация Express
const app = express();

// Получение данных из .env
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: "localhost", // Или ваш сервер
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Используется для Azure, если это не Azure, можно установить false
    trustServerCertificate: true, // Для работы с самоподписанными сертификатами
  },
};

// Конфигурация и подключение к базе данных
async function getTodos() {
  let pool;
  try {
    // Подключаемся к базе данных
    pool = await sql.connect(config);
    console.log("Connected to the database");

    // Выполняем запрос
    const result = await pool.request().query("SELECT * FROM Tasks");
    return result.recordset;
  } catch (err) {
    console.error("Error getting todos:", err);
    throw new Error("Database query failed");
  } finally {
    // Закрытие соединения с базой данных
    if (pool) {
      await pool.close();
    }
  }
}

// Эндпоинт для получения списка задач
app.get("/api/todoList", async (req, res) => {
  try {
    const todos = await getTodos();
    res.json(todos);
  } catch (err) {
    console.error("Error in /api/todoList endpoint:", err);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
